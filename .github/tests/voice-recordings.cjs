const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const fs=require('fs'),path=require('path');
(async()=>{
 const manifests=fs.readdirSync('audio-inbox').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join('audio-inbox',f),'utf8')));
 const entries=manifests.flatMap(m=>m.entries.map(e=>({...e,batch:m.batch})));const legacy=entries.filter(e=>['henri-20261017','henri-lessons-20261017'].includes(e.batch));if(legacy.length!==453)throw Error('Expected 409 original and 44 lesson recordings');
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  await page.goto(process.env.ART_SITE_URL||pathToFileURL(path.resolve('index.html')).href,{waitUntil:'load'});
  const result=await page.evaluate(async entries=>{
   if(Object.keys(window.DEUTSCH_RECORDED_AUDIO||{}).length!==entries.length)throw Error('Wrong recorded clip count');
   for(const e of entries.filter(e=>e.batch.startsWith('henri-whole-upgrade-')))if(recordedAudioFiles(e.text)?.length!==1)throw Error('Whole utterance upgrade missing: '+e.text);
   for(const c of vocabCategories)for(const w of c.words)if(!recordedAudioFiles(w[0]))throw Error('Dictionary still uses browser voice: '+w[0]);
   for(const v of verbConjugations)for(const form of v.forms)if(recordedAudioFiles(form)?.length!==1)throw Error('Verb form has no recorded clip: '+form);
   for(const phrase of window.DEUTSCH_LEARNING_PHRASES){const recorded=recordedAudioFiles(phrase.de),pending=window.DEUTSCH_COURSE_AUDIO?.missing.some(x=>audioKey(x.text)===audioKey(phrase.de));if(!recorded&&(!phrase.courseV2||!pending))throw Error('Untracked missing lesson recording: '+phrase.de)}
   for(const t of generatedVerbTasks(1))if(recordedAudioFiles(t.de)?.length!==1)throw Error('Full phrase has no recorded clip: '+t.de);
   const paths=entries.map(e=>{const files=recordedAudioFiles(e.text);if(files?.length!==1||!files[0].startsWith('audio/'+e.batch+'/'))throw Error('Wrong exact recording binding: '+e.id);return files[0]});
   if(new Set(paths).size!==entries.length)throw Error('Reused or missing voice clip');
   let cursor=0,loaded=0,retried=0;
   const metadata=(src,maximum,attempt)=>new Promise((resolve,reject)=>{
    const audio=new Audio();let timer;
    const cleanup=()=>{clearTimeout(timer);audio.onloadedmetadata=audio.onerror=null;audio.removeAttribute('src');audio.load()};
    const fail=message=>{cleanup();const error=Error(message+' '+src);error.retryable=true;reject(error)};
    timer=setTimeout(()=>fail('Audio metadata timeout'),20000);audio.preload='metadata';
    audio.onloadedmetadata=()=>{const duration=audio.duration;cleanup();if(!Number.isFinite(duration)||duration<.15||duration>=maximum)reject(Error('Invalid audio duration '+src));else resolve()};
    audio.onerror=()=>fail('Unplayable recording');
    audio.src=attempt&&/^https?:/.test(location.protocol)?src+'?verificationRetry='+attempt+'-'+Date.now():src;audio.load();
   });
   const worker=async()=>{while(cursor<paths.length){const pos=cursor++,src=paths[pos],maximum=({'course-text':60,'course-phrase':12})[entries[pos].kind]||5;
    for(let attempt=0;attempt<3;attempt++){try{await metadata(src,maximum,attempt);loaded++;break}catch(error){if(!error.retryable||attempt===2)throw error;retried++;await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)))}}
   }};
   // Bound network concurrency and retry transient delivery failures; corrupt durations still fail immediately.
   await Promise.all(Array.from({length:4},worker));console.log('Recording metadata retries:',retried);return {loaded,words:vocabCategories.reduce((n,c)=>n+c.words.length,0),combinations:generatedVerbTasks(1).length};
  },entries);
  if(result.loaded!==entries.length||result.words!==282||result.combinations!==342)throw Error(JSON.stringify(result));
  console.log('PASS '+entries.length+' exact recorded bindings and playable MP3s; all 453 legacy recordings, 282 dictionary entries and 342 pronoun–verb tasks preserved; course recordings use explicit typed duration limits',process.env.ART_SITE_URL||'local');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
