const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve('index.html')).href,{waitUntil:'load'});
 await page.waitForTimeout(500);
 const result=await page.evaluate(()=>{
  const ids=['homeView','vocabView','trainerView','progressView','learningPath','wordGrid','vocabIconGrid','mic','startVocabQuiz'];
  const check=Object.fromEntries(ids.map(id=>[id,!!document.getElementById(id)]));
  return {title:document.title,check,groups:typeof lessonGroups!=='undefined'?lessonGroups.length:null,categories:typeof vocabCategories!=='undefined'?vocabCategories.length:null,taskCount:typeof tasks!=='undefined'?tasks.length:null,diagnostic:typeof runDeutschDiagnostics==='function'};
 });
 console.log('APP',JSON.stringify(result));
 if(errors.length)throw new Error('JavaScript errors: '+errors.join('; '));
 if(Object.values(result.check).some(x=>!x)||!result.diagnostic||!result.taskCount)throw new Error('Missing UI or tasks');
 await page.evaluate(()=>{setMode('words')});
 await page.waitForTimeout(200);
 console.log('VOCAB',await page.locator('#wordGrid').innerText().then(s=>s.slice(0,120)));
 await page.evaluate(()=>startVocabQuiz(false));
 await page.waitForTimeout(100);
 console.log('QUIZ',await page.evaluate(()=>({active:vq.active,items:vq.items.length})));
 await page.evaluate(()=>{
   const item=vq.items[vq.index];
   if(item.type==='de'||item.type==='ua'){
     const target=item.type==='de'?item.w[0]:item.w[1];
     answerVq(null,item,target);
     if(!vq.locked||vq.correct!==1)throw new Error('Correct quiz answer did not register');
   }
 });
 await page.evaluate(()=>endVocabQuiz());
 await page.evaluate(()=>startVocabQuiz(false));
 const second=await page.evaluate(()=>({active:vq.active,locked:vq.locked,index:vq.index}));
 if(!second.active||second.locked||second.index!==0)throw new Error('Quiz restart failed');
 await page.waitForTimeout(3300);
 const afterTimer=await page.evaluate(()=>({index:vq.index,active:vq.active}));
 if(afterTimer.index!==0||!afterTimer.active)throw new Error('Old quiz timer advanced a new session');
 console.log('QUIZ RESTART',JSON.stringify(afterTimer));
 await page.evaluate(()=>endVocabQuiz());
 await page.evaluate(()=>{setMode('home')});
 await page.setViewportSize({width:1280,height:800});
 await page.waitForTimeout(100);
 if(errors.length)throw new Error('JavaScript errors: '+errors.join('; '));
 // Exercise incorrect answer, retry-only flow, and completed lesson summary.
 await page.evaluate(()=>{
   setMode('words');
   startVocabQuiz(false);
   const it=vq.items[vq.index];
   answerVq(null,it,'__definitely_wrong__');
   if(vq.wrong!==1||vq.missed.length!==1)throw new Error('Wrong answer not recorded');
   const firstMiss=vq.missed[0].w[0];
   showVqSummary();
   startVocabQuiz(true);
   if(!vq.active||vq.items.length===0||vq.items.some(x=>x.w[0]!==firstMiss))throw new Error('Missed-word retry not limited to missed word');
   endVocabQuiz();
   setMode('trainer');
   if(!tasks.length)throw new Error('No lesson tasks');
   showSummary();
   if(document.getElementById('prompt').textContent!=='Готово!')throw new Error('Lesson summary missing');
   const next=document.getElementById('next');
   next.click();
   if(!tasks.length||i!==0)throw new Error('New lesson session failed');
 });
 console.log('PASS incorrect answer, retry mistakes, lesson summary and restart');

 // Verify both mascot moods are visible and image files resolve, including on mobile.
 await page.evaluate(()=>{
  setMode('trainer');
  setMascotReaction('trainerMascot','happy');
  if(!document.querySelector('#trainerMascot img[src$="boy-happy.svg"]'))throw Error('Correct-answer mascot missing');
  setMascotReaction('trainerMascot','encourage');
  if(!document.querySelector('#trainerMascot img[src$="girl-encourage.svg"]'))throw Error('Incorrect-answer mascot missing');
  setMode('words');startVocabQuiz(false);
  setMascotReaction('vqMascot','happy');
  if(!document.querySelector('#vqMascot img[src$="boy-happy.svg"]'))throw Error('Quiz mascot missing');
  endVocabQuiz();
 });
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:800});
  await page.evaluate(()=>{setMode('trainer');setMascotReaction('trainerMascot','encourage')});
  await page.waitForFunction(()=>{const el=document.querySelector('#trainerMascot img');return el&&el.complete&&el.naturalWidth>0},{timeout:10000});
  const state=await page.evaluate(()=>{
   const el=document.querySelector('#trainerMascot img');
   const box=el.getBoundingClientRect();
   return {loaded:el.complete&&el.naturalWidth>0,visible:box.width>0&&box.height>0,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+5};
  });
  if(!state.loaded||!state.visible||state.overflow)throw Error('Mascot layout failure at '+width+'px: '+JSON.stringify(state));
 }
 console.log('PASS mascot expressions and responsive visual layout');

 // Verify progress persists across a reload and check mobile/desktop overflow.
 const storage=await page.evaluate(()=>{setMode('words');startVocabQuiz(false);const it=vq.items[vq.index];recordVq(it,true);return {key:vqStatsKey(),word:it.w[0],value:localStorage.getItem(vqStatsKey())}});
 if(!storage.value||!JSON.parse(storage.value)[storage.word.toLocaleLowerCase('de-DE')])throw new Error('Vocabulary progress not saved');
 await page.reload({waitUntil:'load'});
 const persisted=await page.evaluate(({key,word})=>{const obj=JSON.parse(localStorage.getItem(key)||'{}');return obj[word.toLocaleLowerCase('de-DE')]},storage);
 if(!persisted||persisted.ok<1)throw new Error('Vocabulary progress lost on reload');
 console.log('PASS localStorage progress reload');
 for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:800});
   const info=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
   if(info.scroll>info.client+5)throw new Error('Horizontal page overflow at '+width+'px: '+JSON.stringify(info));
 }
 console.log('PASS responsive widths 320/390/768/1280');
 const artAudit=await page.evaluate(()=>{
  const generic=new Set(['star','book','people','person','question','questionmark','speech','smile','heart','hand','clock','cat','car','house','school','numbers','palette','run']);
  const categories=vocabCategories.map(c=>{
   const entries=c.words.map(w=>{
    const key=doodleWord(w[0]);
    const exists=key.startsWith('swatch:')||key.startsWith('number:')||Object.prototype.hasOwnProperty.call(doodleShapes,key);
    return {word:w[0],art:key,exists,generic:generic.has(key),fallback:key==='star'};
   });
   return {category:c.name,total:entries.length,missing:entries.filter(x=>!x.exists),generic:entries.filter(x=>x.generic).map(x=>x.word+' → '+x.art),fallback:entries.filter(x=>x.fallback).map(x=>x.word)};
  });
  const all=categories.flatMap(c=>c.missing);
  const mapping=categories.flatMap(c=>c.generic);
  return {total:categories.reduce((n,c)=>n+c.total,0),missing:all,sharedGenericCount:mapping.length,categories};
 });
 console.log('ART AUDIT',JSON.stringify(artAudit));
 if(artAudit.total!==220)throw Error('Vocabulary count changed: '+artAudit.total);
 if(artAudit.missing.length)throw Error('Undefined illustration keys: '+JSON.stringify(artAudit.missing));
 const audio=await page.evaluate(()=>Object.values(AUDIO_MAP));
 if(audio.length<100)throw new Error('Too few mapped audio files: '+audio.length);
 const fs=require('fs');
 const missing=[...new Set(audio)].filter(name=>!fs.existsSync(path.resolve(name)));
 console.log('AUDIO FILES',audio.length,'missing',missing.length,missing.slice(0,25));
 if(missing.length)throw new Error('Missing mapped audio: '+missing.slice(0,12).join(', '));
 // Generate every lesson in the actual browser, verifying nonempty exercises.
 const lessons=await page.evaluate(()=>{
   const report=[],old=selectedLesson;
   for(let n=0;n<flatStages().length;n++){
     selectedLesson=n;
     newSession();
     report.push({lesson:n,taskCount:tasks.length,valid:tasks.every(t=>t&&typeof t.de==='string'&&t.de.trim()&&typeof t.ua==='string'&&t.ua.trim())});
   }
   selectedLesson=old;newSession();
   return report;
 });
 console.log('LESSONS',JSON.stringify(lessons));
 if(lessons.some(x=>!x.taskCount||!x.valid))throw new Error('Some lessons have empty or invalid exercises');
 console.log('PASS Chromium smoke test');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
