from pathlib import Path
from PIL import Image,ImageDraw
import json
ROOT=Path(__file__).resolve().parents[1]
im=Image.open(ROOT/'art-sources/pronouns/original-sheet.png')
regions={
'ich':(12,10,270,267),'du':(297,10,528,267),'er':(531,27,866,274),'sie_she':(870,30,1216,276),'es':(1217,36,1535,280),
'wir':(8,352,278,593),'ihr':(279,379,598,600),'Sie_formal':(598,330,895,606),'sie_they':(880,355,1217,591),'derjenige':(1210,352,1535,594),
'diejenige':(10,680,313,904),'dasjenige':(320,687,577,904),'alle':(578,690,958,960),'jemand':(949,668,1221,928),'niemand':(1230,685,1528,912)}
polygons={
'alle':[(578,690),(958,690),(958,908),(712,908),(712,960),(578,960)],
'jemand':[(949,668),(1221,668),(1221,908),(1110,908),(1110,914),(1015,914),(1015,928),(949,928)],
'Sie_formal':[(750,330),(895,330),(895,590),(714,590),(714,603),(598,603),(598,400),(750,400)]}
out=ROOT/'assets/illustrations/pronouns';out.mkdir(parents=True,exist_ok=True)
for name,box in regions.items():
 source=im.copy()
 import numpy as np
 from scipy import ndimage
 components={'ich':[2,13,17,23,25],'du':[1,12,22],'er':[3,8,9,15],'sie_she':[4,7,10,20],'es':[5,18,11,21],'wir':[43,75],'ihr':[47,50,72],'Sie_formal':[42,52,61,70],'sie_they':[48,44,46],'derjenige':[45,51,54,62],'diejenige':[100,107,118],'dasjenige':[101,121,115,123,144,146],'alle':[103,104],'jemand':[99],'niemand':[102,105,106]}
 alpha=np.array(im.getchannel('A'));labels,_=ndimage.label(alpha>10)
 keep=ndimage.binary_dilation(np.isin(labels,components[name]),iterations=2)
 source.putalpha(Image.fromarray(np.where(keep,alpha,0).astype('uint8')))
 # Labels are excluded geometrically; no pixels are drawn or recolored.
 if name=='ihr':
  a=np.array(source.getchannel('A'));a[588:,398:480]=0;source.putalpha(Image.fromarray(a))
 if name in polygons:
  mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(polygons[name],fill=255)
  import PIL.ImageChops
  source.putalpha(PIL.ImageChops.multiply(source.getchannel('A'),mask))
 crop=source.crop(box)
 # Retain the exact original artwork pixels and transparency; add breathing room.
 bb=crop.getchannel('A').getbbox();crop=crop.crop(bb)
 padded=Image.new('RGBA',(crop.width+24,crop.height+24));padded.paste(crop,(12,12));padded.save(out/(name+'.png'))
import zipfile
with zipfile.ZipFile(ROOT/'art-inbox/pronouns.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
 for p in sorted(out.glob('*.png')):z.write(p,p.relative_to(ROOT))
print('Re-cropped all 15 illustrations from the original sheet; no drawing or recoloring.')
