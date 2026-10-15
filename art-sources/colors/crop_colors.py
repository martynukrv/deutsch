from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage
import json,zipfile,hashlib
ROOT=Path(__file__).resolve().parents[2]
source=Path(__file__).with_name('approved-sheet.png')
im=Image.open(source).convert('RGBA')
a=np.array(im.getchannel('A'));labels,_=ndimage.label(a>16);sizes=np.bincount(labels.ravel());keep=sizes>=60;keep[0]=False
mask=ndimage.binary_dilation(keep[labels],iterations=1);im.putalpha(Image.fromarray(np.where(mask,a,0).astype('uint8')))
names=['rot','blau','gruen','gelb','schwarz','weiss','grau','braun','orange','rosa','lila']
xs=[0,384,768,1152,1536];ys=[0,373,684,1024]
out=ROOT/'assets/illustrations/colors';out.mkdir(parents=True,exist_ok=True)
report=[]
for i,name in enumerate(names):
 x=i%4;y=i//4;row_edges=ys if x in (0,3) else [0,373,670,1024];box=(xs[x],row_edges[y],xs[x+1],row_edges[y+1]);part=im.crop(box);bb=part.getchannel('A').getbbox()
 assert bb and min(bb[0],bb[1],part.width-bb[2],part.height-bb[3])>0,(name,bb,'Touches crop boundary')
 part=part.crop(bb);canvas=Image.new('RGBA',(part.width+32,part.height+32));canvas.paste(part,(16,16));p=out/(name+'.png');canvas.save(p)
 report.append({'name':name,'source_box':box,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
words=json.loads((ROOT/'art-inbox/catalog.json').read_text())['categories']['colors']['words']
assert len(words)==len(names)==11
manifest={'version':1,'category':'colors','approved':True,'items':[{'de':w['de'],'ua':w['ua'],'file':f'assets/illustrations/colors/{n}.png'} for w,n in zip(words,names)]}
(ROOT/'art-inbox/colors.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(ROOT/'art-inbox/colors.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
 for n in names:
  p=out/(n+'.png');z.write(p,p.relative_to(ROOT))
source.with_name('crop-report.json').write_text(json.dumps(report,indent=2)+'\n')
print('11 complete PNG crops; original artwork, transparent 16px margins, brand palette only.')
