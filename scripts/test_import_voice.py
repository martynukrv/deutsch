import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from import_voice import ROOT, collect, main

class VoiceImportTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        shutil.copytree(ROOT / 'audio-inbox', self.root / 'audio-inbox')
        shutil.copytree(ROOT / 'audio-sources', self.root / 'audio-sources')
    def change(self, callback):
        p = self.root / 'audio-inbox/henri-20261017.json'
        data = json.loads(p.read_text()); callback(data); p.write_text(json.dumps(data))
    def test_original_clip_bytes(self):
        pending, bindings, report = collect(self.root)
        self.assertEqual((len(pending), len(bindings), len(report)), (409, 409, 409))
        main(self.root)
        for dest, raw in pending.items():
            self.assertEqual(raw, (self.root / dest).read_bytes())
            self.assertEqual(hashlib.sha256(raw).hexdigest(), next(e['sha256'] for e in report if e['path'] == dest))
    def test_count_mismatch(self):
        self.change(lambda m: m['entries'].pop())
        with self.assertRaises(ValueError): collect(self.root)
    def test_order_mismatch(self):
        self.change(lambda m: m['entries'].reverse())
        with self.assertRaises(ValueError): collect(self.root)
    def test_changed_audio(self):
        self.change(lambda m: m['entries'][0].update(sha256='0' * 64))
        with self.assertRaises(ValueError): collect(self.root)
    def test_unverified_batch_is_not_imported(self):
        self.change(lambda m: m.update(verified=False))
        with self.assertRaises(ValueError): main(self.root)
        self.assertFalse((self.root / 'audio').exists())

if __name__ == '__main__': unittest.main()
