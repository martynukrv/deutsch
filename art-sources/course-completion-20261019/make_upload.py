"""Checkpoint only prepared/QA-approved groups; exclude rejected or unfinished generations."""
from pathlib import Path
import hashlib,json,subprocess
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent
progress=json.loads((HERE/'progress.json').read_text())
paths=['.github/tests/course-art.cjs','art-inbox/catalog.json','assets/learning/course-art.js','index.html','docs/artwork/course-art-plan.md','docs/artwork/course-art-audit.json']
paths += [str(p.relative_to(ROOT))for p in HERE.iterdir()if p.is_file()and p.name!='upload.json']
for lesson,data in progress.items():
 if data['status']!='prepared':continue
 folder=HERE/f'lesson-{int(lesson):03d}'
 paths += [str(p.relative_to(ROOT))for p in folder.iterdir()if p.is_file()]
 paths += [f'art-inbox/course-lesson{lesson}.json',f'art-inbox/course-lesson{lesson}.zip']
items=[]
base=subprocess.check_output(['git','rev-parse','origin/main'],cwd=ROOT).decode().strip()
for path in sorted(set(paths)):
 raw=(ROOT/path).read_bytes();sha=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
 old=subprocess.run(['git','rev-parse',base+':'+path],cwd=ROOT,capture_output=True,text=True)
 if old.returncode==0 and old.stdout.strip()==sha:continue
 items.append({'path':path,'size':len(raw),'sha':sha})
(HERE/'upload.json').write_text(json.dumps({'head':base,'tree':subprocess.check_output(['git','rev-parse',base+'^{tree}'],cwd=ROOT).decode().strip(),'files':items},ensure_ascii=False))
print('Checkpoint',len(items),'files',sum(x['size']for x in items),'bytes; head',base)
