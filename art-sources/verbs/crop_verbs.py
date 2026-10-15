from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage
import json,zipfile,hashlib
ROOT=Path(__file__).resolve().parents[2]
SOURCES=Path(__file__).parent
names=[['machen','sagen','fragen','lieben','lachen','wohnen','singen','spielen','tanzen','sein','haben','gehen'],['kommen','sehen','hoeren','sprechen','lernen','arbeiten','essen','trinken','schlafen','lesen','schreiben','wissen'],['kennen','wollen','koennen','muessen','brauchen','geben','nehmen','finden','kaufen','fahren','bleiben']]
boxes=[[(15,15,350,390),(360,15,740,390),(750,15,1060,390),(1070,15,1448,390),(15,395,350,715),(355,395,740,715),(745,395,1060,715),(1065,395,1448,715),(10,715,405,1086),(410,715,720,1086),(730,715,1060,1086),(1070,715,1448,1086)],[(5,10,405,400),(410,10,735,400),(745,10,1060,400),(1060,10,1448,400),(15,400,370,740),(380,400,720,740),(740,400,1070,740),(1075,400,1448,729),(10,740,385,1086),(395,740,720,1086),(735,740,1070,1086),(1075,729,1448,1086)],[(5,15,385,420),(390,15,735,420),(750,15,1080,420),(1090,15,1448,430),(5,425,355,745),(360,425,750,745),(755,425,1075,745),(1085,425,1448,745),(5,745,390,1086),(400,745,700,1086),(705,745,1105,1086)]]
out=ROOT/'assets/illustrations/verbs';out.mkdir(parents=True,exist_ok=True)
report=[]
for sheet_index,(batch,regions) in enumerate(zip(names,boxes),1):
 im=Image.open(SOURCES/f'sheet-{sheet_index:02}.png').convert('RGBA')
 # Retain source color and edge alpha, excluding isolated extraction specks.
 alpha=np.array(im.getchannel('A'));labels,_=ndimage.label(alpha>16);sizes=np.bincount(labels.ravel());keep=sizes>=60;keep[0]=False;mask=ndimage.binary_dilation(keep[labels],iterations=1);im.putalpha(Image.fromarray(np.where(mask,alpha,0).astype('uint8')))
 for name,box in zip(batch,regions):
  part=im.crop(box);bb=part.getchannel('A').getbbox()
  assert bb and min(bb[0],bb[1],part.width-bb[2],part.height-bb[3])>0,(name,box,bb,'Touches boundary')
  part=part.crop(bb);canvas=Image.new('RGBA',(part.width+32,part.height+32));canvas.paste(part,(16,16));p=out/(name+'.png');canvas.save(p)
  report.append({'name':name,'source':f'sheet-{sheet_index:02}.png','box':box,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
words=json.loads((ROOT/'art-inbox/catalog.json').read_text())['categories']['verbs']['words']
flat=[n for batch in names for n in batch];assert len(flat)==len(words)==35
manifest={'version':1,'category':'verbs','approved':True,'items':[{'de':w['de'],'ua':w['ua'],'file':f'assets/illustrations/verbs/{n}.png'} for w,n in zip(words,flat)]}
(ROOT/'art-inbox/verbs.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(ROOT/'art-inbox/verbs.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
 for n in flat:
  p=out/(n+'.png');z.write(p,p.relative_to(ROOT))
(SOURCES/'crop-report.json').write_text(json.dumps(report,indent=2)+'\n')
print('Prepared 35 original verb PNG crops with clear transparent borders.')
