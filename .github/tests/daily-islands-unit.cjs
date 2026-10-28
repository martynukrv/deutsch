const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const storage=new Map(),ctx={window:{},profileStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('assets/adaptive/daily-review.js','utf8'),ctx);const api=ctx.window.DEUTSCH_DAILY_ISLANDS,now=Date.now(),cards=Array.from({length:20},(_,i)=>({id:'c'+i})),data={cards:{}};
assert.equal(api.plan(cards,data,now).length,0);
for(let i=0;i<20;i++)data.cards['c'+i]={skills:{ua:{ok:1,bad:0,step:2,due:now+(i<12?-1:1)*60000},de:{skipped:1,due:now-1}}};
const before=JSON.stringify(data),orders=new Set();for(let i=0;i<60;i++){const q=api.plan(cards,data,now);assert.equal(q.length,12);assert.equal(new Set(q.map(x=>x.c.id)).size,12);assert(q.every(x=>Number(x.c.id.slice(1))<12&&x.type==='ua'));orders.add(q.map(x=>x.c.id).join('|'))}assert(orders.size>1);assert.equal(JSON.stringify(data),before);
assert.equal(api.plan([cards[0]],data,now).length,1);data.cards.c0.skills.write={bad:1,due:now-1,step:0};assert.equal(api.plan([cards[0]],data,now).length,2);assert.equal(api.plan([{id:'unseen'}],data,now).length,0);
assert.equal(api.plan([cards[0]],{cards:{c0:{success:3,due:now-1}}},now)[0].type,'ua');
api.record([{ok:true},{ok:false},{ok:false,skipped:true}],now);api.record([{ok:true}],now,true);assert.equal(api.today(now).length,1);assert.equal(api.today(now)[0].correct,1);assert.equal(api.today(now)[0].skipped,1);assert.equal(api.today(now+86400000).length,0);storage.clear();assert.equal(api.today(now).length,0);
console.log('PASS daily island planner: due priority, bounded diverse random tasks, observed skills only, skip exclusion, legacy recognition, no source mutation, local-day summaries and separate repairs');
