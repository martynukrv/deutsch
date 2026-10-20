const fs=require('fs'),path=require('path');const ROOT=path.resolve(__dirname,'../..');process.chdir(ROOT);global.window={};require(ROOT+'/assets/illustrations/word-art.js');require(ROOT+'/assets/learning/course-art.js');const entries=Object.values(window.DEUTSCH_WORD_ART).flatMap(x=>Object.keys(x).map(k=>JSON.parse(k))),art=window.DEUTSCH_COURSE_ART;
const list=JSON.parse(fs.readFileSync('art-sources/phrase-scenes-20261020/queue.json')),scenes=JSON.parse(fs.readFileSync('art-inbox/phrase-scenes-20261020.json')).items;
const norm=s=>s.normalize('NFC').trim().replace(/[.!?]+$/,'').replace(/\s+/g,' '),mapping={},audit=[];
for(const p of list){let pair;if(p.target.startsWith('@')){const x=scenes[+p.target.slice(1)];pair=[x.de,x.ua]}else if(p.target==='der Termin')pair=['der Termin','запланована зустріч'];else if(p.target==='TerminMedical')pair=['der Termin','запланований прийом'];else {const matches=entries.filter(x=>x[0]===p.target);if(matches.length!==1){if(!matches.length&&art.aliases[p.target])pair=[p.target,''];else throw Error('Ambiguous or missing target '+p.target)}else pair=matches[0]}
 const resolved=art.resolve(...pair);if(!resolved)throw Error('Unresolved '+pair);const record={target:pair};const cue=p.de.match(/\b(nicht|kein(?:e[nmrs]?)?|ohne|nie)\b/);if(cue)record.cue=cue[1];else if(p.de.endsWith('?'))record.cue='?';
 // The 16 newly illustrated exact pairs resolve directly; only other phrases need a reuse binding.
 if(!scenes.some(x=>x.de===p.de&&x.ua===p.ua))mapping[JSON.stringify([norm(p.de),norm(p.ua)])]=record;
 audit.push({phraseId:p.phraseId,de:p.de,ua:p.ua,source:pair,src:resolved.src,kind:p.target.startsWith('@')?'new-scene':'curated-topic',cue:record.cue||null});
}
fs.writeFileSync('assets/learning/phrase-art.js','/* Curated exact phrase/meaning bindings. Images cue the topic; grammar remains in the text. */\nwindow.DEUTSCH_PHRASE_ART = '+JSON.stringify(mapping)+';\n');
fs.writeFileSync('art-sources/phrase-scenes-20261020/phrase-bindings.json',JSON.stringify(audit,null,2)+'\n');console.log('Bound',audit.length,'previously unillustrated phrases');
