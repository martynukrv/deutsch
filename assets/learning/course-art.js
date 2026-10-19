/* Reuse approved artwork by meaning; never use word position or fuzzy noun guesses. */
(()=>{
 const norm=s=>String(s||'').normalize('NFC').trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
 const aliases={
  'der Montag':['Montag','понеділок'],'der Samstag':['Samstag','субота'],
  'bitte':['Bitte!','Будь ласка!'],'bis bald':['Bis bald!','До скорої зустрічі!'],
  'morgens':['der Morgen','ранок'],'abends':['der Abend','вечір'],
  'die Bücher':['das Buch','книга',2],'die Kinder':['das Kind','дитина',2],
  'die Tische':['der Tisch','стіл',2],'die Stühle':['der Stuhl','стілець',2],
  'die Türen':['die Tür','двері',2],'die Katzen':['die Katze','кішка',2],
  'die Hunde':['der Hund','собака',2],'die Schulen':['die Schule','школа',2],
  'die Hände':['die Hand','рука / кисть',2]
 };
 function oldEntries(){return Object.values(window.DEUTSCH_WORD_ART||{}).flatMap(cat=>Object.entries(cat)).map(([k,src])=>({pair:JSON.parse(k),src}))}
 function resolve(de,ua=''){
  de=norm(de);ua=norm(ua);const entries=oldEntries();
  const own=entries.find(e=>norm(e.pair[0])===de&&norm(e.pair[1])===ua);
  if(own)return {src:own.src,kind:own.src.startsWith('assets/illustrations/course/')?'new':'existing',copies:1};
  // sein / ihr are also possessives; the verb/person images would teach a different meaning.
  if((de==='sein'&&/присвійне/.test(ua))||(de==='ihr'&&/її|їхній/.test(ua)))return null;
  const same=entries.filter(e=>norm(e.pair[0])===de);
  if(same.length===1)return {src:same[0].src,kind:same[0].src.startsWith('assets/illustrations/course/')?'new':'existing',copies:1};
  const a=aliases[de];if(a){const hit=entries.find(e=>e.pair[0]===a[0]&&e.pair[1]===a[1]);if(hit)return {src:hit.src,kind:'reused',copies:a[2]||1}}
  return null;
 }
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function html(de,ua='',className='cv2-word-art'){const a=resolve(de,ua);if(!a)return '';const img='<img class="'+className+'" src="'+escape(a.src)+'" alt="" loading="lazy" decoding="async">';return a.copies>1?'<span class="course-art-plural" aria-hidden="true">'+img.repeat(a.copies)+'</span>':img}
 window.DEUTSCH_COURSE_ART={resolve,html,aliases};
})();
