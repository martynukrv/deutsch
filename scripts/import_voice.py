#!/usr/bin/env python3
"""Validate verified voice packages before preserving their MP3 bytes and exact bindings."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]

def audio_key(text):
    return re.sub(r'\s+', ' ', re.sub(r'[.!?]+$', '', text.strip().lower()))

def safe_source(root, relative):
    path = (root / relative).resolve()
    if not path.is_relative_to((root / 'audio-sources').resolve()):
        raise ValueError('Source outside audio-sources')
    return path

def collect(root=ROOT):
    pending, bindings, reports = {}, {}, []
    for manifest_path in sorted((root / 'audio-inbox').glob('*.json')):
        manifest = json.loads(manifest_path.read_text())
        batch = manifest['batch']
        if not re.fullmatch(r'[a-z0-9-]+', batch) or manifest.get('verified') is not True:
            raise ValueError('Voice batch is not verified')
        original = safe_source(root, manifest['source_file']).read_bytes()
        if hashlib.sha256(original).hexdigest() != manifest['source_sha256']:
            raise ValueError('Original voice recording changed')
        queue = json.loads(safe_source(root, manifest['queue_file']).read_text())['entries']
        entries = manifest['entries']
        if len(entries) != len(queue) or len(entries) != manifest['count']:
            raise ValueError('Recording count does not match the supplied script')
        previous_end, seen = 0, set()
        with zipfile.ZipFile(manifest_path.with_suffix('.zip')) as archive:
            names = archive.namelist()
            if len(names) != len(set(names)) or len(names) != len(entries):
                raise ValueError('Duplicate or missing voice file')
            for info in archive.infolist():
                p = PurePosixPath(info.filename)
                if p.is_absolute() or '..' in p.parts or '\\' in info.filename or info.file_size > 2 * 1024 * 1024:
                    raise ValueError('Unsafe voice archive')
            for expected, entry in zip(queue, entries):
                if (entry['id'], entry['text']) != (expected['id'], expected['text']):
                    raise ValueError('Recording order or transcript mismatch')
                key = audio_key(entry['text'])
                if key in seen or key in bindings:
                    raise ValueError('Duplicate voice binding')
                seen.add(key)
                filename = entry['file']
                if not re.fullmatch(r'rq[0-9]{3}_[a-z0-9_]+\.mp3', filename):
                    raise ValueError('Invalid voice filename')
                if entry['verification']['status'] not in ('exact-full', 'exact-isolated', 'exact-medium', 'homophone'):
                    raise ValueError('Unverified recording')
                if not (.15 < entry['duration'] < 5):
                    raise ValueError('Invalid clip duration')
                if not (previous_end - .01 <= entry['source_start'] < entry['speech_end'] < entry['source_end'] <= manifest['source_duration']):
                    raise ValueError('Overlapping or invalid source boundaries')
                previous_end = entry['source_end']
                raw = archive.read(filename)
                digest = hashlib.sha256(raw).hexdigest()
                if digest != entry['sha256'] or len(raw) < 1000 or not (raw[:3] == b'ID3' or raw[0] == 255):
                    raise ValueError('Invalid or changed MP3')
                dest = f'audio/{batch}/{Path(filename).stem}_{digest[:12]}.mp3'
                pending[dest] = raw
                bindings[key] = dest
                reports.append({'id': entry['id'], 'text': entry['text'], 'path': dest, 'sha256': digest, 'duration': entry['duration'], 'verification': entry['verification']['status']})
            if set(names) != {entry['file'] for entry in entries}:
                raise ValueError('Unbound voice file')
    return pending, bindings, reports

def main(root=ROOT):
    pending, bindings, reports = collect(root)
    if not reports:
        return
    for dest, raw in pending.items():
        p = root / dest
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(raw)
    out = root / 'assets/vocabulary'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'recorded-audio.js').write_text('/* Generated from verified original voice recordings. */\nwindow.DEUTSCH_RECORDED_AUDIO = ' + json.dumps(bindings, ensure_ascii=False, sort_keys=True) + ';\n')
    (out / 'voice-report.json').write_text(json.dumps({'count': len(reports), 'entries': reports}, ensure_ascii=False, indent=2) + '\n')
    print(f'Validated {len(reports)} voice clips; imported original MP3 bytes and exact bindings.')

if __name__ == '__main__':
    main()
