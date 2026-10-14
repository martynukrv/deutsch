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
 console.log('PASS Chromium smoke test');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
