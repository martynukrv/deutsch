"""Prepare this incremental package from generated originals; crop/scale/pad only."""
import hashlib, io, json, zipfile
from pathlib import Path
from PIL import Image
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
plan=json.loads((HERE/'crop-plan.json').read_text())
catalog=json.loads((ROOT/'art-inbox/catalog.json').read_text())
expected={(w['de'],w['ua']) for w in catalog['categories']['course']['words']}
items=[];meta=[];files={}
for row in plan['items']:
    assert (row['de'],row['ua']) in expected
    original=HERE/row['source']
    with Image.open(original) as im:
        im=im.convert('RGBA');box=im.getchannel('A').getbbox()
        assert box
        im=im.crop(box);im.thumbnail((480,480),Image.Resampling.LANCZOS)
        out=Image.new('RGBA',(512,512));out.alpha_composite(im,((512-im.width)//2,(512-im.height)//2))
        data=io.BytesIO();out.save(data,format='PNG',optimize=True)
    name=row['name']+'.png';raw=data.getvalue();(HERE/name).write_bytes(raw);files[name]=raw
    items.append({'de':row['de'],'ua':row['ua'],'file':name})
    meta.append({'de':row['de'],'ua':row['ua'],'original':row['source'],'originalSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'alphaCrop':box,'display':name,'operation':'Alpha crop, proportional 480px fit and transparent padding to 512x512; no drawing/recoloring.'})
assert len(files)==len(items)==4
with zipfile.ZipFile(ROOT/'art-inbox/course-lesson14.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
    for name,raw in files.items():
        info=zipfile.ZipInfo(name,date_time=(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,raw)
(ROOT/'art-inbox/course-lesson14.json').write_text(json.dumps({'version':1,'category':'course','approved':True,'items':items},ensure_ascii=False,indent=2)+'\n')
(HERE/'preparation.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
print('Prepared four lesson 14 images; previous package preserved.')
