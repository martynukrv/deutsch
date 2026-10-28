const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('assets/adaptive/dialogue-voice.js','utf8');
function setup(permission='granted',supported=true){
 const elements=Object.fromEntries(['Mic','Confirm','VoiceStatus','Heard'].map(s=>['#test'+s,{disabled:false,hidden:true,textContent:'',onclick:null}]));
 const panel={isConnected:true,dataset:{},querySelector:s=>elements[s]};const root={contains:p=>p===panel&&panel.isConnected,querySelector:()=>panel};let resolve,starts=0,aborts=0,tracks=0,plays=0,rec,observer;const events={};const answers=[];
 const window={addEventListener(){},DEUTSCH_FLOW:{pause(){},playRecording(){plays++;return new Promise(r=>resolve=r)}}};
 class Recognition{constructor(){rec=this}start(){starts++;this.onstart?.()}abort(){aborts++}}
 if(supported)window.SpeechRecognition=Recognition;
 const document={hidden:false,addEventListener:(k,f)=>events[k]=f,removeEventListener:(k,f)=>{if(events[k]===f)delete events[k]}};
 const navigator={permissions:{query:async()=>({state:permission})},mediaDevices:{getUserMedia:async()=>({getTracks:()=>[{stop(){tracks++}}]})}};
 const ctx={window,document,navigator,MutationObserver:class{constructor(fn){observer=fn}observe(){}disconnect(){}},queueMicrotask,setTimeout,clearTimeout};vm.createContext(ctx);vm.runInContext(source,ctx);
 const api=window.DEUTSCH_DIALOGUE_VOICE,t=(a,b)=>a,accept=s=>api.normalize(s)==='guten tag';
 const start=()=>api.mount({root,id:'test',t,prompt:{text:'Guten Tag!',path:'original.mp3'},match:accept,onReply:x=>answers.push(x)});
 const result=(text,final=true,alternatives=[])=>({results:[Object.assign([{transcript:text},...alternatives.map(transcript=>({transcript}))],{isFinal:final})]});
 return {api,start,window,document,elements,panel,answers,result,get rec(){return rec},release:x=>resolve(x),get starts(){return starts},get aborts(){return aborts},get tracks(){return tracks},get plays(){return plays},detach(){panel.isConnected=false;observer()},hide(){document.hidden=true;events.visibilitychange?.()}};
}
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
(async()=>{
 let s=setup();assert(!s.api.markup('test',(a,b)=>a).includes('<input'));s.start();await flush();assert.equal(s.plays,1);assert.equal(s.starts,0);s.release(true);await flush();assert.equal(s.starts,1);assert.equal(s.rec.lang,'de-DE');s.rec.onresult(s.result('Guten',false));assert.equal(s.answers.length,0);const stale=s.rec.onresult;s.rec.onresult(s.result('other',true,['Guten Tag!']));assert.deepEqual(s.answers,['Guten Tag!']);stale(s.result('Guten Tag!'));assert.equal(s.answers.length,1);s.api.cancel();
 s=setup('prompt');s.start();await flush();s.release(true);await flush();assert.equal(s.starts,0);assert.equal(s.api.snapshot().phase,'permission');await s.elements['#testMic'].onclick();assert.equal(s.tracks,1);assert.equal(s.starts,1);s.rec.onresult(s.result('Tschüss!'));assert.equal(s.answers.length,0);assert.equal(s.elements['#testConfirm'].hidden,false);s.elements['#testConfirm'].onclick();assert.deepEqual(s.answers,['Tschüss!']);s.api.cancel();
 s=setup();s.start();await flush();s.api.cancel();s.release(true);await flush();assert.equal(s.starts,0);
 s=setup();s.start();await flush();s.release(false);await flush();assert.equal(s.starts,0);assert.equal(s.api.snapshot().phase,'audio');s.api.cancel();
 s=setup();s.start();await flush();s.release(true);await flush();s.rec.onerror({error:'not-allowed'});assert.equal(s.api.snapshot().phase,'permission');assert.equal(s.answers.length,0);s.api.cancel();
 s=setup();s.start();await flush();s.release(true);await flush();const late=s.rec.onresult;s.hide();late(s.result('Guten Tag!'));assert.equal(s.answers.length,0);assert(s.aborts>0);assert.equal(s.api.snapshot().phase,'paused');s.api.cancel();
 s=setup();s.start();await flush();s.release(true);await flush();s.detach();assert(s.aborts>0);s.api.cancel();
 s=setup('granted',false);s.start();await flush();s.release(true);await flush();assert.equal(s.api.snapshot().phase,'unsupported');assert(s.elements['#testMic'].disabled);s.api.cancel();
 console.log('PASS voice turns: audio-before-mic, granted/first permission, no typed input, final alternatives, reviewed mismatch, stale callbacks, playback failure, blocked/unsupported mic, background and navigation cleanup');
})().catch(e=>{console.error(e);process.exit(1)});
