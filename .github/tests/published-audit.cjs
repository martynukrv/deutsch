const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const errors=[],failed=[];
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/audio/'))failed.push(r.status()+' '+r.url())});
 fs.mkdirSync('audit-screenshots',{recursive:true});
 try{
  await page.goto('https://martynukrv.github.io/deutsch/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(1200);
  if(!/Deutsch 16/.test(await page.title()))throw Error('Published page title incorrect');
  await page.screenshot({path:'audit-screenshots/mobile-home.png',fullPage:true});
  // Capture the full lesson path and exercise UI, not just the home/dictionary views.
  await page.locator('#homeTab').click();
  const lessonNav=page.locator('#learningPath');
  if(await lessonNav.count()){
   await page.screenshot({path:'audit-screenshots/mobile-learning-path.png',fullPage:true});
   await page.locator('[data-stage="0"]').click();
   await page.screenshot({path:'audit-screenshots/mobile-lesson.png',fullPage:true});
  }
  await page.locator('#wordsTab').click();
  await page.screenshot({path:'audit-screenshots/mobile-dictionary.png',fullPage:true});
  await page.locator('#vocabIconGrid [data-cat="0"]').click();
  await page.screenshot({path:'audit-screenshots/mobile-category.png',fullPage:true});
  // GitHub Pages deployment can lag behind the pushed commit; retry navigation when the quiz button is temporarily hidden.
  if(!await page.locator('#startVocabQuiz').isVisible()){
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(1000);
   await page.locator('#wordsTab').click();
   await page.locator('#vocabIconGrid [data-cat="0"]').click();
  }
  if(!await page.locator('#startVocabQuiz').isVisible())throw Error('Published quiz button is hidden after dictionary navigation');
  await page.locator('#startVocabQuiz').click();
  if(!await page.locator('#vocabQuiz').isVisible())throw Error('Quiz did not open from click');
  await page.screenshot({path:'audit-screenshots/mobile-quiz.png',fullPage:true});
  const btn=page.locator('[data-vq]').first();
  if(await btn.count())await btn.click();
  await page.locator('#vqExit').click();
  await page.locator('#progressTab').click();
  await page.screenshot({path:'audit-screenshots/mobile-progress.png',fullPage:true});
  await page.locator('#homeTab').click();
  await page.setViewportSize({width:1280,height:800});
  await page.screenshot({path:'audit-screenshots/desktop-home.png',fullPage:true});
  await page.locator('#wordsTab').click();
  await page.screenshot({path:'audit-screenshots/desktop-dictionary.png',fullPage:true});
  const audio=await page.evaluate(()=>Object.values(AUDIO_MAP));
  const unique=[...new Set(audio)];
  const check=await page.evaluate(async names=>Promise.all(names.map(async name=>{
   for(let attempt=0;attempt<3;attempt++){try{const r=await fetch(name,{method:'GET',cache:'no-store'});const bytes=(await r.arrayBuffer()).byteLength;if(r.ok&&bytes>=100)return {name,ok:true,status:r.status,bytes,attempt};if(attempt===2)return {name,ok:false,status:r.status,bytes}}catch(e){if(attempt===2)return {name,ok:false,error:String(e)}}await new Promise(resolve=>setTimeout(resolve,600*(attempt+1)))}
  })),unique);
  const bad=check.filter(x=>!x.ok||x.bytes<100);
  console.log('PUBLISHED AUDIO',JSON.stringify({total:unique.length,bad:bad.slice(0,15),badCount:bad.length}));
  console.log('HTTP FAILURES',JSON.stringify(failed.slice(0,20)));
  console.log('JS ERRORS',JSON.stringify(errors));
  if(bad.length||errors.length||failed.length)throw Error('Published audit failures: audio '+bad.length+', JS '+errors.length+', HTTP '+failed.length);
  console.log('PASS published-site UI clicks, screenshots, all audio HTTP requests');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

