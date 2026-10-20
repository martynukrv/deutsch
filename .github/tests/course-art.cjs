const {chromium}=require('playwright'),{pathToFileURL}=require('url'),path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});try{const p=await b.newPage();await p.goto(process.env.ART_SITE_URL||pathToFileURL(path.resolve('index.html')).href);const result=await p.evaluate(()=>{
 window.speak=()=>{};const A=window.DEUTSCH_COURSE_ART,D=window.DEUTSCH_COURSE_DATA;let cards=0,images=0;
 if(!A)throw Error('Course art resolver not loaded');
 for(const [de,example] of Object.entries({ein:'ein Buch',eine:'eine Lampe',kein:'kein Buch',keine:'keine Lampe'}))if(!A.html(de).includes('>'+example+'</small>'))throw Error('Article example lost: '+de);
 const she=A.resolve('sie','вона'),they=A.resolve('sie','вони'),formal=A.resolve('Sie','Ви (ввічливо)');if(!she||!they||!formal||she.src===they.src||formal.src===she.src)throw Error('Pronoun meaning was lost');
 for(const [de,ua]of [['sein','його (присвійне)'],['ihr','її / їхній']]){const a=A.resolve(de,ua);if(a&&a.src===A.resolve(de,de==='sein'?'бути':'ви (до кількох людей)')?.src)throw Error('Possessive uses verb/person image')}
 for(const l of D.lessons){
  DEUTSCH_FULL_COURSE.open(l.id);const expected=l.words.filter(([de,ua])=>A.resolve(de.split(' — ')[0],ua.split(' — ')[0]));
  if(document.querySelectorAll('.course-art-preview,[data-cv2-action="word-page"],[data-cv2-action="forward"]').length)throw Error('Duplicate lesson navigation '+l.number);if(!document.querySelector('#cv2Practice [data-cv2-action="start-practice"]'))throw Error('Practice missing '+l.number);

  const rows=[...document.querySelectorAll('#cv2LessonWords .course-grid>.course-card')];if(rows.length!==l.words.length)throw Error('Word cards changed '+l.number);
  rows.forEach((r,n)=>{const [de,ua]=l.words[n],a=A.resolve(de.split(' — ')[0],ua.split(' — ')[0]),im=[...r.querySelectorAll('img')];if(im.length!==(a?.copies||0)||im.some(i=>i.getAttribute('src')!==a.src))throw Error('Wrong artwork '+l.number+': '+de);cards++;images+=im.length});
 }
 DEUTSCH_SOUNDS.open();DEUTSCH_SOUNDS.show('phrases');const greetings=[...document.querySelectorAll('#courseLessonView .course-grid>.course-card')];if(greetings.length!==8||greetings.some(c=>!c.querySelector('img')))throw Error('Greeting images missing in sounds section');
 return {cards,images};});
 await p.evaluate(()=>DEUTSCH_FULL_COURSE.glossary());await p.locator('#cv2WordList img').evaluateAll(xs=>xs.forEach(x=>x.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('#cv2WordList img')].every(x=>x.complete&&x.naturalWidth));
 const early=await p.evaluate(()=>DEUTSCH_COURSE_DATA.lessons.flatMap(l=>l.words.filter(([de,ua])=>!DEUTSCH_COURSE_ART.resolve(de.split(' — ')[0],ua.split(' — ')[0])).map(w=>l.number+': '+w[0])));if(early.length)throw Error('Course lessons have missing art: '+early.join(', '));
 for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:900});await p.evaluate(()=>{DEUTSCH_FULL_COURSE.open(DEUTSCH_COURSE_DATA.lessons[1].id)});await p.locator('#courseLessonView img').evaluateAll(xs=>xs.forEach(x=>x.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('#courseLessonView img')].every(x=>x.complete&&x.naturalWidth));if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+5))throw Error('Artwork overflow '+width)}
 console.log('PASS restored artwork across all 79 lessons: '+JSON.stringify(result)+'; sound greetings, pronoun meanings, gallery, plural reuse and 320–1280px');}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
