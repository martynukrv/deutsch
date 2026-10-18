"""Build reviewed, authored course text. No machine translation or Cartesian phrase generation."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parent.parent
plan=json.loads((ROOT/'docs/curriculum-v2.json').read_text())
authored={}
for file in sorted((ROOT/'scripts/course-source').glob('lessons-*.txt')):
 for chunk in file.read_text().split('@@')[1:]:
  lines=chunk.strip().splitlines();n=int(lines[0]);rule=lines[1];vocab=[]
  for unit in lines[2].split(';'):
   de,ua=unit.split('=',1);vocab.append([de.strip(),ua.strip()])
  phrases=[]
  for row in lines[3:]:
   if not row.strip():continue
   marked,ua=row.split('|',1);m=re.search(r'~([^~]+)~',marked)
   if not m or marked.count('~')!=2:raise ValueError((n,row))
   de=marked.replace('~','');gap_index=len(marked[:m.start()].split());tokens=de.split()
   if tokens[gap_index].strip('.,!?')!=m.group(1):raise ValueError((n,row,gap_index))
   phrases.append({'de':de,'ua':ua,'gapIndex':gap_index,'gap':m.group(1)})
  if n in authored or len(phrases)<8:raise ValueError((n,'duplicate or too few examples'))
  authored[n]={'rule':rule,'words':vocab,'phrases':phrases}
# First lesson has its own phonetics flow. Checkpoints reuse only earlier course material.
lessons=[];by_number={}
for meta in plan['lessons']:
 n=meta['number'];base={k:meta[k] for k in ['id','number','module','titleUk','goalUk','prerequisiteIds','kind']}
 if n==1:base.update({'special':'first-lesson','rule':'Читання та перші вісім фраз — у спеціальному вступному уроці.','words':[['Hallo!','Привіт!'],['Guten Morgen!','Добрий ранок!'],['Guten Tag!','Добрий день!'],['Guten Abend!','Добрий вечір!'],['Tschüss!','Бувай!'],['Auf Wiedersehen!','До побачення!'],['Danke!','Дякую!'],['Bitte!','Будь ласка!']],'phrases':[{'de':de,'ua':ua,'gapIndex':0,'gap':de.split()[0].rstrip('!'),'sourceLessonId':meta['id']} for de,ua in [['Hallo!','Привіт!'],['Guten Morgen!','Добрий ранок!'],['Guten Tag!','Добрий день!'],['Guten Abend!','Добрий вечір!'],['Tschüss!','Бувай!'],['Auf Wiedersehen!','До побачення!'],['Danke!','Дякую!'],['Bitte!','Будь ласка!']]]})
 elif meta['kind']=='checkpoint':
  previous=[l for l in lessons if l['module']==meta['module'] and l['kind']!='checkpoint']
  if n==80:previous=[by_number[k] for k in [11,23,27,33,41,47,52,59,64,71,73,76,77,78,79]]
  base.update({'rule':'Застосовуємо вже вивчені правила разом. Спочатку прочитай приклади; у вправі відтворюй пропущену форму, складай речення або вибирай потрібне значення. Нової обов’язкової граматики тут немає.','words':[], 'phrases':[{**p,'sourceLessonId':l['id']} for l in previous for p in l['phrases']]})
 else:
  if n not in authored:raise ValueError(('Missing authored lesson',n))
  base.update(authored[n]);base['phrases']=[{**p,'sourceLessonId':meta['id']} for p in base['phrases']]
 lessons.append(base);by_number[n]=base
assert len(lessons)==80
assert len(authored)==len([l for l in lessons if l['kind']!='checkpoint' and l['number']!=1])
# Keep the original catalog prefix byte-semantically stable and reuse exact existing pairs.
def read_assignment(path):
 s=path.read_text();return json.loads(s[s.index('=')+1:].strip().rstrip(';'))
phrasepath=ROOT/'assets/learning/phrase-catalog.js'
old=read_assignment(phrasepath)
old=[p for p in old if not p.get('courseV2')]
words=read_assignment(ROOT/'assets/learning/word-catalog.js')
lookup={json.dumps([p['de'],p['ua']],ensure_ascii=False):p for p in [*old,*words]}
new=list(old)
def register(de,ua,source,lexical=False):
 key=json.dumps([de,ua],ensure_ascii=False);entry=lookup.get(key)
 if not entry:
  digest=hashlib.sha256(key.encode()).hexdigest()[:16]
  entry={'id':('course-lexeme-' if lexical else 'course-phrase-')+digest,'kind':'phrase','de':de,'ua':ua,'lessonIds':[],'courseV2':True}
  if lexical:entry['lexical']=True
  lookup[key]=entry;new.append(entry)
 # Do not mutate original entries or their established lesson mappings.
 if entry.get('courseV2') and source not in entry['lessonIds']:entry['lessonIds'].append(source)
 return entry['id']
contexts=json.loads((ROOT/'scripts/course-source/contexts.json').read_text())
lexicon={}
for lesson in lessons:
 if str(lesson['number']) in contexts:
  lesson['context']=contexts[str(lesson['number'])];lesson['context']['text']=' '.join(lesson['context']['sentences']);lesson['context']['phraseId']=register(lesson['context']['text'],'Текст для розуміння: '+lesson['titleUk'],lesson['id'])
 if lesson['number']==79:
  lesson['bonus']=[{'de':'Übung macht den Meister.','ua':'Практика веде до майстерності.'},{'de':'Ende gut, alles gut.','ua':'Все добре, що добре закінчується.'}]
  for b in lesson['bonus']:b['phraseId']=register(b['de'],b['ua'],lesson['id'])
 for p in lesson['phrases']:p['phraseId']=register(p['de'],p['ua'],lesson['id'])
 for de,ua in lesson['words']:
  # Principal parts stay in the lesson; dictionary headwords are their infinitives.
  head=de.split(' — ')[0];meaning=ua.split(' — ')[0];key=json.dumps([head,meaning],ensure_ascii=False)
  if key not in lexicon:lexicon[key]={'id':register(head,meaning,lesson['id'],True),'de':head,'ua':meaning,'lessonIds':[]}
  lexicon[key]['lessonIds'].append(lesson['id'])
plurals=json.loads((ROOT/'scripts/course-source/noun-plurals.json').read_text())
number_notes=json.loads((ROOT/'scripts/course-source/noun-number-notes.json').read_text())
for w in lexicon.values():
 if w['de'] in number_notes:w['numberNote']=number_notes[w['de']]
 if w['de'] in plurals:w['plural']=plurals[w['de']]
assert len({p['id'] for p in new})==len(new)
data={'version':2,'modules':plan['modules'],'lessons':lessons,'lexicon':list(lexicon.values())}
(ROOT/'assets/learning/course-data.js').write_text('/* Authored course, generated by scripts/build_course.py. */\nwindow.DEUTSCH_COURSE_DATA = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
phrasepath.write_text('/* Permanent phrase IDs; original entries preserved. */\nwindow.DEUTSCH_LEARNING_PHRASES = '+json.dumps(new,ensure_ascii=False,separators=(',',':'))+';\n')
plan['status']='implemented'
for meta in plan['lessons']:meta['status']='implemented';meta['implementation']='assets/learning/first-lesson.js' if meta['number']==1 else 'assets/learning/course-player.js'
(ROOT/'docs/curriculum-v2.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'lessons':len(lessons),'authoredLessons':len(authored),'phraseOccurrences':sum(len(l['phrases']) for l in lessons),'registryPairs':len(new),'courseLexicon':len(lexicon)},ensure_ascii=False))
