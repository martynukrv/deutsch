from pathlib import Path
from PIL import Image
import hashlib,json
import numpy as np
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
source=Path(__file__).with_name('approved-sheet.png')
im=Image.open(source).convert('RGBA')
# Remove isolated alpha-extraction specks; retain original RGB and edge alpha.
a=np.array(im.getchannel('A'));labels,_=ndimage.label(a>16);sizes=np.bincount(labels.ravel());keep=sizes>=80;keep[0]=False
mask=ndimage.binary_dilation(keep[labels],iterations=2)
im.putalpha(Image.fromarray(np.where(mask,a,0).astype('uint8')))
names=['pronouns','verbs','colors','numbers','greetings','family','people','food','home','school','time','questions','grammar','body','animals','transport']
xs=[0,320,640,935,1254];ys=[0,345,660,940,1254]
out=ROOT/'assets/illustrations/categories';out.mkdir(parents=True,exist_ok=True)
report=[]
for i,name in enumerate(names):
 x=i%4;y=i//4;edges=xs if y!=3 else [0,320,615,935,1254];box=(edges[x],ys[y],edges[x+1],ys[y+1]);part=im.crop(box);bb=part.getchannel('A').getbbox()
 assert bb and bb[0]>0 and bb[1]>0 and bb[2]<part.width and bb[3]<part.height,(name,bb,'Touches crop boundary')
 part=part.crop(bb)
 canvas=Image.new('RGBA',(384,384));canvas.paste(part,((384-part.width)//2,(384-part.height)//2))
 p=out/(name+'.png');canvas.save(p)
 report.append({'category':name,'source_box':box,'path':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(out/'category-art-report.json').write_text(json.dumps(report,indent=2)+'\n')
print('16 original icon crops, transparent 384x384 canvases; no drawing, recoloring or scaling.')
