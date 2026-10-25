/* First-island layout trial. Presentation only; revert the trial commit to roll back. */
(()=>{
const details=(node,label,open=false)=>{if(!node)return;const box=document.createElement('details'),summary=document.createElement('summary');box.className='compact-details';box.open=open;summary.textContent=label;node.before(box);box.append(summary,node);return box};
let pendingClue=false;
function apply(root,island,t){
 root.classList.toggle('compact-island',island===0);if(island!==0)return;
 const text=(node,value)=>{if(node)node.textContent=value};
 const wrap=root.querySelector('.al-wrap');if(!wrap)return;
 for(const img of root.querySelectorAll('img'))if(/\/expedition\/(fox|team-(nika|tim|bruno)-(welcome|success|encourage))\.webp/.test(img.getAttribute('src')||''))img.src=img.getAttribute('src').replace('/expedition/','/expedition/compact/');
 if(root.querySelector('[data-clue-new="true"]'))pendingClue=true;
 const board=root.querySelector('.expedition-board');
 if(board){
  const invitation=root.querySelector('.expedition-invitation'),start=invitation?.querySelector('#alStart'),head=root.querySelector('.expedition-heading'),progress=root.querySelector('.expedition-map-head');
  const seen=profileStorage.getItem('deutsch16_compact_intro_v1')==='seen';profileStorage.setItem('deutsch16_compact_intro_v1','seen');
  if(head){head.querySelector('p')?.remove();if(start){head.append(start);text(start,t('Продовжити','Continue'));}}
  if(invitation){if(seen)invitation.remove();else{ text(invitation.querySelector('strong'),t('Вирушаємо у подорож!','Let’s begin our journey!'));text(invitation.querySelector('p'),t('Знайомся з командою, збирай підказки й знайди компас.','Meet the team, collect clues and find the compass.'));}}
  if(progress)progress.querySelector('span:nth-child(2)')?.remove();
  text(root.querySelector('.expedition-map-note'),t('Обери урок · ✓ тест складено · ★ 100%','Choose a lesson · ✓ test passed · ★ 100%'));
  const clues=root.querySelector('.team-clues'),count=clues?.querySelector('[data-clue-count]')?.textContent;
  clues?.querySelector('p')?.remove();details(clues,t('Підказка','Clue')+' · '+count,pendingClue);pendingClue=false;
  details(root.querySelector('.team-roster'),t('Команда','Team')+' · '+root.querySelectorAll('[data-team-member]').length);
  details(root.querySelector('.archipelago-collection'),t('Знахідки','Discoveries'),!!root.querySelector('[data-compass-awake]'));
  const passport=root.querySelector('.expedition-passport');passport?.querySelector('p')?.remove();details(passport,t('Паспорт','Passport')+' · '+root.querySelectorAll('.expedition-seal.earned').length+' / 9');
 }
 const study=root.querySelector('.al-study-grid');
 if(study){
  for(const p of [...wrap.querySelectorAll(':scope > p')]){
   if(/^(Тренування:|Training:)/.test(p.textContent))details(p,t('Як це працює','How it works'));
   else if(/^(Можна|Спочатку заверши|Train or|Finish training|Repeat training)/.test(p.textContent)){const exam=root.querySelector('#alTest,#greetingTest');if(exam?.disabled)text(p,t('Тест відкриється після тренування.','Training unlocks the test.'));else p.remove();}
  }
  const train=root.querySelector('#alContinue,#greetingBegin'),exam=root.querySelector('#alTest,#greetingTest'),n=study.children.length;
  if(train&&exam){text(train,t('Тренування','Training')+' · '+n*5);text(exam,t('Тест','Test')+' · '+n*3);}
  const greeting=root.querySelector('[data-ship-chapter="greetings"]>div>p');text(greeting,t('Лис готується до висадки. Навчимося вітатися й прощатися з командою.','Fox is preparing to land. Learn to greet the team and say goodbye.'));
  root.querySelector('.team-encounter .market-mission')?.remove();
  const meet=wrap.querySelector(':scope > .tag');if(meet&&/^(Знайомство|Meet the material)/.test(meet.textContent))meet.remove();
  const goal=root.querySelector('.journey-goal');if(goal)details(goal,t('Мета уроку','Lesson goal'));
 }
 const training=root.querySelector('.lesson-training-summary');if(training){text(training.querySelector('p'),t('Тепер можна пройти тест і отримати печатку.','Take the test to earn your seal.'));}
 const result=root.querySelector('.journey-result,.greeting-result');
 if(result){
  if(result.classList.contains('journey-result')){wrap.prepend(result);if(!root.querySelector('[data-team-final]'))result.querySelector('.expedition-reward-copy')?.remove();}
  const actions=result.querySelector('.journey-result-buttons'),score=result.querySelector('.journey-score');if(actions&&score)score.after(actions);
  for(const p of result.querySelectorAll(':scope > p'))if(/^(Для проходження|Тест перевіряє|Pass with|The test covers)/.test(p.textContent))p.remove();
  details(result.querySelector('.journey-recap'),t('Переглянути помилки','Review mistakes'));
  const h=result.querySelector('h1');if(h&&root.querySelector('.expedition-master'))text(h,t('Тест складено!','Test passed!'));
 }
}
window.DEUTSCH_COMPACT={apply};
})();
