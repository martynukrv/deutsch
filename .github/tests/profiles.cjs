const{chromium}=require('playwright');const{pathToFileURL}=require('url');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});try{const context=await b.newContext({viewport:{width:390,height:844}});const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));const url=pathToFileURL(path.resolve('index.html')).href;
await p.goto(url);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('deutsch16_vocab_stats_v1',JSON.stringify({ich:{ok:7,bad:2}}));localStorage.setItem('deutsch16_vocab_modes_v1','["de","write"]');localStorage.setItem('deutsch16_lesson_started','1')});await p.reload();
const first=await p.evaluate(()=>DEUTSCH_PROFILES.sessionId);
if(!await p.evaluate(()=>loadVqStats().ich.ok===7&&hasStartedLessons()&&vqModes.join(',')==='de,write'))throw Error('Legacy migration lost data');
await p.locator('#profileButton').click();await p.locator('#profileRenameInput').fill('Роман');await p.locator('#profileRenameForm button').click();if(await p.locator('#profileName').textContent()!=='Роман')throw Error('Rename failed');
await p.locator('#profileAddInput').fill('Олексій');await Promise.all([p.waitForEvent('load'),p.locator('#profileAddForm button').click()]);
if(!await p.evaluate(()=>!loadVqStats().ich&&!hasStartedLessons()&&vqModes.join(',')==='ua'))throw Error('New profile inherited progress or modes');
await p.evaluate(()=>{saveVqResult('ich',false);profileStorage.setItem('deutsch16_vocab_modes_v1','["listen"]')});await p.reload();if(!await p.evaluate(()=>loadVqStats().ich.bad===1&&vqModes.join(',')==='listen'))throw Error('Child profile did not persist');
await p.locator('#profileButton').click();await Promise.all([p.waitForEvent('load'),p.locator('.profile-choice').filter({hasText:'Роман'}).click()]);
if(!await p.evaluate(()=>loadVqStats().ich.ok===7&&loadVqStats().ich.bad===2&&vqModes.join(',')==='de,write'&&hasStartedLessons()))throw Error('Profiles mixed progress');
if(await p.evaluate(()=>DEUTSCH_PROFILES.sessionId)!==first)throw Error('Profile identity changed');
await p.locator('#profileButton').click();await p.locator('#profileAddInput').fill('Олексій');await p.locator('#profileAddForm button').click();if(!await p.locator('#profileError').textContent().then(s=>s.includes('уже є')))throw Error('Duplicate name accepted');
await p.locator('#profileRenameInput').fill('<b>Роман</b>');await p.locator('#profileRenameForm button').click();if(await p.locator('#profileName b').count())throw Error('Profile name injected HTML');
for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:844});if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Profile layout overflow at '+width);}
await p.screenshot({path:'audit-screenshots/profiles.png'});await p.locator('#profileClose').click();
// A second tab changing the active profile must reload the first tab as well.
const p2=await p.context().newPage();await p2.goto(url);await p2.locator('#profileButton').click();const changed=p.waitForEvent('load');await Promise.all([p2.waitForEvent('load'),p2.locator('.profile-choice').filter({hasText:'Олексій'}).click()]);await changed;if(await p.locator('#profileName').textContent()!=='Олексій')throw Error('Other tab retained old session');
if(errors.length)throw Error(errors.join('; '));console.log('PASS profile creation/rename/switch, legacy migration, isolated results/settings, reload persistence, safe names, mobile layout and cross-tab switch');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
