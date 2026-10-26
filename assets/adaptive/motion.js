/* Motion decorates existing state; it never advances tasks, changes grades or plays sound. */
(()=>{
const root=document.getElementById('learningView');if(!root)return;
const key='deutsch16_motion_v1',reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=profileStorage.getItem(key)!=='off',board=null;
const io=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-in-view',e.isIntersecting)),{threshold:.05});
function scan(){const next=root.querySelector('.expedition-board');if(next!==board){if(board)io.unobserve(board);board=next;if(board)io.observe(board)}const en=document.documentElement.lang.startsWith('en');for(const b of root.querySelectorAll('[data-motion-toggle]')){b.disabled=reduced.matches;b.setAttribute('aria-pressed',String(enabled&&!reduced.matches));const label=reduced.matches?(en?'Reduced motion (system)':'Зменшено рух (система)'):enabled?(en?'Animations on':'Анімації увімкнено'):(en?'Animations off':'Анімації вимкнено');if(b.textContent!==label)b.textContent=label}}
function apply(){root.dataset.motion=enabled&&!reduced.matches?'on':'off';scan()}
root.addEventListener('click',e=>{if(e.target.closest('[data-motion-toggle]')&&!reduced.matches){enabled=!enabled;profileStorage.setItem(key,enabled?'on':'off');apply()}});
new MutationObserver(scan).observe(root,{childList:true,subtree:true});reduced.addEventListener('change',apply);
document.addEventListener('visibilitychange',()=>{root.toggleAttribute('data-motion-hidden',document.hidden)});
const original=window.speak;let generation=0;window.speak=function(text,...args){const run=++generation;if(String(text).trim()&&currentMode==='learning')root.dataset.audioPlaying='true';else delete root.dataset.audioPlaying;return Promise.resolve(original.call(this,text,...args)).finally(()=>{if(run===generation)delete root.dataset.audioPlaying})};
apply();
})();
