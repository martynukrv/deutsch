/* Complete per-lesson illustration backlog, separate from the immutable vocabulary data. */
const fs=require('fs'),vm=require('vm');const ctx={window:{}};vm.createContext(ctx);
for(const f of ['assets/illustrations/word-art.js','assets/learning/course-data.js','assets/learning/phrase-art.js','assets/learning/course-art.js'])if(fs.existsSync(f))vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const D=ctx.window.DEUTSCH_COURSE_DATA,A=ctx.window.DEUTSCH_COURSE_ART;
const cards=D.lexicon.map(w=>({...w,art:A.resolve(w.de,w.ua)}));
const report={version:1,total:cards.length,illustrated:cards.filter(w=>w.art).length,missing:cards.filter(w=>!w.art).length,lessons:D.lessons.map(l=>({number:l.number,id:l.id,title:l.titleUk,words:cards.filter(w=>w.lessonIds.includes(l.id)).map(w=>({id:w.id,de:w.de,ua:w.ua,art:w.art})),checkpoint:l.kind==='checkpoint'}))};
fs.mkdirSync('docs/artwork',{recursive:true});fs.writeFileSync('docs/artwork/course-art-audit.json',JSON.stringify(report,null,2)+'\n');
let text='# Ілюстрації до 79 уроків\n\nПовний перелік карток, згрупований за уроками. Спільне слово малюємо один раз і використовуємо в усіх відповідних уроках. Підсумкові уроки повторюють попередній матеріал.\n\nКарток: '+report.total+'. З ілюстраціями: '+report.illustrated+'. Очікують: '+report.missing+'.\n\n';
for(const l of report.lessons){text+='## '+l.number+'. '+l.title+'\n\n';if(!l.words.length)text+='Повторення раніше вивчених слів; окрема нова лексика не потрібна.\n\n';else{for(const w of l.words)text+='- '+(w.art?'[x]':'[ ]')+' '+w.de+' — '+w.ua+(w.art?' · '+(w.art.kind==='new'?'нова ілюстрація':'відновлена / повторно використана'):'')+'\n';text+='\n'}}
fs.writeFileSync('docs/artwork/course-art-plan.md',text);console.log(JSON.stringify({total:report.total,illustrated:report.illustrated,missing:report.missing}));

const phrasePairs=[...new Map(D.lessons.flatMap(l=>l.phrases).map(p=>[JSON.stringify([p.de,p.ua]),p])).values()];
const phraseAudit={lessons:D.lessons.length,totalUnique:phrasePairs.length,illustrated:phrasePairs.filter(p=>A.resolve(p.de,p.ua)).length,missing:phrasePairs.filter(p=>!A.resolve(p.de,p.ua)).map(p=>({de:p.de,ua:p.ua})),byLesson:D.lessons.map(l=>({id:l.id,number:l.number,total:l.phrases.length,illustrated:l.phrases.filter(p=>A.resolve(p.de,p.ua)).length}))};
fs.writeFileSync('docs/artwork/phrase-art-audit.json',JSON.stringify(phraseAudit,null,2)+'\n');console.log(JSON.stringify({uniquePhrases:phraseAudit.totalUnique,illustrated:phraseAudit.illustrated,missing:phraseAudit.missing.length}));
