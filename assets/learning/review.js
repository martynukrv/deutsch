/* Version 1: explicit, auditable per-skill spaced repetition; not FSRS. */
(()=>{
 const key='deutsch16_review_v1',intervals=[1,3,7,14,30,60,120,180],catalog=window.DEUTSCH_LEARNING_WORDS;
 const lookup=new Map(catalog.map(w=>[JSON.stringify([w.de,w.ua]),w]));
 const day=ms=>{const d=new Date(ms);return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-')};
 const afterDays=(ms,n)=>{const d=new Date(ms);d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d.getTime()};
 const fresh=()=>({version:1,cards:{},newLimit:5,history:[]});
 function load(){const raw=profileStorage.getItem(key);if(raw){const data=JSON.parse(raw);if(data.version!==1||!data.cards||!Array.isArray(data.history))throw Error('Unsupported review data');return data}
  const data=fresh(),stats=loadVqStats();
  // Old totals have no dates or skill history. Enrol recognition only, due now.
  for(const w of catalog){if(stats[clean(w.de)]?.ok||stats[clean(w.de)]?.bad)data.cards[w.id+':ua']={wordId:w.id,type:'ua',step:0,due:Date.now(),ok:0,bad:0,introduced:0,migrated:true}}
  save(data);return data;
 }
 function save(data){profileStorage.setItem(key,JSON.stringify(data))}
 function resolve(w){return lookup.get(JSON.stringify(w.slice(0,2)))}
 function runtime(entry){const catIndex=vocabCategories.findIndex(c=>c.words.some(w=>w[0]===entry.de&&w[1]===entry.ua));if(catIndex<0)return null;return {w:vocabCategories[catIndex].words.find(w=>w[0]===entry.de&&w[1]===entry.ua),catIndex}}
 function record(item,ok,now=Date.now()){
  const entry=resolve(item.w);if(!entry||item.srsRecorded)return;const data=load(),type=item.answerSkill||item.type,cardKey=entry.id+':'+type,previous=data.cards[cardKey];
  const card=previous?{...previous}:{wordId:entry.id,type,step:0,ok:0,bad:0,introduced:now};
  card[ok?'ok':'bad']++;card.last=now;
  if(!ok){card.step=0;card.due=now+10*60*1000}
  else if(!previous||previous.due<=now||previous.lastOutcome===false){card.step=Math.min(intervals.length,(card.step||0)+1);card.due=afterDays(now,intervals[card.step-1])}
  card.lastOutcome=ok;data.cards[cardKey]=card;data.history.push({wordId:entry.id,type,ok,at:now});
  // Retain lifetime counters on each card; keep a bounded recent answer log.
  if(data.history.length>5000)data.history=data.history.slice(-5000);save(data);item.srsRecorded=true;
 }
 function snapshot(now=Date.now()){
  const data=load(),cards=Object.values(data.cards),known=new Set(cards.map(c=>c.wordId));
  const firstSeen=new Map();for(const c of cards)firstSeen.set(c.wordId,Math.min(firstSeen.get(c.wordId)??Infinity,c.introduced||0));
  const introduced=new Set([...firstSeen].filter(([,at])=>at>0&&day(at)===day(now)).map(([id])=>id));
  const due=cards.filter(c=>c.due<=now&&catalog.some(w=>w.id===c.wordId));
  const next=cards.filter(c=>c.due>now).reduce((m,c)=>Math.min(m,c.due),Infinity);
  return {data,due,known,newToday:introduced.size,remaining:Math.max(0,data.newLimit-introduced.size),next};
 }
 function items(kind,now=Date.now()){
  const s=snapshot(now);
  if(kind==='due')return shuffle(s.due.slice().sort((a,b)=>a.due-b.due).slice(0,20).map(c=>{const entry=catalog.find(w=>w.id===c.wordId),r=runtime(entry);return r?{...r,type:c.type}:null}).filter(Boolean));
  if(!s.remaining)return [];
  const types=vqModes.length?vqModes:['ua'];
  return shuffle(catalog.filter(w=>!s.known.has(w.id)).map(runtime).filter(Boolean)).slice(0,Math.min(20,s.remaining)).map((r,i)=>({...r,type:types[i%types.length]}));
 }
 function render(){const root=document.getElementById('dailyReview');if(!root)return;try{const s=snapshot();root.innerHTML=`<div class="tag">Твій план на сьогодні</div><h2>Повторюй і запам’ятовуй</h2><p><b>${s.due.length}</b> повторень · <b>${s.newToday}</b> із ${s.data.newLimit} нових слів сьогодні</p><div class="daily-actions"><button class="btn primary" id="startDailyReview" ${s.due.length?'':'disabled'}>Повторити сьогодні${s.due.length?' · '+s.due.length:''}</button><button class="btn secondary" id="startDailyNew" ${s.remaining&&s.known.size<catalog.length?'':'disabled'}>Вивчати нові · ${Math.min(s.remaining,catalog.length-s.known.size)}</button></div><p class="hint">${s.due.length?'Почнемо з повторень, які вже настав час пройти.':Number.isFinite(s.next)?'Наступне повторення: '+new Date(s.next).toLocaleString('uk-UA',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})+'.':'Вивчи перші слова — апка підготує персональні повторення.'}</p><details><summary>Налаштування повторень</summary><label for="dailyNewLimit">Нових слів на день</label><select id="dailyNewLimit">${[0,5,10,15,20,30].map(n=>`<option value="${n}" ${s.data.newLimit===n?'selected':''}>${n}</option>`).join('')}</select><p class="hint">Ліміт діє для кнопки «Вивчати нові». У словнику можна тренуватися без обмежень. Результат зберігається окремо для перекладу, слухання, письма та вимови. Після помилки — повтор через 10 хвилин; після успіхів — через 1, 3, 7, 14 днів і далі. Повторення раніше строку не подовжує інтервал.</p></details>`;
  document.getElementById('startDailyReview').onclick=()=>start('due');document.getElementById('startDailyNew').onclick=()=>start('new');document.getElementById('dailyNewLimit').onchange=e=>{const data=load();data.newLimit=Number(e.target.value);save(data);render()};
 }catch(e){root.textContent='Не вдалося відкрити повторення. Дані не змінено. Перевір доступ до сховища браузера.';console.error(e)}}
 function start(kind){const list=items(kind);if(!list.length){render();return}openVocabCategory(list[0].catIndex);endVocabQuiz();document.getElementById('vocabCategoryView').classList.add('daily-session');document.getElementById('vocabTitle').textContent=kind==='due'?'Повторення на сьогодні':'Нові слова';vq={active:true,items:list,index:0,correct:0,wrong:0,missed:[],locked:false,recognition:null,types:[...new Set(list.map(it=>it.type))],isFinal:false,review:false,finished:false,byType:{},daily:kind};document.getElementById('wordGrid').classList.add('vocab-hidden');document.getElementById('vocabTestLaunch').classList.add('vocab-hidden');document.getElementById('vocabQuiz').classList.remove('vocab-hidden');renderVq();document.getElementById('vocabQuiz').scrollIntoView({block:'start'})}
 window.DEUTSCH_REVIEW={record,snapshot,items,start,render,key,resolve,afterDays};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});window.addEventListener('focus',render);setInterval(render,60000);render();
})();
