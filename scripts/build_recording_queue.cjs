/* Audit actual recorded clips and preserve the previously supplied 73-item order. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),raw=JSON.parse(html.match(/const AUDIO_MAP=(\{[^\n]+\});/)[1]);
const key=t=>t.trim().toLowerCase().replace(/[.!?]+$/g,'').replace(/\s+/g,' ');
const audio=Object.fromEntries(Object.entries(raw).filter(([,f])=>fs.existsSync(path.join(root,f))).map(([k,f])=>[key(k),f]));
const context={window:{}};vm.runInNewContext(read('assets/vocabulary/verb-conjugations.js'),context);
const verbs=context.window.DEUTSCH_VERB_CONJUGATIONS;
const catalog=JSON.parse(read('art-inbox/catalog.json'));
const persons=[['Ich',0],['Du',1],['Er',2],['Sie',2],['Es',2],['Wir',3],['Ihr',4],['Sie',5],['Sie',5]];
const composable=t=>{const k=key(t),parts=k.split(' ');return audio[k]||(parts.length>1&&parts.every(p=>audio[p]))};
const entries=[],seen=new Set();
function add(text,kind){const k=key(text);if(seen.has(k)||audio[k])return;seen.add(k);entries.push({id:'rq'+String(entries.length+1).padStart(3,'0'),text,kind})}
for(const cat of Object.values(catalog.categories))for(const w of cat.words)if(!composable(w.de))add(w.de,'vocabulary');
// Keep the six extra word forms in the same positions as the original recording request.
for(const text of ['lerne','lernst','lernt','höre','hörst','hört'])add(text,'verb-form');
for(const v of verbs)for(const form of v.forms)add(form,'verb-form');
let combined=0,browser=0,whole=0;const phrases=new Set();
for(const v of verbs)for(const [person,index] of persons){const text=person+' '+v.forms[index]+'.',k=key(text);phrases.add(k);if(audio[k])whole++;else if(composable(text))combined++;else browser++;add(text,'pronoun-verb')}
const report={version:1,date:'2026-10-17',verbs:verbs.length,persons:persons.length,exerciseCombinations:verbs.length*persons.length,uniquePhrases:phrases.size,coverageByMeaning:{whole,combined,browser},count:entries.length,entries};
fs.writeFileSync(path.join(root,'audio/recording/queue.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(root,'audio/recording/queue.txt'),entries.map(e=>e.text+' [pause]').join('\n')+'\n');
fs.writeFileSync(path.join(root,'audio/recording/queue-additions.txt'),entries.slice(73).map(e=>e.text+' [pause]').join('\n')+'\n');
console.log(JSON.stringify({...report,entries:undefined},null,2));
