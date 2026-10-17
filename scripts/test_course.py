import hashlib,json,re,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent

def read_js(name):
 text=(ROOT/name).read_text();return json.loads(text[text.index('=')+1:].strip().rstrip(';'))

class CourseAuditTests(unittest.TestCase):
 def test_complete_ordered_catalog(self):
  d=read_js('assets/learning/course-data.js');self.assertEqual(len(d['lessons']),80);self.assertEqual(len(d['modules']),12);seen=set()
  for lesson in d['lessons']:
   self.assertNotIn(lesson['id'],seen);self.assertTrue(set(lesson['prerequisiteIds'])<=seen);seen.add(lesson['id']);self.assertGreaterEqual(len(lesson['phrases']),8)
   for p in lesson['phrases']:self.assertEqual(p['de'].split()[p['gapIndex']].rstrip('.,!?;:'),p['gap'])
  self.assertEqual(sum('context' in l for l in d['lessons']),12)
 def test_recording_queue_is_canonical_and_current(self):
  report=json.loads((ROOT/'audio/recording/course-80-missing.json').read_text());lines=(ROOT/'audio/recording/course-80-missing.txt').read_text().splitlines();self.assertEqual(lines,[p['text']+' [pause]' for p in report['missing']]);self.assertEqual(len(lines),len(set(lines)))
  self.assertEqual(report['totalTexts'],report['recordedTexts']+len(lines));self.assertEqual(report['sourceDigest'],hashlib.sha256((ROOT/'assets/learning/course-data.js').read_bytes()).hexdigest())
  for n,p in enumerate(report['missing'],1):self.assertEqual(p['id'],f'course80-audio-{n:04d}');self.assertTrue(p['refs']);self.assertTrue(p['lessonIds']);self.assertIsNone(p['recordedFiles'])
 def test_legacy_phrase_ids_are_unchanged(self):
  phrases=read_js('assets/learning/phrase-catalog.js');self.assertEqual(len({p['id'] for p in phrases}),len(phrases));raw=json.dumps(phrases[:494],ensure_ascii=False,separators=(',',':')).encode();self.assertEqual(hashlib.sha256(raw).hexdigest(),'c302d067a116237d5e6fb1ed9cb423a7d5131282fcfeb6fcd829146770c9c0dc')

if __name__=='__main__':unittest.main()
