/* Compact story presentation on both islands. Teaching text stays fully visible. */
(()=>{
const details=(node,label,open=false)=>{if(!node)return;const box=document.createElement('details'),summary=document.createElement('summary');box.className='compact-details';box.open=open;summary.textContent=label;node.before(box);box.append(summary,node);return box};
const pendingAward=[false,false,false,false];
function apply(root,island,t){
 root.classList.toggle('compact-island',[0,1,2,3].includes(island));if(![0,1,2,3].includes(island))return;root.dataset.compactIsland=String(island);
 const text=(node,value)=>{if(node)node.textContent=value};
 const wrap=root.querySelector('.al-wrap');if(!wrap)return;
 for(const img of root.querySelectorAll('img'))if(/\/expedition\/(fox|(team-(nika|tim|bruno)|resident-(lina|mia|otto|emma|karl)|merchant-benno)-(welcome|success|encourage))\.webp/.test(img.getAttribute('src')||''))img.src=img.getAttribute('src').replace('/expedition/','/expedition/compact/');
 if(root.querySelector('[data-mastery-new="true"]'))pendingAward[island]=true;
 const board=root.querySelector('.expedition-board');
 if(board){
  const invitation=root.querySelector('.expedition-invitation'),start=invitation?.querySelector('#alStart'),head=root.querySelector('.expedition-heading'),progress=root.querySelector('.expedition-map-head');
  const seenKey=island===3?'deutsch16_compact_city_intro_v1':island===2?'deutsch16_compact_gear_intro_v1':island===0?'deutsch16_compact_intro_v1':'deutsch16_compact_village_intro_v1',seen=profileStorage.getItem(seenKey)==='seen';profileStorage.setItem(seenKey,'seen');
  if(head){head.querySelector('p')?.remove();if(start){head.append(start);text(start,t('Продовжити','Continue'));}}
  if(invitation&&island===2){const img=invitation.querySelector('img');img.src='assets/illustrations/expedition/gear-greta-welcome.webp';img.alt=t('Ґрета','Greta')}
  if(invitation){if(seen)invitation.remove();else{ text(invitation.querySelector('strong'),island===0?t('Вирушаємо у подорож!','Let’s begin our journey!'):t('Ласкаво просимо до містечка!','Welcome to the town!'));text(invitation.querySelector('p'),island===0?t('Навчайся з наставниками, здобувай відзнаки й знайди компас.','Learn with your mentors, earn awards and find the compass.'):t('Навчайся з мешканцями, здобувай відзнаки й засвіти маяк.','Learn with the residents, earn awards and light the lighthouse.'));if(island===1){const img=invitation.querySelector('img');img.src='assets/illustrations/expedition/compact/resident-lina-welcome.webp';img.alt=t('Ліна','Lina');}}}
  if(invitation&&island===2&&!seen){text(invitation.querySelector('strong'),t('Зберімо спорядження для пригоди!','Let’s prepare for the adventure!'));text(invitation.querySelector('p'),t('Ґрета, Фелікс і Юна допоможуть зібрати рюкзак та отримати карту маршруту.','Greta, Felix and Juna will help you pack and earn the route map.'))}
  if(invitation&&island===3&&!seen){const img=invitation.querySelector('img');img.src='assets/illustrations/expedition/resident-karl-welcome.webp';img.alt=t('Карл','Karl');text(invitation.querySelector('strong'),t('Карта привела нас до міста!','The map led us to the city!'));text(invitation.querySelector('p'),t('Карл допоможе впізнати місця, запитати дорогу й дістатися брами.','Karl will help you recognise places, ask directions and reach the gate.'))}
  if(progress)progress.querySelector('span:nth-child(2)')?.remove();
  text(root.querySelector('.expedition-map-note'),t('Обери урок · ✓ тест складено · ★ 100%','Choose a lesson · ✓ test passed · ★ 100%'));
  const awards=root.querySelector('.mastery-collection'),count=awards?.querySelector('[data-mastery-count]')?.textContent;
  details(awards,t('Відзнаки майстерності','Mastery awards')+' · '+count,pendingAward[island]);pendingAward[island]=false;
  const roster=root.querySelector('.team-roster,.resident-roster');
  details(roster,t('Твої наставники','Your mentors')+' · '+(roster?.querySelectorAll('.mentor-card').length||0));
  details(root.querySelector('.archipelago-collection'),t('Знахідки','Discoveries'),!!root.querySelector('[data-compass-awake]'));
  const passport=root.querySelector('.expedition-passport');passport?.querySelector('p')?.remove();details(passport,t('Паспорт','Passport')+' · '+root.querySelectorAll('.expedition-seal.earned').length+' / '+root.querySelectorAll('.expedition-seal').length);
 }
 const study=root.querySelector('.al-study-grid');
 if(study){
  const train=root.querySelector('#alContinue,#greetingBegin'),exam=root.querySelector('#alTest,#greetingTest'),n=study.children.length;
  if(train&&exam){text(train,t('Тренування','Training')+' · '+n*5);text(exam,t('Тест','Test')+' · '+n*3);}
  const welcome=root.querySelector('.greeting-welcome'),rule=welcome?.querySelector('div>p:nth-of-type(2)');if(rule){const theory=document.createElement('section'),heading=document.createElement('h3');theory.className='lesson-theory greeting-theory';theory.setAttribute('data-lesson-theory','');heading.textContent=t('Теорія','Theory');theory.append(heading,rule);welcome.append(theory);}
  const greeting=root.querySelector('[data-ship-chapter="greetings"]>div>p');text(greeting,t('Лис готується до висадки. Навчимося вітатися й прощатися з командою.','Fox is preparing to land. Learn to greet the team and say goodbye.'));
  root.querySelector('.market-encounter .market-mission')?.remove();
  const meet=wrap.querySelector(':scope > .tag');if(meet&&/^(Знайомство|Meet the material)/.test(meet.textContent))meet.remove();
 }
 const result=root.querySelector('.journey-result,.greeting-result');
 if(result){
  if(result.classList.contains('journey-result')){wrap.prepend(result);if(!root.querySelector('[data-team-final],[data-resident-final]'))result.querySelector('.expedition-reward-copy')?.remove();}
  const actions=result.querySelector('.journey-result-buttons'),score=result.querySelector('.journey-score');if(actions&&score)score.after(actions);
  const h=result.querySelector('h1');if(h&&root.querySelector('.expedition-master'))text(h,t('Тест складено!','Test passed!'));
 }
}
window.DEUTSCH_COMPACT={apply};
})();
