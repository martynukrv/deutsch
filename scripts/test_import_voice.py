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
        count = sum(json.loads(p.read_text())['count'] for p in (self.root / 'audio-inbox').glob('*.json'))
        self.assertEqual((len(pending), len(bindings), len(report)), (count, count, count))
        self.assertEqual(sum(dest.startswith('audio/henri-20261017/') for dest in pending), 409)
        self.assertEqual(sum(dest.startswith('audio/henri-lessons-20261017/') for dest in pending), 44)
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
    def test_legacy_clips_still_have_short_duration_limit(self):
        self.change(lambda m: m['entries'][0].update(duration=6))
        with self.assertRaises(ValueError): collect(self.root)
    def test_cannot_relabel_legacy_recording_as_long_course_text(self):
        self.change(lambda m: m['entries'][0].update(duration=6, kind='course-text'))
        with self.assertRaises(ValueError): collect(self.root)
    def test_course_batch_matches_frozen_first_part(self):
        source = self.root / 'audio-sources/henri-course-part1-20261018/queue.json'
        if not source.exists(): self.skipTest('Course recording package not present')
        queue = json.loads(source.read_text())['entries']
        canonical = json.loads((ROOT / 'audio/recording/course-80-missing.json').read_text())['missing'][:223]
        self.assertEqual([(e['id'], e['text']) for e in queue], [(e['id'], e['text']) for e in canonical])
        self.assertEqual(sum(e['kind'] == 'course-text' for e in queue), 12)
        _, _, report = collect(self.root)
        self.assertEqual(sum(e['path'].startswith('audio/henri-course-part1-20261018/') for e in report), 223)
    def test_course_text_cannot_exceed_long_limit(self):
        p = self.root / 'audio-inbox/henri-course-part1-20261018.json'
        if not p.exists(): self.skipTest('Course recording package not present')
        manifest = json.loads(p.read_text())
        manifest['entries'][0]['duration'] = 60
        p.write_text(json.dumps(manifest))
        with self.assertRaises(ValueError): collect(self.root)
    def test_second_course_batch_matches_frozen_second_part(self):
        p = self.root / 'audio-sources/henri-course-part2-20261018/queue.json'
        if not p.exists(): self.skipTest('Second course recording package not present')
        queue = json.loads(p.read_text())
        canonical = json.loads((ROOT / 'audio/recording/course-80-missing.json').read_text())['missing'][223:446]
        self.assertEqual(queue['range'], [224, 446])
        self.assertEqual([(e['id'], e['text']) for e in queue['entries']], [(e['id'], e['text']) for e in canonical])
        _, _, report = collect(self.root)
        self.assertEqual(sum(e['path'].startswith('audio/henri-course-part2-20261018/') for e in report), 223)

if __name__ == '__main__': unittest.main()
