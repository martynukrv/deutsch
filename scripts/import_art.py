#!/usr/bin/env python3
"""Import transparent artwork ZIPs from art-inbox/ into the live site.

Archive layout:
  pronouns.zip -> assets/illustrations/pronouns/<image>.png
  animals.zip  -> assets/illustrations/animals/<image>.png
  OR archive may contain assets/illustrations/<category>/<image>.png.
No image is redrawn, recompressed, or recolored.
"""
from pathlib import Path
import re
import struct
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
INBOX = ROOT / "art-inbox"
OUT = ROOT / "assets" / "illustrations"
CATEGORIES = {
    "pronouns", "verbs", "colors", "numbers", "greetings", "family",
    "people", "food", "home", "school", "time", "questions", "grammar",
    "body", "animals", "places", "transport", "lessons",
}
PRONOUNS = {
    "ich", "du", "er", "sie_she", "es", "wir", "ihr", "sie_they",
    "Sie_formal", "derjenige", "diejenige", "dasjenige", "alle",
    "jemand", "niemand",
}

def png_info(raw: bytes):
    if len(raw) < 33 or raw[:8] != b"\x89PNG\r\n\x1a\n" or raw[12:16] != b"IHDR":
        raise ValueError("Not a PNG")
    width, height = struct.unpack(">II", raw[16:24])
    color_type = raw[25]
    if not (32 <= width <= 4096 and 32 <= height <= 4096):
        raise ValueError(f"Invalid image size: {width}x{height}")
    if color_type not in (4, 6) and b"tRNS" not in raw:
        raise ValueError("PNG lacks alpha channel/transparency")
    return width, height

def target_for(name: str, archive: Path):
    path = Path(name.replace("\\", "/"))
    if path.is_absolute() or ".." in path.parts:
        raise ValueError("Unsafe archive path")
    parts = list(path.parts)
    if len(parts) >= 4 and parts[:2] == ["assets", "illustrations"]:
        category = parts[2]
        filename = parts[-1]
    else:
        category = archive.stem.lower().replace("_", "-")
        if category.endswith("-transparent"):
            category = category[:-12]
        if category.startswith("deutsch-"):
            category = category[8:]
        if category.startswith("pronouns"):
            category = "pronouns"
        filename = parts[-1]
    if category not in CATEGORIES:
        raise ValueError(f"Unknown category '{category}' in {archive.name}")
    if not re.fullmatch(r"[A-Za-z0-9_-]+\.png", filename):
        raise ValueError(f"Invalid filename: {filename}")
    if category == "pronouns" and Path(filename).stem not in PRONOUNS:
        raise ValueError(f"Unknown pronoun asset: {filename}")
    return OUT / category / filename

def main():
    archives = sorted(INBOX.glob("*.zip"))
    if not archives:
        print("No art ZIP archives in art-inbox/")
        return
    imported = []
    for archive in archives:
        with zipfile.ZipFile(archive) as z:
            for info in z.infolist():
                if info.is_dir() or info.filename.startswith("__MACOSX/"):
                    continue
                if not info.filename.lower().endswith(".png"):
                    raise ValueError(f"Only PNG files are allowed: {info.filename}")
                if info.file_size > 8 * 1024 * 1024:
                    raise ValueError(f"File exceeds 8 MB: {info.filename}")
                dest = target_for(info.filename, archive)
                raw = z.read(info)
                size = png_info(raw)
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(raw)
                imported.append(str(dest.relative_to(ROOT)))
                print(f"Imported {dest.relative_to(ROOT)} ({size[0]}x{size[1]})")
    print(f"Imported {len(imported)} original PNGs; no image modifications.")
    if not imported:
        raise ValueError("Archives contain no PNG images")

if __name__ == "__main__":
    main()
