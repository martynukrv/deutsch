const{chromium}=require('playwright');const{pathToFileURL}=require('url');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});try{const context=await b.newContext({viewport:{width:390,height:844}});const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));const url=pathToFileURL(path.resolve('index.html')).href;
await p.goto(url);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('deutsch16_vocab_stats_v1',JSON.stringify({ich:{ok:7,bad:2}}));localStorage.setItem('deutsch16_vocab_modes_v1','["de","write"]');localStorage.setItem('deutsch16_lesson_started','1')});await p.reload();
const first=await p.evaluate(()=>DEUTSCH_PROFILES.sessionId);
if(!await p.evaluate(()=>loadVqStats().ich.ok===7&&hasStartedLessons()&&vqModes.join(',')==='de,write'))throw Error('Legacy migration lost data');
await p.locator('#profileButton').click();await p.locator('#profileRenameInput').fill('Роман');await p.locator('#profileRenameForm button').click();if(await p.locator('#profileName').textContent()!=='Роман')throw Error('Rename failed');
await p.locator('#profileAddInput').fill('Олексій');await Promise.all([p.waitForEvent('load'),p.locator('#profileAddForm button').click()]);
if(!await p.evaluate(()=>!loadVqStats().ich&&DEUTSCH_REVIEW.snapshot().known.size===0&&!hasStartedLessons()&&vqModes.join(',')==='ua'))throw Error('New profile inherited progress or modes');
await p.evaluate(()=>{saveVqResult('ich',false);DEUTSCH_REVIEW.record({w:vocabCategories[0].words[0],type:'write'},false);profileStorage.setItem('deutsch16_vocab_modes_v1','["listen"]')});await p.reload();if(!await p.evaluate(()=>loadVqStats().ich.bad===1&&vqModes.join(',')==='listen'))throw Error('Child profile did not persist');
await p.locator('#profileButton').click();await Promise.all([p.waitForEvent('load'),p.locator('.profile-choice').filter({hasText:'Роман'}).click()]);
if(!await p.evaluate(()=>loadVqStats().ich.ok===7&&loadVqStats().ich.bad===2&&!Object.values(DEUTSCH_REVIEW.snapshot().data.cards).some(c=>c.type==='write')&&vqModes.join(',')==='de,write'&&hasStartedLessons()))throw Error('Profiles mixed progress');
if(await p.evaluate(()=>DEUTSCH_PROFILES.sessionId)!==first)throw Error('Profile identity changed');
await p.locator('#profileButton').click();await p.locator('#profileAddInput').fill('Олексій');await p.locator('#profileAddForm button').click();if(!await p.locator('#profileError').textContent().then(s=>s.includes('уже є')))throw Error('Duplicate name accepted');
await p.locator('#profileRenameInput').fill('<b>Роман</b>');await p.locator('#profileRenameForm button').click();if(await p.locator('#profileName b').count())throw Error('Profile name injected HTML');
for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:844});if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Profile layout overflow at '+width);}
await p.screenshot({path:'audit-screenshots/profiles.png'});await p.locator('#profileClose').click();
// Adaptive route, full course and activity belong to each learner, including separate tabs.
await p.evaluate(()=>{profileStorage.setItem('deutsch16_adaptive_v1',JSON.stringify({version:1,carouselMigrated:true,cards:{ich:{success:1}},sessions:{'people-five':{last:Date.now()}}}));profileStorage.setItem('deutsch16_course_v2',JSON.stringify({one:{completed:true}}));DEUTSCH_PROGRESS.record(true,'ua')});
const parentData=await p.evaluate(()=>({route:profileStorage.getItem('deutsch16_adaptive_v1'),course:profileStorage.getItem('deutsch16_course_v2'),activity:DEUTSCH_PROGRESS.snapshot().answers}));
const p2=await p.context().newPage();await p2.goto(url);await p2.locator('#profileButton').click();await Promise.all([p2.waitForEvent('load'),p2.locator('.profile-choice').filter({hasText:'Олексій'}).click()]);
if(await p.locator('#profileName').textContent()==='Олексій')throw Error('Other tab switched learner');
if(!await p2.evaluate(()=>DEUTSCH_ADAPTIVE.plan().n===0&&!profileStorage.getItem('deutsch16_course_v2')&&DEUTSCH_PROGRESS.snapshot().answers===1))throw Error('Child inherited route/course/activity: '+JSON.stringify(await p2.evaluate(()=>({n:DEUTSCH_ADAPTIVE.plan().n,course:profileStorage.getItem('deutsch16_course_v2'),answers:DEUTSCH_PROGRESS.snapshot().answers}))));
await p2.evaluate(()=>DEUTSCH_PROGRESS.record(false,'write'));await p2.reload();if(!await p2.evaluate(()=>DEUTSCH_PROGRESS.snapshot().answers===2&&DEUTSCH_ADAPTIVE.plan().n===0))throw Error('Child progress not persisted');
await p.reload();const restored=await p.evaluate(()=>({route:profileStorage.getItem('deutsch16_adaptive_v1'),course:profileStorage.getItem('deutsch16_course_v2'),activity:DEUTSCH_PROGRESS.snapshot().answers}));if(JSON.stringify(restored)!==JSON.stringify(parentData))throw Error('Parent progress changed');
await p.locator('#profileButton').click();const childRow=p.locator('.profile-row').filter({hasText:'Олексій'});
p.once('dialog',d=>d.dismiss());await childRow.locator('.profile-delete').click();if(await childRow.count()!==1)throw Error('Cancel deleted profile');
const childId=await p2.evaluate(()=>DEUTSCH_PROFILES.sessionId);const deletedReload=p2.waitForEvent('load');p.once('dialog',d=>d.accept());await childRow.locator('.profile-delete').click();await deletedReload;
if(!await p.evaluate(id=>!Object.keys(localStorage).some(k=>k.startsWith('deutsch16_profile:'+id+':')),childId))throw Error('Deleted profile retained progress');
if(await p2.evaluate(()=>DEUTSCH_PROFILES.sessionId)!==first)throw Error('Deleted-profile tab did not leave');
if(!await p.locator('.profile-delete').isDisabled())throw Error('Last profile can be deleted');
// Delete an active profile and return to a remaining learner.
await p.locator('#profileAddInput').fill('Тимчасовий');await Promise.all([p.waitForEvent('load'),p.locator('#profileAddForm button').click()]);await p.locator('#profileButton').click();p.once('dialog',d=>d.accept());await Promise.all([p.waitForEvent('load'),p.locator('.profile-row').filter({hasText:'Тимчасовий'}).locator('.profile-delete').click()]);
if(await p.evaluate(()=>DEUTSCH_PROFILES.sessionId)!==first)throw Error('Active deletion did not select remaining learner');
if(errors.length)throw Error(errors.join('; '));console.log('PASS profile creation/rename/switch, legacy migration, isolated results/settings, reload persistence, safe names, mobile layout, separate tabs, isolated route/course/activity and confirmed profile deletion');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
