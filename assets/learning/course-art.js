/* Reuse approved artwork by meaning; never use word position or fuzzy noun guesses. */
(()=>{
 const norm=s=>String(s||'').normalize('NFC').trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
 const aliases={
  'mich':['ich','я'],'mir':['ich','я'],'dich':['du','ти'],'dir':['du','ти'],
  'ihn':['er','він'],'ihm':['er','він'],'uns':['wir','ми'],
  'euch':['ihr','ви (до кількох людей)'],'ihnen':['sie','вони'],'Ihnen':['Sie','Ви (ввічливо)'],
  'der Montag':['Montag','понеділок'],'der Samstag':['Samstag','субота'],
  'bitte':['Bitte!','Будь ласка!'],'bis bald':['Bis bald!','До скорої зустрічі!'],
  'morgens':['der Morgen','ранок'],'abends':['der Abend','вечір'],
  'die Bücher':['das Buch','книга',2],'die Kinder':['das Kind','дитина',2],
  'die Tische':['der Tisch','стіл',2],'die Stühle':['der Stuhl','стілець',2],
  'die Türen':['die Tür','двері',2],'die Katzen':['die Katze','кіт / кішка',2],
  'die Hunde':['der Hund','собака',2],'die Schulen':['die Schule','школа',2],
  'die Hände':['die Hand','рука / кисть',2]
 };
 function oldEntries(){return Object.values(window.DEUTSCH_WORD_ART||{}).flatMap(cat=>Object.entries(cat)).map(([k,src])=>({pair:JSON.parse(k),src}))}
 function resolve(de,ua=''){
  de=norm(de);ua=norm(ua);const entries=oldEntries();
  const own=entries.find(e=>norm(e.pair[0])===de&&norm(e.pair[1])===ua);
  if(own)return {src:own.src,kind:own.src.startsWith('assets/illustrations/course/')?'new':'existing',copies:1};
  if(de==='ihr'&&ua==='їй (Dativ)'){const p=entries.find(e=>e.pair[0]==='sie'&&e.pair[1]==='вона');if(p)return {src:p.src,kind:'reused',copies:1}}
  if(de==='ihr'&&ua==='ви (кілька людей)'){const p=entries.find(e=>e.pair[0]==='ihr'&&e.pair[1]==='ви (до кількох людей)');if(p)return {src:p.src,kind:'existing',copies:1}}
  // sein / ihr are also possessives; the verb/person images would teach a different meaning.
  if((de==='sein'&&/присвійне/.test(ua))||(de==='ihr'&&/її|їхній/.test(ua)))return null;
  const same=entries.filter(e=>norm(e.pair[0])===de);
  if(same.length===1)return {src:same[0].src,kind:same[0].src.startsWith('assets/illustrations/course/')?'new':'existing',copies:1};
  const a=aliases[de];if(a){const hit=entries.find(e=>e.pair[0]===a[0]&&e.pair[1]===a[1]);if(hit)return {src:hit.src,kind:'reused',copies:a[2]||1}}
  return null;
 }
 const examples={ein:'ein Buch',eine:'eine Lampe',kein:'kein Buch',keine:'keine Lampe'};
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function html(de,ua='',className='cv2-word-art'){const a=resolve(de,ua);if(!a)return '';const img='<img class="'+className+'" src="'+escape(a.src)+'" alt="" loading="lazy" decoding="async">';if(a.copies>1)return '<span class="course-art-plural" aria-hidden="true">'+img.repeat(a.copies)+'</span>';const example=examples[norm(de)];return example?'<span class="course-art-example">'+img+'<small class="course-art-caption" lang="de">'+escape(example)+'</small></span>':img}
 window.DEUTSCH_COURSE_ART={resolve,html,aliases};
})();
