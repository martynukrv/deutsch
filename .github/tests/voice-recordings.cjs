const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const fs=require('fs'),path=require('path');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync('audio-inbox/henri-20261017.json','utf8'));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  await page.goto(process.env.ART_SITE_URL||pathToFileURL(path.resolve('index.html')).href,{waitUntil:'load'});
  const result=await page.evaluate(async entries=>{
   if(entries.length!==409||Object.keys(window.DEUTSCH_RECORDED_AUDIO||{}).length!==409)throw Error('Wrong recorded clip count');
   for(const c of vocabCategories)for(const w of c.words)if(!recordedAudioFiles(w[0]))throw Error('Dictionary still uses browser voice: '+w[0]);
   for(const v of verbConjugations)for(const form of v.forms)if(recordedAudioFiles(form)?.length!==1)throw Error('Verb form has no recorded clip: '+form);
   for(const t of generatedVerbTasks(1))if(recordedAudioFiles(t.de)?.length!==1)throw Error('Full phrase has no recorded clip: '+t.de);
   const paths=entries.map(e=>{const files=recordedAudioFiles(e.text);if(files?.length!==1||!files[0].startsWith('audio/henri-20261017/'))throw Error('Wrong exact recording binding: '+e.id);return files[0]});
   if(new Set(paths).size!==409)throw Error('Reused or missing voice clip');
   let cursor=0,loaded=0;
   const worker=async()=>{while(cursor<paths.length){const src=paths[cursor++];await new Promise((resolve,reject)=>{const audio=new Audio();const timer=setTimeout(()=>reject(Error('Audio metadata timeout '+src)),20000);audio.preload='metadata';audio.onloadedmetadata=()=>{clearTimeout(timer);if(!Number.isFinite(audio.duration)||audio.duration<.15||audio.duration>5)reject(Error('Invalid audio duration '+src));else{loaded++;audio.removeAttribute('src');audio.load();resolve()}};audio.onerror=()=>{clearTimeout(timer);reject(Error('Unplayable recording '+src))};audio.src=src;audio.load()})}};
   await Promise.all(Array.from({length:8},worker));return {loaded,words:vocabCategories.reduce((n,c)=>n+c.words.length,0),combinations:generatedVerbTasks(1).length};
  },manifest.entries);
  if(result.loaded!==409||result.words!==282||result.combinations!==342)throw Error(JSON.stringify(result));
  console.log('PASS 409 exact recorded bindings and playable MP3s, 282 dictionary entries, all 342 pronoun–verb tasks and every conjugated word',process.env.ART_SITE_URL||'local');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
