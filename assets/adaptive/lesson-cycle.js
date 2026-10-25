/* Pure island lesson plans: full training, balanced exams and bounded correction. */
(()=>{
 const types=['ua','de','listen','write','speak'];
 function shuffle(xs){xs=[...xs];for(let i=xs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[xs[i],xs[j]]=[xs[j],xs[i]]}return xs}
 const task=(c,type,extra={})=>({c,type,...(c.replyTo&&['de','write'].includes(type)?{dialoguePrompt:c.replyTo}:{}),...extra});
 function training(cards){return types.flatMap((type,round)=>shuffle(cards).map(c=>task(c,type,{round})))}
 function exam(cards){const menu=shuffle(types.slice(0,4)),groups=shuffle(cards).map((c,i)=>shuffle(menu.filter((_,n)=>n!==i%4)).map(type=>task(c,type,{assessment:true}))),out=[];let previous=null;while(groups.some(g=>g.length)){const available=groups.filter(g=>g.length&&g[0].c.id!==previous),largest=Math.max(...available.map(g=>g.length)),g=shuffle(available.filter(g=>g.length===largest))[0];if(!g)throw Error('Cannot separate repeated exam phrases');const next=g.pop();out.push(next);previous=next.c.id}return out}
 const id=q=>q.c.id+'|'+q.type;
 function status(results){const rows=new Map();for(const r of results){const key=id(r),row=rows.get(key)||{task:r,attempts:0,wrong:0};row.task=r;row.attempts++;if(!r.ok&&!r.skipped)row.wrong++;row.ok=!!r.ok&&!r.skipped;row.skipped=!!r.skipped;rows.set(key,row)}return [...rows.values()]}
 function corrections(results,micAvailable=true){return shuffle(status(results).filter(r=>!r.ok&&r.attempts<3&&(r.task.type!=='speak'||micAvailable)).map(r=>({...r.task,assessment:false,retry:true})))}
 window.DEUTSCH_LESSON_CYCLE={types,training,exam,status,corrections,id};
})();
