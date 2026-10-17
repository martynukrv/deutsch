const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const path=require('path'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ART_SITE_URL||pathToFileURL(path.resolve('index.html')).href,{waitUntil:'load'});
  await page.evaluate(()=>{localStorage.removeItem('deutsch16_vocab_modes_v1');vqModes=loadVqModes();openVocabCategory(7)});
  if(await page.locator('[data-vq-mode][aria-pressed="true"]').count()!==1||await page.locator('[data-vq-mode="ua"]').getAttribute('aria-pressed')!=='true')throw Error('Beginner default must be German-to-Ukrainian only');
  await page.locator('#startVocabQuiz').click();
  if(!await page.evaluate(()=>vq.items.length>0&&vq.items.every(it=>it.type==='ua')))throw Error('Unselected exercise in beginner practice');
  await page.locator('#vqExit').click();
  await page.locator('[data-vq-mode="ua"]').click();
  if(!await page.locator('#startVocabQuiz').isDisabled())throw Error('Empty selection should disable regular training');
  await page.locator('[data-vq-mode="de"]').click();await page.locator('[data-vq-mode="write"]').click();
  await page.reload({waitUntil:'load'});await page.evaluate(()=>openVocabCategory(7));
  if(!await page.evaluate(()=>JSON.stringify(vqModes)===JSON.stringify(['de','write'])))throw Error('Mode selection lost on reload');
  await page.locator('#startVocabQuiz').click();
  let choice=await page.evaluate(()=>vq.items[vq.index].w[0]);
  await page.locator('[data-vq]').evaluateAll((els,answer)=>els.find(el=>el.dataset.vq===answer).click(),choice);
  if(!await page.evaluate(()=>vq.correct===1&&vq.locked))throw Error('Ukrainian-to-German choice failed');
  await page.locator('#vqExit').click();await page.locator('#startVocabQuiz').click();
  await page.evaluate(()=>{const types=vq.items.map(it=>it.type);if(types.some(t=>!['de','write'].includes(t))||!types.includes('write')||types.lastIndexOf('de')>types.indexOf('write'))throw Error('Practice must use selected modes in difficulty order');vq.index=vq.items.findIndex(it=>it.type==='write');renderVq()});
  await page.locator('#vqWriteForm button[type="submit"]').click();
  if(!await page.evaluate(()=>vq.correct===0&&vq.wrong===0&&!!document.getElementById('vqWriteError').textContent))throw Error('Empty answer counted');
  await page.locator('#vqWriteInput').fill('M');await page.locator('[data-vq-letter="ä"]').click();
  if(await page.locator('#vqWriteInput').inputValue()!=='Mä')throw Error('German character insertion failed');
  await page.locator('#vqWriteInput').fill('__incorrect__');await page.locator('#vqWriteInput').press('Enter');
  if(!await page.evaluate(()=>vq.wrong===1&&vq.locked&&document.getElementById('vqResult').textContent.includes(vq.items[vq.index].w[0])))throw Error('Writing error feedback/scoring failed');
  await page.locator('#vqExit').click();await page.locator('#startVocabQuiz').click();
  const expected=await page.evaluate(()=>{vq.index=vq.items.findIndex(it=>it.type==='write');renderVq();return vq.items[vq.index].w[0]});
  await page.locator('#vqWriteInput').fill(expected);await page.locator('#vqWriteInput').press('Enter');
  if(!await page.evaluate(()=>vq.correct===1&&vq.wrong===0&&vq.locked))throw Error('Correct German writing not accepted');
  await page.locator('#vqExit').click();await page.locator('[data-vq-mode="de"]').click();await page.locator('[data-vq-mode="write"]').click();
  await page.locator('#startFinalVocabQuiz').click();
  await page.evaluate(()=>{if(!vq.isFinal||VQ_TYPES.some(t=>!vq.items.some(it=>it.type===t))||vqModes.length)throw Error('Final must include all skills without changing preferences');const it=vq.items[0];recordVq(it,false);showVqSummary()});
  await page.locator('#vqRetry').click();
  if(!await page.evaluate(()=>vq.items.length>0&&new Set(vq.items.map(it=>JSON.stringify(it.w.slice(0,2)))).size===1&&vq.types.length===5))throw Error('Retry must retain skills and limit to missed word');
  await page.evaluate(()=>{vq.items.forEach(it=>recordVq(it,true));showVqSummary()});await page.locator('#vqAgain').click();
  if(!await page.evaluate(()=>vq.active&&!vq.finished&&vq.types.length===5&&vqModes.length===0))throw Error('Restart after final review must work with empty saved selection');
  await page.locator('#vqExit').click();
  await page.evaluate(()=>{startVocabQuiz(false,true);vq.index=vq.items.findIndex(it=>it.type==='listen');renderVq();window.originalSpeak=speak;speak=text=>{window.lastHeard=text}});
  await page.locator('#vqPlay').click();
  if(!await page.evaluate(()=>window.lastHeard===vq.items[vq.index].w[0]))throw Error('Listening playback uses wrong word');
  choice=await page.evaluate(()=>vq.items[vq.index].w[1]);
  await page.locator('[data-vq]').evaluateAll((els,answer)=>els.find(el=>el.dataset.vq===answer).click(),choice);
  if(!await page.evaluate(()=>vq.correct===1&&vq.locked))throw Error('Listening answer failed');
  await page.evaluate(()=>{speak=window.originalSpeak});await page.locator('#vqExit').click();
  // Microphone calls are mocked: verify transcripts and cancellation without requesting hardware.
  await page.evaluate(()=>{window.SpeechRecognition=class{constructor(){window.testRecognition=this}start(){}stop(){this.onend?.()}abort(){this.aborted=true}};startVocabQuiz(false,true);vq.index=vq.items.findIndex(it=>it.type==='speak');renderVq()});
  await page.locator('#vqMic').click();
  await page.evaluate(()=>{const r=window.testRecognition,it=vq.items[vq.index],result=[{transcript:it.w[0],confidence:.9}];result.isFinal=true;r.onresult({resultIndex:0,results:[result]});r.onend();if(vq.correct!==1||!vq.locked||!document.getElementById('vqVoice').textContent.includes(it.w[0]))throw Error('Speech transcript/result failed')});
  await page.locator('#vqExit').click();
  await page.evaluate(()=>{startVocabQuiz(false,true);const pos=vq.items.findIndex((it,i)=>it.type==='speak'&&i<vq.items.length-1);vq.index=pos;renderVq()});
  await page.locator('#vqMic').click();
  await page.evaluate(()=>{window.oldRecognition=window.testRecognition;window.oldEnd=window.oldRecognition.onend;window.oldResult=window.oldRecognition.onresult});
  await page.locator('#vqNext').click();
  await page.evaluate(()=>{const r=window.oldRecognition,result=[{transcript:'late',confidence:1}];result.isFinal=true;window.oldResult({resultIndex:0,results:[result]});window.oldEnd();if(!r.aborted||vq.correct!==0||vq.wrong!==1||vq.recognition)throw Error('Late recognition changed next question')});
  await page.locator('#vqExit').click();
  await page.evaluate(()=>{window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined;startVocabQuiz(false,true);vq.index=vq.items.findIndex(it=>it.type==='speak');renderVq()});
  await page.locator('#vqMic').click();
  if(!await page.locator('#vqWriteForm').isVisible())throw Error('Unavailable speech needs usable writing alternative');
  await page.locator('#vqWriteInput').fill(await page.evaluate(()=>vq.items[vq.index].w[0]));await page.locator('#vqWriteInput').press('Enter');
  if(!await page.evaluate(()=>vq.correct===1&&vq.locked))throw Error('Speech writing alternative cannot complete question');
  await page.locator('#vqExit').click();
  // Full final completion includes a result for every skill and can be restarted.
  await page.evaluate(()=>{startVocabQuiz(false,true);vq.items.forEach(it=>recordVq(it,true));showVqSummary();if(Object.keys(vq.byType).length!==5)throw Error('Missing per-skill results')});
  if(await page.locator('.vq-breakdown span').count()!==5)throw Error('Final breakdown missing');
  await page.locator('#vqAgain').click();if(!await page.evaluate(()=>vq.isFinal&&vq.index===0&&vq.correct===0&&vqModes.length===0))throw Error('Final restart changed selection or score');
  await page.locator('#vqExit').click();
  fs.mkdirSync('audit-screenshots',{recursive:true});
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>openVocabCategory(7));
   if(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+5))throw Error('Settings overflow at '+width);
   await page.locator('#vocabTestLaunch').scrollIntoViewIfNeeded();await page.screenshot({path:`audit-screenshots/vocab-settings-${width}.png`,fullPage:true});
   await page.evaluate(()=>{vqModes=['write'];startVocabQuiz(false)});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+5))throw Error('Writing overflow at '+width);
   await page.screenshot({path:`audit-screenshots/vocab-writing-${width}.png`,fullPage:true});await page.locator('#vqExit').click();
  }
  // New categories and added words must be part of every selected practice skill.
  await page.evaluate(()=>{
   if(vocabCategories.length!==18||vocabCategories.reduce((n,c)=>n+c.words.length,0)!==282)throw Error('Expanded vocabulary missing');
   for(const c of vocabCategories){
    if(new Set(c.words.map(w=>JSON.stringify(w.slice(0,2)))).size!==c.words.length)throw Error('Duplicate vocabulary in '+c.name);
    if(c.words.some(w=>!window.DEUTSCH_WORD_ART?.[c.name]?.[JSON.stringify(w.slice(0,2))]))throw Error('Missing exact illustration in '+c.name);
   }
   for(const index of [16,17]){openVocabCategory(index);startVocabQuiz(false,true);if(VQ_TYPES.some(t=>!vq.items.some(it=>it.type===t)))throw Error('New category missing practice skill');endVocabQuiz()}
  });
  if(errors.length)throw Error(errors.join('; '));
  console.log('PASS selectable/persisted skills, gradual practice, typed answers/umlauts, full final/retry, mocked speech/cancellation/fallback and 320–1280px layouts');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
