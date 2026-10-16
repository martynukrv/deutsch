from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage
import json,zipfile,hashlib
ROOT=Path(__file__).resolve().parents[2]
source=Path(__file__).with_name('approved-sheet.png')
im=Image.open(source).convert('RGBA')
names=['rot','blau','gruen','gelb','schwarz','weiss','grau','braun','orange','rosa','lila']
xs=[15,320,625,930,1240];ys=[130,470,800,1150]
out=ROOT/'assets/illustrations/colors';out.mkdir(parents=True,exist_ok=True)
report=[]
for i,name in enumerate(names):
 x=i%4;y=i//4;box=(xs[x],ys[y],xs[x+1],ys[y+1]);part=im.crop(box)
 # Keep the generated paint swatch; omit disconnected extraction specks.
 a=np.array(part.getchannel('A'));labels,_=ndimage.label(a>16);sizes=np.bincount(labels.ravel());sizes[0]=0
 keep=ndimage.binary_dilation(labels==int(sizes.argmax()),iterations=1)
 part.putalpha(Image.fromarray(np.where(keep,a,0).astype('uint8')))
 bb=part.getchannel('A').getbbox()
 assert bb and min(bb[0],bb[1],part.width-bb[2],part.height-bb[3])>0,(name,bb,'Touches crop boundary')
 part=part.crop(bb);assert max(part.size)<=300,(name,part.size)
 canvas=Image.new('RGBA',(340,340));canvas.paste(part,((340-part.width)//2,(340-part.height)//2));p=out/(name+'.png');canvas.save(p)
 report.append({'name':name,'source_box':box,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
words=json.loads((ROOT/'art-inbox/catalog.json').read_text())['categories']['colors']['words']
manifest={'version':1,'category':'colors','approved':True,'items':[{'de':w['de'],'ua':w['ua'],'file':f'assets/illustrations/colors/{n}.png'} for w,n in zip(words,names)]}
(ROOT/'art-inbox/colors.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(ROOT/'art-inbox/colors.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
 for n in names:
  p=out/(n+'.png');z.write(p,p.relative_to(ROOT))
source.with_name('crop-report.json').write_text(json.dumps(report,indent=2)+'\n')
print('11 uniform paint swatch PNGs, transparent 340x340 canvases; no redraw or recoloring.')
