/* Short, ungraded practice from observed island skills. No new vocabulary enrolment. */
(()=>{
const key='deutsch16_daily_islands_v1',types=['ua','de','listen','write'];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const dateKey=(now=Date.now())=>{const d=new Date(now);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function plan(cards,data,now=Date.now(),limit=12){
 const candidates=[];
 for(const c of cards){const x=data.cards?.[c.id];if(!x)continue;
  for(const type of types){const skill=x.skills?.[type];if(!skill||!(skill.ok||skill.bad))continue;
   const due=Number.isFinite(skill.due)&&skill.due<=now,weak=skill.lastOutcome===false||(skill.bad||0)>(skill.ok||0);
   candidates.push({c,type,due,priority:due?0:weak?1:2,step:skill.step||0});
  }
  // Old records predate separate skills: only recognition was demonstrated.
  if(!x.skills&&(x.success||x.bad))candidates.push({c,type:'ua',due:x.due<=now,priority:x.due<=now?0:1,step:x.step||0});
 }
 const pool=shuffle(candidates).sort((a,b)=>a.priority-b.priority||a.step-b.step),chosen=[],counts=new Map();
 // Prefer variety of words before a second skill of the same word.
 for(const cap of [1,2])for(const q of pool){if(chosen.length>=limit)break;if(chosen.includes(q)||(counts.get(q.c.id)||0)>=cap)continue;chosen.push(q);counts.set(q.c.id,(counts.get(q.c.id)||0)+1)}
 return shuffle(chosen).map(({c,type,due})=>({c,type,dailyDue:due}));
}
function read(){const raw=profileStorage.getItem(key);if(!raw)return {version:1,history:[]};const d=JSON.parse(raw);if(d.version!==1||!Array.isArray(d.history))throw Error('Unsupported daily practice data');return d}
function record(results,now=Date.now(),repair=false){const d=read(),entry={at:now,day:dateKey(now),repair,total:results.length,correct:results.filter(r=>r.ok&&!r.skipped).length,skipped:results.filter(r=>r.skipped).length};d.history=[...d.history,entry].slice(-60);profileStorage.setItem(key,JSON.stringify(d));return entry}
function today(now=Date.now()){return read().history.filter(r=>r.day===dateKey(now)&&!r.repair)}
window.DEUTSCH_DAILY_ISLANDS={key,plan,read,record,today,dateKey};
})();
