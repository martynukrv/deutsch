from pathlib import Path
from PIL import Image
import json,hashlib,io,zipfile,sys
P=Path(__file__).resolve().parents[2];out=P/'art-sources/phrase-scenes-20261020';im=Image.open(out/'original.png').convert('RGBA');a=im.getchannel('A').point(lambda v:255 if v>128 else 0);w,h=im.size

def cut(flags,target,radius):
 gaps=[];start=None
 for n in range(int(target-radius),int(target+radius)):
  if not flags[n] and start is None:start=n
  if flags[n] and start is not None:
   if n-start>=3:gaps.append((start,n))
   start=None
 if not gaps:raise ValueError(('No gutter',target))
 l,r=min(gaps,key=lambda z:0 if z[0]<=target<=z[1] else min(abs(target-z[0]),abs(target-z[1])))
 return (l+r)//2
ys=[0]+[cut(a.getprojection()[1],h*j/4,h*.07)for j in range(1,4)]+[h];print('rows',ys)
missing=json.loads((out/'queue.json').read_text());phraseindexes=[241,242,244,246,248,249,250,253,254,481,487,483,482,365,361,367]
items=[];meta=[];panels=[];files={}
for row in range(4):
 flags=a.crop((0,ys[row],w,ys[row+1])).getprojection()[0];xs=[0]+[cut(flags,w*j/4,w*.07)for j in range(1,4)]+[w]
 print('cols',row,xs)
 for col in range(4):
  i=row*4+col;p=missing[phraseindexes[i]];box=(xs[col],ys[row],xs[col+1],ys[row+1]);cell=im.crop(box);bb=cell.getchannel('A').point(lambda v:255 if v>128 else 0).getbbox();assert bb and min(bb[0],bb[1],cell.width-bb[2],cell.height-bb[3])>=1,(i,bb)
  crop=cell.crop((max(0,bb[0]-3),max(0,bb[1]-3),min(cell.width,bb[2]+3),min(cell.height,bb[3]+3)));scale=456/max(crop.size);crop=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',(512,512));canvas.alpha_composite(crop,((512-crop.width)//2,(512-crop.height)//2));buf=io.BytesIO();canvas.save(buf,format='PNG',optimize=True);raw=buf.getvalue();name='phrase_scene_'+str(i+1).zfill(2)+'.png';files[name]=raw
  items.append({'de':p['de'],'ua':p['ua'],'file':name});meta.append({'index':i,'phraseId':p['phraseId'],'de':p['de'],'ua':p['ua'],'cell':box,'alphaBounds':bb,'sha256':hashlib.sha256(raw).hexdigest()});panels.append(canvas)
with zipfile.ZipFile(P/'art-inbox/phrase-scenes-20261020.zip','w',zipfile.ZIP_DEFLATED)as z:
 for name,raw in files.items():z.writestr(name,raw)
manifest={'version':1,'category':'phrases','approved':True,'items':items};(P/'art-inbox/phrase-scenes-20261020.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
catpath=P/'art-inbox/catalog.json';cat=json.loads(catpath.read_text());cat['categories']['phrases']={'name':'Сцени до фраз','words':[{'de':x['de'],'ua':x['ua']}for x in items]};catpath.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
(out/'crop-plan.json').write_text(json.dumps({'approved':True,'sourceSha256':hashlib.sha256((out/'original.png').read_bytes()).hexdigest(),'operation':'Crop visually inspected transparent gutters, trim alpha bounds, resize proportionally and pad transparently. No recoloring or redraw.','items':meta},ensure_ascii=False,indent=2)+'\n')
contact=Image.new('RGB',(1024,1024),'#FFF1E5')
for i,panel in enumerate(panels):panel.thumbnail((248,248));contact.paste(panel,((i%4)*256,(i//4)*256),panel)
contact.save(str(out/'contact.png'))
print('Prepared',len(items),'scenes')
