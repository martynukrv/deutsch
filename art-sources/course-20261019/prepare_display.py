"""Reproduce crop/resize/padding only; never draw or recolor original artwork."""
import json
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent
for item in json.loads((root/'preparation.json').read_text()):
    with Image.open(root/item['original']) as im:
        im=im.convert('RGBA').crop(tuple(item['alphaCrop']))
        im.thumbnail((480,480),Image.Resampling.LANCZOS)
        out=Image.new('RGBA',(512,512))
        out.alpha_composite(im,((512-im.width)//2,(512-im.height)//2))
        out.save(root/item['display'],optimize=True)
