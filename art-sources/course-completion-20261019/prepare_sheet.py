"""Crop a visually checked lesson atlas; preserve originals and exact incremental bindings."""
import argparse,hashlib,io,json,shutil,sys,zipfile
from pathlib import Path
from PIL import Image
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(ROOT/'scripts'));from import_art import png_info
p=argparse.ArgumentParser();p.add_argument('lesson',type=int);p.add_argument('sheet');p.add_argument('--approved',action='store_true',required=True);a=p.parse_args()
queue=json.loads((HERE/'queue.json').read_text());g=next(x for x in queue['groups'] if x['lesson']==a.lesson)
source=Path(a.sheet).resolve();raw=source.read_bytes();png_info(raw)
out=HERE/f'lesson-{a.lesson:03d}';out.mkdir(exist_ok=True)
gen=json.loads((out/'generation.json').read_text())if(out/'generation.json').exists()else{}
if gen.get('words'):
 original={w['id']:w for w in g['words']}
 assert all(w['id']in original for w in gen['words'])
 g['words']=[{**original[w['id']],**w}for w in gen['words']]
g['cols']=gen.get('cols',g['cols']);g['rows']=gen.get('rows',g['rows'])
items=[];files={};meta=[]
overrides=json.loads((out/'cell-overrides.json').read_text())if(out/'cell-overrides.json').exists()else{}
with Image.open(io.BytesIO(raw)) as im:
 im=im.convert('RGBA');width,height=im.size
 # Locate real transparent gutters near the requested grid; generated atlases are not always exact grids.
 foreground=im.getchannel('A').point(lambda v:255 if v>128 else 0)
 def cut_near(flags,target,radius):
  lo=max(0,int(target-radius));hi=min(len(flags),int(target+radius));gaps=[];begin=None
  for k in range(lo,hi+1):
   clear=k<hi and not flags[k]
   if clear and begin is None:begin=k
   if not clear and begin is not None:
    if k-begin>=6:gaps.append((begin,k))
    begin=None
  if not gaps:raise ValueError('No clear gutter near '+str(target))
  left,right=min(gaps,key=lambda z:(0 if z[0]<=target<=z[1]else min(abs(target-z[0]),abs(target-z[1])),-(z[1]-z[0])))
  return (left+right)//2
 yflags=foreground.getprojection()[1]
 ycuts=[0]+[cut_near(yflags,j*height/g['rows'],height/g['rows']*.24)for j in range(1,g['rows'])]+[height]
 xcuts={}
 for row in range(g['rows']):
  used=min(g['cols'],len(g['words'])-row*g['cols'])
  if used<=0:continue
  if all(str(row*g['cols']+col)in overrides for col in range(used)):
   xcuts[row]=[round(j*width/g['cols'])for j in range(g['cols'])]+[width]
   continue
  flags=foreground.crop((0,ycuts[row],width,ycuts[row+1])).getprojection()[0]
  xcuts[row]=[0]+[cut_near(flags,j*width/g['cols'],width/g['cols']*.24)for j in range(1,used)]+[width]
 for i,w in enumerate(g['words']):
  col=i%g['cols'];row=i//g['cols'];box=(xcuts[row][col],ycuts[row],xcuts[row][col+1],ycuts[row+1])
  box=tuple(overrides.get(str(i),box))
  cell=im.crop(box);alpha=cell.getchannel('A');bbox=alpha.point(lambda v:255 if v>128 else 0).getbbox()
  if not bbox:raise ValueError('Empty cell '+w['de'])
  if bbox[0]<3 or bbox[1]<3 or bbox[2]>cell.width-3 or bbox[3]>cell.height-3:raise ValueError('Artwork reaches cell edge: '+w['de']+' '+str(bbox))
  crop=(max(0,bbox[0]-4),max(0,bbox[1]-4),min(cell.width,bbox[2]+4),min(cell.height,bbox[3]+4))
  art=cell.crop(crop);art.thumbnail((480,480),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',(512,512));canvas.alpha_composite(art,((512-art.width)//2,(512-art.height)//2));buf=io.BytesIO();canvas.save(buf,format='PNG',optimize=True);display=buf.getvalue();png_info(display)
  filename=w['name']+'.png';files[filename]=display;items.append({'de':w['de'],'ua':w['ua'],'file':filename})
  meta.append({'id':w['id'],'de':w['de'],'ua':w['ua'],'scene':w['scene'],'cell':box,'alphaCropInCell':crop,'geometryAlphaThreshold':128,'file':filename,'sha256':hashlib.sha256(display).hexdigest()})
 assert len(files)==len(g['words'])
 # Source and package are saved only after all crops validate.
if source!=(out/'original.png').resolve():shutil.copyfile(source,out/'original.png')
archive=ROOT/f'art-inbox/course-lesson{a.lesson}.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for name,data in files.items():
  info=zipfile.ZipInfo(name,date_time=(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,data)
manifest={'version':1,'category':'course','approved':True,'items':items};archive.with_suffix('.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(out/'crop-plan.json').write_text(json.dumps({'lesson':g['lesson'],'cols':g['cols'],'rows':g['rows'],'originalSha256':hashlib.sha256(raw).hexdigest(),'approved':True,'operation':'Crop equal cells verified visually, crop alpha bounds, proportional fit to 480px and transparent padding to 512px; never draw or recolor','items':meta},ensure_ascii=False,indent=2)+'\n')
catpath=ROOT/'art-inbox/catalog.json';cat=json.loads(catpath.read_text());known={(x['de'],x['ua'])for x in cat['categories']['course']['words']}
for w in g['words']:
 if (w['de'],w['ua'])not in known:cat['categories']['course']['words'].append({'de':w['de'],'ua':w['ua']});known.add((w['de'],w['ua']))
catpath.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
progresspath=HERE/'progress.json';progress=json.loads(progresspath.read_text())if progresspath.exists()else{}
progress[str(a.lesson)]={'status':'prepared','count':len(items),'source':str((out/'original.png').relative_to(ROOT)),'sourceSha256':hashlib.sha256(raw).hexdigest(),'package':str(archive.relative_to(ROOT))};progresspath.write_text(json.dumps(progress,ensure_ascii=False,indent=2)+'\n')
print('Prepared lesson',a.lesson,len(items),'word illustrations')
