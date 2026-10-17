const{chromium}=require('playwright'),{pathToFileURL}=require('url'),path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});try{const p=await b.newPage({viewport:{width:390,height:844},timezoneId:'Europe/Kyiv'});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.ART_SITE_URL||pathToFileURL(path.resolve('index.html')).href);
await p.evaluate(()=>{
 const R=DEUTSCH_REVIEW;profileStorage.removeItem(R.key);profileStorage.removeItem(vqStatsKey());
 const entries=DEUTSCH_LEARNING_WORDS;
 if(entries.length!==282||new Set(entries.map(w=>w.id)).size!==282)throw Error('Stable IDs missing or duplicated');
 for(const c of vocabCategories)for(const w of c.words)if(!R.resolve(w))throw Error('Word missing stable ID');
 window.realNow=Date.now;window.reviewNow=new Date(2026,9,17,11).getTime();Date.now=()=>reviewNow;
 const word=vocabCategories[0].words[0],id=R.resolve(word).id,key=id+':ua',state=()=>R.snapshot().data.cards;
 R.record({w:word,type:'ua'},true);if(state()[key].step!==1||state()[key].due!==R.afterDays(reviewNow,1))throw Error('First success must be tomorrow');
 R.record({w:word,type:'ua'},true);if(state()[key].step!==1)throw Error('Early answer inflated interval');
 reviewNow=R.afterDays(reviewNow,1)+3600000;R.record({w:word,type:'ua'},true);if(state()[key].step!==2||state()[key].due!==R.afterDays(reviewNow,3))throw Error('Due success did not increase interval');
 R.record({w:word,type:'write'},false);if(state()[id+':write'].due!==reviewNow+600000||state()[key].step!==2)throw Error('Failure scheduling or skill isolation failed');
 if(R.items('due').length)throw Error('Future card shown early');
 reviewNow+=600001;if(!R.items('due').some(it=>it.type==='write'))throw Error('Ten-minute retry not due');
 R.record({w:word,type:'write'},true);if(state()[id+':write'].step!==1)throw Error('Recovery did not restart cycle');
 // An old due date remains in the queue after several missed days.
 reviewNow=R.afterDays(reviewNow,8);if(R.items('due').length!==2)throw Error('Overdue cards disappeared');
 R.start('due');if(!vq.daily||vq.items.length!==2)throw Error('Daily queue failed to launch');
 for(const it of vq.items)if(vqOptions(it).every(w=>w!==it.w))throw Error('Daily choices missing target');
 endVocabQuiz();
 const novel=R.items('new');if(novel.length!==5)throw Error('Default daily new limit missing');
 for(const it of novel)R.record(it,true);
 if(R.snapshot().remaining!==0||R.items('new').length)throw Error('Daily new-word limit exceeded');
 reviewNow=R.afterDays(reviewNow,1);if(R.items('new').length!==5)throw Error('Next day new limit did not reset');
 // Migration is conservative and does not rewrite historical totals.
 const migrationTime=realNow();let tick=0;Date.now=()=>migrationTime+(tick++*3);profileStorage.removeItem(R.key);profileStorage.setItem(vqStatsKey(),JSON.stringify({ich:{ok:8,bad:2}}));const s=R.snapshot();
 if(s.due.length!==1||s.due[0].type!=='ua'||s.due[0].step!==0||loadVqStats().ich.ok!==8)throw Error('Legacy migration inferred false mastery or lost totals');
 Date.now=realNow;R.render();setMode('home');
});
await p.locator('#startDailyReview').click();if(!await p.evaluate(()=>vq.daily==='due'&&vq.items[0].w[0]==='ich'))throw Error('Home button uses wrong queue');
await p.evaluate(()=>{const it=vq.items[vq.index];answerVq(null,it,['ua','listen'].includes(it.type)?it.w[1]:it.w[0]);nextVq()});
await p.locator('#vqBack').click();if(!await p.locator('#homeView').evaluate(el=>el.classList.contains('active')))throw Error('Daily summary did not return home');
// A bad speech transcript requires confirmation before changing the schedule.
await p.evaluate(()=>{openVocabCategory(7);startVocabQuiz(false,false,['speak']);window.SpeechRecognition=class{constructor(){window.reviewRecognition=this}start(){}abort(){}};window.beforeVoiceReview=profileStorage.getItem(DEUTSCH_REVIEW.key)});
await p.locator('#vqMic').click();await p.evaluate(()=>{const r=reviewRecognition,result=[{transcript:'falsch',confidence:.2}];result.isFinal=true;r.onresult({resultIndex:0,results:[result]});r.onend();if(vq.locked||vq.wrong||profileStorage.getItem(DEUTSCH_REVIEW.key)!==beforeVoiceReview)throw Error('Unconfirmed transcript penalized learner')});
await p.getByRole('button',{name:'Підтвердити помилку'}).click();if(!await p.evaluate(()=>vq.wrong===1&&vq.locked))throw Error('Confirmed speech failure not recorded');
await p.evaluate(()=>{endVocabQuiz();setMode('home')});
for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:844});if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Daily layout overflow at '+width)}
await p.setViewportSize({width:390,height:844});await p.screenshot({path:'audit-screenshots/daily-review.png',fullPage:true});
if(errors.length)throw Error(errors.join('; '));console.log('PASS stable catalog IDs, skill isolation, due dates, early/retry/overdue scheduling, daily limit/reset, conservative migration and responsive daily session');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
