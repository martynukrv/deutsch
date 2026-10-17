#!/usr/bin/env python3
"""Crop an approved multi-category expansion without rebuilding original packages."""
import io
import json
from pathlib import Path
import re
import sys
import zipfile
from PIL import Image, ImageOps
from import_art import ROOT, collect, png_info

def prepare(plan_path):
    plan_path = Path(plan_path).resolve()
    plan = json.loads(plan_path.read_text())
    if plan.get('approved') is not True:
        raise ValueError('Approved selection required')
    groups = {}
    for item in plan['items']:
        source = (plan_path.parent / item['source']).resolve()
        if not source.is_relative_to(plan_path.parent):
            raise ValueError('Source outside plan directory')
        if not re.fullmatch(r'exp_[0-9]+\.png', item['name']):
            raise ValueError('Invalid crop filename')
        with Image.open(source) as im:
            l, t, r, b = item['box']
            if not (0 <= l < r <= im.width and 0 <= t < b <= im.height):
                raise ValueError('Crop outside source')
            crop = im.crop((l, t, r, b))
            crop = ImageOps.expand(crop.crop(crop.getbbox()), border=item['padding'], fill=(0, 0, 0, 0))
            output = io.BytesIO(); crop.save(output, format='PNG'); raw = output.getvalue()
        png_info(raw)
        if item['category'] == 'category-icons':
            if item['de'] not in ('clothes', 'nature'):
                raise ValueError('Unknown category icon')
            (ROOT / f'assets/illustrations/categories/{item["de"]}.png').write_bytes(raw)
        else:
            if not re.fullmatch(r'[a-z]+', item['category']):
                raise ValueError('Invalid category')
            groups.setdefault(item['category'], []).append((item, raw))
    for category, entries in groups.items():
        archive = ROOT / f'art-inbox/expansion-{category}.zip'
        manifest = {'version': 1, 'category': category, 'approved': True, 'items': []}
        with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
            for item, raw in entries:
                info = zipfile.ZipInfo(item['name'], (2026, 10, 17, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                z.writestr(info, raw)
                manifest['items'].append({'de': item['de'], 'ua': item['ua'], 'file': item['name']})
        archive.with_suffix('.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    collect(ROOT)
    print(f'Prepared {len(plan["items"])} original crops across {len(groups)} vocabulary packages.')

if __name__ == '__main__':
    prepare(sys.argv[1])
