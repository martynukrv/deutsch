/* Generated effects are optional; lesson voice and microphone always take priority. */
(()=>{
const key='deutsch16_sfx_v1',base='audio/sfx/20261025/',files={click:'click.mp3',clue:'clue.mp3',seal:'seal.mp3',voyage:'voyage.mp3',lighthouse:'lighthouse.mp3',correct:'correct.mp3',incorrect:'incorrect.mp3'};
let enabled=profileStorage.getItem(key)!=='off',unlocked=false,speaking=false,mics=0,voiceRun=0,audioRun=0,current=null,pending=[],lastClick=0;
const player=new Audio();player.preload='auto';
function stop(clear=true){audioRun++;player.pause();player.onended=player.onerror=null;try{player.currentTime=0}catch{}current=null;if(clear)pending=[]}
function drain(){if(current||speaking||mics||document.hidden||!enabled||!unlocked)return;const task=pending.shift();if(!task)return;if(Date.now()>task.expires||task.owner&&!task.owner.isConnected){drain();return}const run=++audioRun;current=task.id;player.src=base+files[task.id];player.volume=task.id==='click'?.2:.38;const done=()=>{if(run!==audioRun)return;current=null;player.onended=player.onerror=null;drain()};player.onended=player.onerror=done;try{Promise.resolve(player.play()).catch(done)}catch{done()}}
function play(id,{owner=null}={}){if(!files[id]||!enabled||!unlocked||document.hidden||mics||speaking)return false;if(id==='click'&&(current||Date.now()-lastClick<80))return false;if(id==='click')lastClick=Date.now();if(pending.length>=3)return false;pending.push({id,owner,expires:Date.now()+5000});drain();return true}
function voiceStart(){voiceRun++;speaking=true;stop();return voiceRun}
function voiceEnd(run){if(run===voiceRun)speaking=false}
function micGuard(Native){if(!Native)return Native;function Wrapped(...args){const r=new Native(...args);let running=false;const end=()=>{if(running){running=false;mics=Math.max(0,mics-1)}};r.addEventListener?.('end',end);r.addEventListener?.('error',end);const start=r.start.bind(r);r.start=(...a)=>{if(!running){running=true;mics++;stop()}try{return start(...a)}catch(e){end();throw e}};const abort=r.abort?.bind(r);if(abort)r.abort=(...a)=>{try{return abort(...a)}finally{end()}};return r}Wrapped.prototype=Native.prototype;return Wrapped}
const wrapped=new Map();for(const name of ['SpeechRecognition','webkitSpeechRecognition'])if(window[name]){const Native=window[name];if(!wrapped.has(Native))wrapped.set(Native,micGuard(Native));window[name]=wrapped.get(Native)}
const speak=window.speak;window.speak=function(text,...args){const raw=String(text).trim(),run=voiceStart();if(!raw)speaking=false;return Promise.resolve(speak.call(this,text,...args)).finally(()=>voiceEnd(run))};
// All existing graded flows already call DEUTSCH_FLOW.feedback, which plays the cue after speech.
window.tone=()=>{};
const button=document.createElement('button');button.type='button';button.id='sfxToggle';button.className='btn secondary sfx-toggle';document.querySelector('.profile-bar').append(button);
function label(){const en=document.documentElement.lang.startsWith('en');const text=en?'Effects: '+(enabled?'on':'off'):'Звуки ефектів: '+(enabled?'увімкнено':'вимкнено');if(button.textContent!==text)button.textContent=text;button.setAttribute('aria-pressed',String(enabled))}
button.onclick=()=>{unlocked=true;enabled=!enabled;profileStorage.setItem(key,enabled?'on':'off');if(!enabled)stop();label();if(enabled)play('click')};
document.addEventListener('click',e=>{if(!e.isTrusted)return;unlocked=true;const b=e.target.closest('button');if(!b||b.disabled||b===button)return;if(b.matches('.al-audio,.inline-audio-button,[data-speak],[data-al-option],[data-cv2-answer],[data-sound-answer],[data-vq],#alMic,#mic,#vqMic,#alReplay,#storySceneSkip')||b.closest('.al-options,.al-letters,.greeting-choices,.karl-tiles')||b.dataset.cv2Action==='mic')return;queueMicrotask(()=>play('click'))},true);
const seen=new WeakSet(),observed=new Set(),io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){io.unobserve(e.target);observed.delete(e.target);play(e.target.matches('[data-clue-new="true"]')?'clue':'seal',{owner:e.target})}},{threshold:.3});
function scan(){label();for(const el of observed)if(!el.isConnected){io.unobserve(el);observed.delete(el)}for(const el of document.querySelectorAll('[data-clue-new="true"],.journey-result .expedition-master,.greeting-result[data-greeting-result="passed"]'))if(!seen.has(el)){seen.add(el);observed.add(el);io.observe(el)}}
new MutationObserver(scan).observe(document.querySelector('main'),{subtree:true,childList:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
window.DEUTSCH_SFX={key,files,play,stop,voiceStart,voiceEnd,snapshot:()=>({enabled,unlocked,speaking,mics,current,pending:pending.map(x=>x.id)})};label();
})();
