const {chromium}=require('playwright');
const {pathToFileURL}=require('url');
const path=require('path');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=process.env.ART_SITE_URL||pathToFileURL(path.resolve('index.html')).href;
  await page.goto(url,{waitUntil:'load'});
  await page.locator('#wordsTab').click();
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   await page.locator('#vocabIconGrid img.category-art').evaluateAll(els=>els.forEach(el=>el.loading='eager'));
   await page.waitForFunction(()=>{const icons=[...document.querySelectorAll('#vocabIconGrid img.category-art')];return icons.length===16&&icons.every(el=>el.complete&&el.naturalWidth>0)});
   const categoryAudit=await page.evaluate(()=>({count:document.querySelectorAll('#vocabIconGrid img.category-art').length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+5,distinct:new Set([...document.querySelectorAll('#vocabIconGrid img.category-art')].map(el=>el.getAttribute('src'))).size}));
   if(categoryAudit.count!==16||categoryAudit.distinct!==16||categoryAudit.overflow)throw Error('Category illustration failure '+width+JSON.stringify(categoryAudit));
  }
  if(await page.locator('#vocabCategoryView').isVisible())throw Error('Dictionary must open on categories only');
  for(const index of [0,1,15]){
   const card=page.locator('#vocabIconGrid [data-cat="'+index+'"]');
   await card.focus();await page.keyboard.press('Enter');
   if(await page.locator('#vocabCategoriesView').isVisible())throw Error('Categories remain visible inside a category');
   const expected=await page.evaluate(i=>vocabCategories[i].words.length,index);
   if(await page.locator('#wordGrid .wordcard').count()!==expected)throw Error('Wrong category words');
   await page.locator('#startVocabQuiz').click();
   await page.locator('#vocabBack').click();
   if(!await page.locator('#vocabCategoriesView').isVisible()||await page.locator('#vocabQuiz').isVisible())throw Error('Back failed to close training');
   if(!await card.evaluate(el=>el===document.activeElement))throw Error('Category focus not restored');
  }
  await page.locator('#vocabIconGrid [data-cat="0"]').click();
  await page.locator('#wordsTab').click();
  if(!await page.locator('#vocabCategoriesView').isVisible())throw Error('Dictionary tab must reset to category selection');
  console.log('PASS dictionary navigation: keyboard selection, isolated words, back from training, focus restoration');
  console.log('PASS 16 distinct category PNGs: all loaded at 320/390/1280px');
  const categories=await page.evaluate(()=>vocabCategories.map((c,i)=>({name:c.name,index:i,approved:!!window.DEUTSCH_WORD_ART?.[c.name]})));
  const approved=categories.filter(c=>c.approved);
  if(!approved.length)throw Error('No approved artwork loaded');
  for(const category of approved){
   for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:900});
    await page.evaluate(i=>openVocabCategory(i),category.index);
    // Eager-load all cards so lazy images below the fold are also checked.
    await page.locator('#wordGrid img').evaluateAll(els=>els.forEach(el=>el.loading='eager'));
    await page.waitForFunction(()=>[...document.querySelectorAll('#wordGrid img')].every(im=>im.complete&&im.naturalWidth>0));
    const result=await page.evaluate(()=>{
     const c=vocabCategories[activeVocab];
     return {count:document.querySelectorAll('#wordGrid img').length,total:c.words.length,
       valid:[...document.querySelectorAll('#wordGrid .wordcard')].every((el,i)=>el.querySelector('img')?.getAttribute('src')===window.DEUTSCH_WORD_ART[c.name][JSON.stringify(c.words[i].slice(0,2))]),
       overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+5};
    });
    if(result.count!==result.total||!result.valid||result.overflow)throw Error(JSON.stringify({category,width,result}));
   }
   // Reordering must not change the image for a word (including the two "sie" meanings).
   await page.evaluate(()=>{const c=vocabCategories[activeVocab];const before=c.words.map(w=>vocabularyIllustration(c,w));c.words.reverse();const after=c.words.map(w=>vocabularyIllustration(c,w)).reverse();c.words.reverse();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Art depends on word order')});
  }
  if(errors.length)throw Error(errors.join('; '));
  fs.mkdirSync('audit-screenshots',{recursive:true});
  await page.screenshot({path:'audit-screenshots/approved-art.png',fullPage:true});
  console.log('PASS approved artwork: exact word/meaning bindings, all images loaded, mobile/desktop, reorder safety',url);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});


