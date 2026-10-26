/* First-island layout trial. Presentation only; revert the trial commit to roll back. */
(()=>{
const details=(node,label,open=false)=>{if(!node)return;const box=document.createElement('details'),summary=document.createElement('summary');box.className='compact-details';box.open=open;summary.textContent=label;node.before(box);box.append(summary,node);return box};
let pendingAward=false;
function apply(root,island,t){
 root.classList.toggle('compact-island',island===0);if(island!==0)return;
 const text=(node,value)=>{if(node)node.textContent=value};
 const wrap=root.querySelector('.al-wrap');if(!wrap)return;
 for(const img of root.querySelectorAll('img'))if(/\/expedition\/(fox|team-(nika|tim|bruno)-(welcome|success|encourage))\.webp/.test(img.getAttribute('src')||''))img.src=img.getAttribute('src').replace('/expedition/','/expedition/compact/');
 if(root.querySelector('[data-mastery-new="true"]'))pendingAward=true;
 const board=root.querySelector('.expedition-board');
 if(board){
  const invitation=root.querySelector('.expedition-invitation'),start=invitation?.querySelector('#alStart'),head=root.querySelector('.expedition-heading'),progress=root.querySelector('.expedition-map-head');
  const seen=profileStorage.getItem('deutsch16_compact_intro_v1')==='seen';profileStorage.setItem('deutsch16_compact_intro_v1','seen');
  if(head){head.querySelector('p')?.remove();if(start){head.append(start);text(start,t('Продовжити','Continue'));}}
  if(invitation){if(seen)invitation.remove();else{ text(invitation.querySelector('strong'),t('Вирушаємо у подорож!','Let’s begin our journey!'));text(invitation.querySelector('p'),t('Навчайся з наставниками, здобувай відзнаки й знайди компас.','Learn with your mentors, earn awards and find the compass.'));}}
  if(progress)progress.querySelector('span:nth-child(2)')?.remove();
  text(root.querySelector('.expedition-map-note'),t('Обери урок · ✓ тест складено · ★ 100%','Choose a lesson · ✓ test passed · ★ 100%'));
  const awards=root.querySelector('.mastery-collection'),count=awards?.querySelector('[data-mastery-count]')?.textContent;
  details(awards,t('Відзнаки майстерності','Mastery awards')+' · '+count,pendingAward);pendingAward=false;
  details(root.querySelector('.team-roster'),t('Твої наставники','Your mentors')+' · '+root.querySelectorAll('[data-team-member]').length);
  details(root.querySelector('.archipelago-collection'),t('Знахідки','Discoveries'),!!root.querySelector('[data-compass-awake]'));
  const passport=root.querySelector('.expedition-passport');passport?.querySelector('p')?.remove();details(passport,t('Паспорт','Passport')+' · '+root.querySelectorAll('.expedition-seal.earned').length+' / 9');
 }
 const study=root.querySelector('.al-study-grid');
 if(study){
  const train=root.querySelector('#alContinue,#greetingBegin'),exam=root.querySelector('#alTest,#greetingTest'),n=study.children.length;
  if(train&&exam){text(train,t('Тренування','Training')+' · '+n*5);text(exam,t('Тест','Test')+' · '+n*3);}
  const welcome=root.querySelector('.greeting-welcome'),rule=welcome?.querySelector('div>p:nth-of-type(2)');if(rule){const theory=document.createElement('section'),heading=document.createElement('h3');theory.className='lesson-theory greeting-theory';theory.setAttribute('data-lesson-theory','');heading.textContent=t('Теорія','Theory');theory.append(heading,rule);welcome.append(theory);}
  const greeting=root.querySelector('[data-ship-chapter="greetings"]>div>p');text(greeting,t('Лис готується до висадки. Навчимося вітатися й прощатися з командою.','Fox is preparing to land. Learn to greet the team and say goodbye.'));
  root.querySelector('.team-encounter .market-mission')?.remove();
  const meet=wrap.querySelector(':scope > .tag');if(meet&&/^(Знайомство|Meet the material)/.test(meet.textContent))meet.remove();
 }
 const result=root.querySelector('.journey-result,.greeting-result');
 if(result){
  if(result.classList.contains('journey-result')){wrap.prepend(result);if(!root.querySelector('[data-team-final]'))result.querySelector('.expedition-reward-copy')?.remove();}
  const actions=result.querySelector('.journey-result-buttons'),score=result.querySelector('.journey-score');if(actions&&score)score.after(actions);
  const h=result.querySelector('h1');if(h&&root.querySelector('.expedition-master'))text(h,t('Тест складено!','Test passed!'));
 }
}
window.DEUTSCH_COMPACT={apply};
})();
