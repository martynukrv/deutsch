/* Shared spoken turn: original actor audio -> granted microphone -> recognised reply. */
(()=>{
let active=null,permissionGranted=false;
const normalize=s=>String(s).normalize('NFC').toLocaleLowerCase('de-DE').replace(/[’‘]/g,"'").replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const speakerGlyph='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M11 4 6 8H3v8h3l5 4V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function speaker(text,t,attrs=''){const label=esc(t('Прослухати: ','Listen to: ')+text);return `<button type="button" class="inline-audio-button dialogue-audio-button" ${attrs} aria-label="${label}" title="${label}">${speakerGlyph}</button>`}
function markup(id,t){return `<section class="dialogue-voice" id="${id}Voice" data-dialogue-voice data-phase="preparing"><p id="${id}VoiceStatus" role="status" aria-live="polite"></p><p id="${id}Heard" lang="de" aria-live="polite"></p><div class="journey-result-buttons"><button type="button" class="btn primary" id="${id}Mic">🎙 ${t('Відповісти голосом','Reply by voice')}</button><button type="button" class="btn secondary" id="${id}Confirm" hidden>${t('Це моя відповідь','That is my reply')}</button></div><p class="hint">${t('Відповідай німецькою. Перевіряємо розпізнані слова, а не акцент.','Reply in German. We check recognised words, not your accent.')}</p></section>`}
function cancel(){if(active){active.cancel();active=null}}
function mount({root,id,t,prompt=null,match,onReply}){
 cancel();const panel=root.querySelector('#'+id+'Voice');if(!panel)return null;
 const button=panel.querySelector('#'+id+'Mic'),confirm=panel.querySelector('#'+id+'Confirm'),status=panel.querySelector('#'+id+'VoiceStatus'),heard=panel.querySelector('#'+id+'Heard');
 let alive=true,done=false,serial=0,rec=null,watch=null,permissionStatus=null,phase='preparing';
 const valid=run=>alive&&active===api&&panel.isConnected&&root.contains(panel)&&(run===undefined||run===serial);
 function state(next,ua,en){phase=next;panel.dataset.phase=next;status.textContent=t(ua,en);button.disabled=['preparing','playing','permission-request','complete'].includes(next);button.textContent=['listening','requesting'].includes(next)?'⏸ '+t('Пауза','Pause'):'🎙 '+t(next==='permission'?'Дозволити мікрофон':'Говорити',next==='permission'?'Allow microphone':'Speak');}
 function stop(){serial++;clearTimeout(watch);watch=null;if(rec){rec.onresult=rec.onerror=rec.onend=rec.onstart=rec.onspeechstart=null;try{rec.abort()}catch{}rec=null}}
 function problem(kind){
  stop();confirm.hidden=true;
  const messages={
   permission:['Дозволь доступ до мікрофона, щоб відповісти. Якщо доступ заблоковано, зміни дозвіл у налаштуваннях сайту в браузері.','Allow microphone access to reply. If access is blocked, change the permission in your browser’s site settings.'],
   unsupported:['Цей браузер не підтримує розпізнавання мовлення. Відкрий діалог у Chrome.','This browser does not support speech recognition. Open the dialogue in Chrome.'],
   audio:['Не вдалося програти репліку. Натисни «Говорити», щоб повторити.','The line could not play. Press Speak to retry.'],
   silent:['Не почув відповіді. Спробуй ще раз.','No reply heard. Try again.'],
   microphone:['Мікрофон недоступний. Перевір, чи його підключено та чи не використовує його інша програма, і спробуй ще раз.','Microphone unavailable. Check that it is connected and not in use by another app, then retry.'],
   network:['Розпізнавання не має з’єднання. Перевір інтернет і спробуй ще раз.','Speech recognition could not connect. Check your internet connection and retry.'],
   recognition:['Не вдалося розпізнати відповідь. Натисни «Говорити» й повтори.','Could not recognise your reply. Press Speak and retry.']
  };
  state(kind,...(messages[kind]||messages.recognition));if(kind==='unsupported')button.disabled=true;
 }
 function complete(){if(!valid())return;stop();done=true;confirm.hidden=true;state('complete','Відповідь прийнято ✓','Reply accepted ✓')}
 function submit(text){if(!valid()||done)return;stop();confirm.hidden=true;const ok=!!match(text);state(ok?'complete':'retry',ok?'Відповідь розпізнано ✓':'Спробуй відповісти ще раз.',ok?'Reply recognised ✓':'Try your reply again.');if(ok)done=true;onReply(text)}
 function listen(){if(!valid()||done||document.hidden)return;stop();const C=window.SpeechRecognition||window.webkitSpeechRecognition;if(!C){problem('unsupported');return}const run=serial;let settled=false,hadSpeech=false;rec=new C();const r=rec;r.lang='de-DE';r.interimResults=true;r.continuous=false;r.maxAlternatives=5;const current=()=>valid(run)&&!done&&!settled;
 state('requesting','Вмикаю мікрофон…','Starting microphone…');confirm.hidden=true;heard.textContent='';
 r.onstart=()=>{if(!current())return;permissionGranted=true;clearTimeout(watch);state('listening','Слухаю тебе…','Listening to you…');watch=setTimeout(()=>{if(current())problem('silent')},30000)};
 r.onspeechstart=()=>{if(current()){hadSpeech=true;status.textContent=t('Слухаю тебе…','Listening to you…')}};
 r.onresult=e=>{if(!current())return;const results=Array.from(e.results||[]);if(!results.length)return;hadSpeech=true;const text=results.map(x=>x[0]?.transcript||'').join(' ').trim();heard.textContent=t('Розпізнано: ','Recognised: ')+text;if(results.some(x=>!x.isFinal))return;settled=true;const alternatives=results.length===1?Array.from(results[0]).map(x=>x.transcript):[text],accepted=alternatives.find(x=>match(x));stop();if(accepted){submit(accepted);return}if(!text){problem('silent');return}state('review','Перевір розпізнане: повтори або підтвердь свою відповідь.','Check what was recognised: retry or confirm your reply.');confirm.hidden=false;confirm.onclick=()=>submit(text)};
 r.onerror=e=>{if(!current())return;settled=true;if(['not-allowed','service-not-allowed','audio-capture'].includes(e.error))permissionGranted=false;problem(['not-allowed','service-not-allowed'].includes(e.error)?'permission':e.error==='audio-capture'?'microphone':e.error==='network'?'network':e.error==='no-speech'?'silent':'recognition')};
 r.onend=()=>{if(current()){settled=true;problem(hadSpeech?'recognition':'silent')}};
 watch=setTimeout(()=>{if(current())problem('recognition')},30000);try{r.start()}catch{problem('recognition')}
 }
 async function allowed(){if(permissionGranted)return true;try{permissionStatus=await navigator.permissions.query({name:'microphone'});return permissionStatus.state==='granted'}catch{return false}}
 async function playThenListen(line=prompt){if(!valid()||done)return;stop();const run=serial;window.DEUTSCH_FLOW?.pause();confirm.hidden=true;if(line){state('playing','Слухай співрозмовника…','Listen to your partner…');if(!line.path){problem('audio');return}let ok=false;try{ok=await window.DEUTSCH_FLOW.playRecording(line.text,line.path)!==false}catch{}if(!valid(run)||done)return;if(!ok){problem('audio');return}}if(!valid(run)||document.hidden)return;if(!(window.SpeechRecognition||window.webkitSpeechRecognition)){problem('unsupported');return}const granted=await allowed();if(!valid(run)||done||document.hidden)return;if(granted)listen();else problem('permission')}
 button.onclick=async()=>{if(!valid()||done)return;if(phase==='listening'||phase==='requesting'){stop();state('paused','Пауза. Мікрофон вимкнено.','Paused. Microphone off.');return}if(phase==='audio'){playThenListen();return}if(phase==='permission'){stop();const run=serial;state('permission-request','Дозволь мікрофон у браузері…','Allow the microphone in your browser…');try{if(!navigator.mediaDevices?.getUserMedia)throw Error('unsupported');const stream=await navigator.mediaDevices.getUserMedia({audio:true});stream.getTracks().forEach(track=>track.stop());if(!valid(run))return;permissionGranted=true}catch(error){if(valid(run))problem(['NotFoundError','NotReadableError','AbortError'].includes(error?.name)?'microphone':'permission');return}}if(valid())listen()};
 const observer=new MutationObserver(()=>{if(alive&&(!panel.isConnected||!root.contains(panel)))api.cancel()});observer.observe(root,{childList:true,subtree:true});
 const hidden=()=>{if(document.hidden&&valid()&&!done){stop();window.DEUTSCH_FLOW?.pause();confirm.hidden=true;state('paused','Пауза. Повернися й натисни «Говорити».','Paused. Return and press Speak.')}};document.addEventListener('visibilitychange',hidden);
 const api={complete,cancel(){if(!alive)return;alive=false;stop();observer.disconnect();document.removeEventListener('visibilitychange',hidden);window.DEUTSCH_FLOW?.pause()},replay(text,path){if(!valid())return false;if(done){window.DEUTSCH_FLOW.playRecording(text,path);return true}playThenListen({text,path});return true},snapshot:()=>({id,phase,done})};active=api;queueMicrotask(()=>{if(valid())playThenListen()});return api;
}
window.addEventListener('pagehide',cancel);
window.DEUTSCH_DIALOGUE_VOICE={markup,speaker,mount,cancel,normalize,replay:(text,path)=>active?.replay(text,path)||false,snapshot:()=>active?.snapshot()||null};
})();
