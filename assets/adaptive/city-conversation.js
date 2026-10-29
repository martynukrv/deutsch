/* Guided roleplay on island four. New actor recordings have explicit hooks; browser fallback is labelled. */
(()=>{
const key='deutsch16_city_conversation_v1';let active=null;
const turns=[
 {karl:'Hallo!',you:'Hallo!',cue:['Привітайся з Карлом.','Say hello to Karl.'],ua:'Привіт!',en:'Hello!'},
 {karl:'Brauchst du Hilfe?',you:'Entschuldigung, wo ist der Bahnhof?',cue:['Перепроси й запитай, де вокзал.','Say excuse me and ask where the railway station is.'],ua:'Тобі потрібна допомога?',en:'Do you need help?'},
 {karl:'Geh geradeaus und dann nach links.',you:'Geradeaus und dann nach links?',cue:['Уточни почуте: «Прямо, а потім ліворуч?»','Check the directions: “Straight ahead and then left?”'],ua:'Йди прямо, а потім ліворуч.',en:'Go straight ahead and then left.'},
 {karl:'Ja, genau.',you:'Wo ist die Schule?',cue:['Тепер запитай, де школа.','Now ask where the school is.'],ua:'Так, саме так.',en:'Yes, exactly.'},
 {karl:'Geh geradeaus und dann nach rechts.',you:'Vielen Dank!',cue:['Подякуй за допомогу.','Thank Karl for his help.'],ua:'Йди прямо, а потім праворуч.',en:'Go straight ahead and then right.'},
 {karl:'Gute Reise!',you:'Auf Wiedersehen!',cue:['Попрощайся ввічливо.','Say goodbye politely.'],ua:'Щасливої подорожі!',en:'Have a good trip!'}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const match=(i,value)=>window.DEUTSCH_CITY.key(value)===window.DEUTSCH_CITY.key(turns[i].you);
const read=()=>JSON.parse(profileStorage.getItem(key)||'null');
function cancel(){active=null;window.DEUTSCH_DIALOGUE_VOICE.cancel()}
function mount({root,shell,t,exit,lesson}){
 cancel();const s={index:0,wrong:0,hints:new Set(),independent:0,locked:false,voice:null};active=s;
 const live=()=>active===s&&root.isConnected;
 function paint(body){shell(`<section data-city-conversation><button class="btn secondary" id="cityTalkBack">${t('← До уроку','← Lesson')}</button>${body}</section>`);root.querySelector('#cityTalkBack').onclick=()=>{cancel();exit()}}
 function turn(){if(!live())return;const turnIndex=s.index,q=turns[turnIndex];s.locked=false;const path=window.DEUTSCH_CITY.recording(q.karl,'karl');paint(`${window.DEUTSCH_CITY.image('welcome','city-intro-portrait')}<div class="tag">${t('Розмова з Карлом','Conversation with Karl')} · ${s.index+1} / 6</div><h1>${t('Запитай дорогу','Ask for directions')}</h1>${window.DEUTSCH_CITY.audioNote(t)}<div class="fox-speech"><span>${t('Карл','Karl')}</span><p class="dialogue-phrase"><strong lang="de">${esc(q.karl)}</strong>${window.DEUTSCH_DIALOGUE_VOICE.speaker(q.karl,t,'id="cityPartnerAudio"')}</p></div><h2>${t(...q.cue)}</h2><details class="city-dialogue-hint" id="cityTalkHint"><summary>${t('Підказка та переклад','Hint and translation')}</summary><p>${t(q.ua,q.en)}</p><p class="dialogue-phrase"><strong lang="de">${esc(q.you)}</strong>${window.DEUTSCH_DIALOGUE_VOICE.speaker(q.you,t,'id="cityReplyAudio"')}</p></details>${window.DEUTSCH_DIALOGUE_VOICE.markup('city',t)}<p id="cityTalkFeedback" role="status"></p><button class="btn primary" id="cityTalkNext" hidden>${s.index===5?t('Завершити розмову','Finish conversation'):t('Далі','Next')}</button>`);
 const hint=root.querySelector('#cityTalkHint');hint.ontoggle=()=>{if(live()&&hint.isConnected&&hint.open&&!s.locked)s.hints.add(turnIndex)};
 let wrongHere=false;
 s.voice=window.DEUTSCH_DIALOGUE_VOICE.mount({root,id:'city',t,prompt:{text:q.karl,path,browserVoice:!path},match:value=>match(s.index,value),onReply(value){if(!live()||s.locked)return;const ok=match(s.index,value);window.DEUTSCH_PROGRESS?.record(ok,'speak');if(ok){s.locked=true;if(!wrongHere&&!s.hints.has(s.index))s.independent++;root.querySelector('#cityTalkFeedback').textContent=t('Відповідь прийнято.','Reply accepted.');root.querySelector('#cityTalkNext').hidden=false}else{wrongHere=true;s.wrong++;root.querySelector('#cityTalkFeedback').textContent=t('Спробуй ще раз або відкрий підказку.','Retry or open the hint.')}}});
 root.querySelector('#cityPartnerAudio').onclick=()=>s.voice.replay(q.karl,path);root.querySelector('#cityReplyAudio').onclick=()=>s.voice.replay(q.you,window.DEUTSCH_CITY.recording(q.you,'you'));
 root.querySelector('#cityTalkNext').onclick=()=>{if(!live()||!s.locked)return;s.voice.cancel();if(++s.index<turns.length)turn();else finish()};
 }
 function finish(){if(!live())return;const old=read(),last={at:Date.now(),independent:s.independent,wrong:s.wrong,hints:s.hints.size};profileStorage.setItem(key,JSON.stringify({version:1,completed:true,completions:(old?.completions||0)+1,bestIndependent:Math.max(old?.bestIndependent||0,s.independent),last}));paint(`<h1>${t('Ти знайшов дорогу!','You found the way!')}</h1><p>${s.independent} / 6 · ${t('з першої спроби без підказки','first try without a hint')}</p><p>${t('Це окрема практика розмови, а не оцінка акценту. Печатки уроків і ключ за неї не змінюються.','This is separate conversation practice, not an accent score. It does not change lesson seals or the key.')}</p><button class="btn primary" id="cityTalkLesson">${t('До уроку','Back to the lesson')}</button><button class="btn secondary" id="cityTalkAgain">${t('Повторити розмову','Repeat conversation')}</button>`);root.querySelector('#cityTalkLesson').onclick=()=>{cancel();lesson()};root.querySelector('#cityTalkAgain').onclick=()=>{cancel();mount({root,shell,t,exit,lesson})}}
 paint(`${window.DEUTSCH_CITY.image('welcome','city-intro-portrait')}<h1>${t('Карл покаже дорогу','Karl will show the way')}</h1><p>${t('Ти граєш мандрівника: привітайся, запитай про вокзал і школу, уточни напрямок, подякуй і попрощайся. Відповідай голосом. Підказки закриті, але їх можна відкрити будь-коли.','You play a traveller: say hello, ask about the station and school, check a direction, say thanks and goodbye. Reply by voice. Hints start closed and can be opened any time.')}</p>${window.DEUTSCH_CITY.audioNote(t)}<button class="btn primary" id="cityTalkBegin">${t('Почати розмову','Start conversation')}</button>`);root.querySelector('#cityTalkBegin').onclick=turn;
}
window.DEUTSCH_CITY_CONVERSATION={key,turns,match,read,mount,cancel};
})();
