import io
import json
from pathlib import Path
import shutil
import tempfile
import unittest
import zipfile
from PIL import Image
from import_art import ROOT, collect, main, png_info

class ArtworkTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        shutil.copytree(ROOT / 'art-inbox', self.root / 'art-inbox')
    def manifest(self, change):
        p = self.root / 'art-inbox/pronouns.json'
        m = json.loads(p.read_text()); change(m); p.write_text(json.dumps(m))
    def test_originals_and_distinct_sie(self):
        pending, bindings, report = collect(self.root)
        self.assertEqual(len(report), 15)
        with zipfile.ZipFile(self.root / 'art-inbox/pronouns.zip') as z:
            for dest, raw in pending.items(): self.assertEqual(raw, z.read(dest))
        entries = bindings['Займенники']
        self.assertNotEqual(entries['["sie","вона"]'], entries['["sie","вони"]'])
        main(self.root)
        for dest, raw in pending.items(): self.assertEqual(raw, (self.root / dest).read_bytes())
    def test_missing_word(self):
        self.manifest(lambda m:m['items'].pop())
        with self.assertRaises(ValueError): collect(self.root)
    def test_duplicate_word(self):
        self.manifest(lambda m:m['items'].append(m['items'][0]))
        with self.assertRaises(ValueError): collect(self.root)
    def test_unapproved(self):
        self.manifest(lambda m:m.update(approved=False))
        with self.assertRaises(ValueError): main(self.root)
        self.assertFalse((self.root / 'assets').exists())
    def test_opaque_rejected(self):
        b=io.BytesIO();Image.new('RGBA',(64,64),'white').save(b,format='PNG')
        with self.assertRaises(ValueError): png_info(b.getvalue())
    def test_traversal_rejected(self):
        with zipfile.ZipFile(self.root / 'art-inbox/pronouns.zip','a') as z:z.writestr('../escape.png',b'bad')
        with self.assertRaises(ValueError): collect(self.root)

if __name__ == '__main__': unittest.main()
