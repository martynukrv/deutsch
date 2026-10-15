#!/usr/bin/env python3
"""Crop approved transparent sheets into a category ZIP; never draw or recolor.
Usage: python3 scripts/prepare_art.py art-sources/<category>/crop-plan.json
Plan: {category, approved: true, items: [{de, ua, source, box:[l,t,r,b], name}]}
source is relative to the plan; archive names are <name>.png. Keep source files in Git.
For prepared separate PNGs, omit box: bytes are copied exactly.
"""
import argparse
import io
import json
from pathlib import Path
import re
import zipfile
from PIL import Image
from import_art import ROOT, png_info

def prepare(plan_path):
    plan_path = Path(plan_path).resolve()
    plan = json.loads(plan_path.read_text())
    if plan.get('approved') is not True:
        raise ValueError('Artistic result must be approved before packaging')
    category = plan['category']
    catalog = json.loads((ROOT / 'art-inbox/catalog.json').read_text())
    if category not in catalog['categories']:
        raise ValueError('Unknown category')
    expected = {(w['de'], w['ua']) for w in catalog['categories'][category]['words']}
    seen, files, items = set(), {}, []
    for item in plan['items']:
        key = (item['de'], item['ua'])
        if key not in expected or key in seen:
            raise ValueError('Unknown or duplicate word')
        seen.add(key)
        source = (plan_path.parent / item['source']).resolve()
        if not source.is_relative_to(plan_path.parent):
            raise ValueError('Source must be beside or beneath the crop plan')
        name = item['name'] + '.png'
        if not re.fullmatch(r'[A-Za-z0-9_-]+\.png', name) or name in files:
            raise ValueError('Invalid or duplicate output name')
        raw = source.read_bytes()
        if 'box' in item:
            with Image.open(io.BytesIO(raw)) as im:
                box = item['box']
                if len(box)!=4 or not all(type(n) is int for n in box):
                    raise ValueError('Crop box must contain four pixel coordinates')
                l,t,r,b = box
                if not (0 <= l < r <= im.width and 0 <= t < b <= im.height):
                    raise ValueError('Crop box outside sheet')
                cropped = im.crop(tuple(box))
                output = io.BytesIO();cropped.save(output,format='PNG');raw = output.getvalue()
        png_info(raw)
        files[name] = raw
        items.append({'de':key[0], 'ua':key[1], 'file':name})
    if seen != expected:
        raise ValueError('Crop plan must cover the complete category')
    archive = ROOT / f'art-inbox/{category}.zip'
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
        for name,raw in files.items():
            info=zipfile.ZipInfo(name,date_time=(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,raw)
    archive.with_suffix('.json').write_text(json.dumps({'version':1,'category':category,'approved':True,'items':items},ensure_ascii=False,indent=2)+'\n')
    print(f'Packaged {len(items)} images from approved originals: {archive.relative_to(ROOT)}')

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plan');args=parser.parse_args();prepare(args.plan)
