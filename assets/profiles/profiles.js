/* Local learner profiles. Keep the session identity fixed until a full reload. */
(()=>{
 const registryKey='deutsch16_profiles_v1',activeKey='deutsch16_active_profile_v1',prefix='deutsch16_profile:';
 const id=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 let registry,storageError=false;
 try{
  registry=JSON.parse(localStorage.getItem(registryKey)||'null');
  if(!registry||registry.version!==1||!Array.isArray(registry.profiles)||!registry.profiles.length){
   const first={id:id(),name:'Мій профіль'};
   // Copy first, publish registry last: interrupted migration is safe to retry.
   for(const key of Object.keys(localStorage)){
    if(key?.startsWith('deutsch16_')&&key!==registryKey&&key!==activeKey&&!key.startsWith(prefix))localStorage.setItem(prefix+first.id+':'+key,localStorage.getItem(key));
   }
   registry={version:1,profiles:[first]};localStorage.setItem(registryKey,JSON.stringify(registry));
  }
 }catch(e){storageError=true;registry={version:1,profiles:[{id:'unavailable',name:'Мій профіль'}]}}
 let saved;try{saved=sessionStorage.getItem(activeKey)||localStorage.getItem(activeKey)}catch(e){}
 const sessionId=registry.profiles.some(p=>p.id===saved)?saved:registry.profiles[0].id;
 try{sessionStorage.setItem(activeKey,sessionId);localStorage.setItem(activeKey,sessionId)}catch(e){}
 const exists=()=>JSON.parse(localStorage.getItem(registryKey)||'{"profiles":[]}').profiles.some(p=>p.id===sessionId);
 window.profileStorage={getItem:key=>localStorage.getItem(prefix+sessionId+':'+key),setItem:(key,value)=>{if(!exists())return;localStorage.setItem(prefix+sessionId+':'+key,String(value))},removeItem:key=>localStorage.removeItem(prefix+sessionId+':'+key)};
 window.DEUTSCH_PROFILES={sessionId,registryKey,activeKey};
 const current=()=>registry.profiles.find(p=>p.id===sessionId);
 const error=message=>{document.getElementById('profileError').textContent=message};
 function persist(next){localStorage.setItem(registryKey,JSON.stringify(next));registry=next}
 function switchTo(nextId){
  if(!registry.profiles.some(p=>p.id===nextId))return;
  try{window.DEUTSCH_ADAPTIVE?.cancel();window.DEUTSCH_FLOW?.pause();sessionStorage.setItem(activeKey,nextId);localStorage.setItem(activeKey,nextId);location.reload()}catch(e){error('Не вдалося зберегти профіль. Перевір доступ до сховища браузера.')}
 }
 function removeProfile(p){
  if(registry.profiles.length<2){error('Залиш хоча б один профіль.');return}
  if(!confirm('Видалити профіль «'+p.name+'» та весь його прогрес? Цю дію не можна скасувати.'))return;
  try{
   const remaining=registry.profiles.filter(x=>x.id!==p.id);
   persist({...registry,profiles:remaining});
   for(const key of Object.keys(localStorage))if(key.startsWith(prefix+p.id+':'))localStorage.removeItem(key);
   if(p.id===sessionId){switchTo(remaining[0].id);return}
   if(localStorage.getItem(activeKey)===p.id)localStorage.setItem(activeKey,sessionId);
   render();error('Профіль видалено.');
  }catch(e){error('Не вдалося видалити профіль. Спробуй ще раз.')}
 }
 function render(){
  document.getElementById('profileName').textContent=current().name;
  document.getElementById('profileInitial').textContent=Array.from(current().name)[0].toUpperCase();
  document.getElementById('profileRenameInput').value=current().name;
  const list=document.getElementById('profileList');list.replaceChildren();
  for(const p of registry.profiles){
   const button=document.createElement('button');button.type='button';button.className='profile-choice'+(p.id===sessionId?' selected':'');button.setAttribute('aria-pressed',String(p.id===sessionId));
   const name=document.createElement('span');name.textContent=p.name;const status=document.createElement('small');status.textContent=p.id===sessionId?'Поточний профіль':'Перемкнутися';button.append(name,status);button.onclick=()=>switchTo(p.id);
   const row=document.createElement('div');row.className='profile-row';row.append(button);
   const remove=document.createElement('button');remove.type='button';remove.className='profile-delete';remove.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg>';remove.title='Видалити профіль «'+p.name+'»';remove.setAttribute('aria-label',remove.title);remove.disabled=registry.profiles.length<2;remove.onclick=()=>removeProfile(p);row.append(remove);list.append(row);
  }
 }
 function readName(input){const name=input.value.trim().replace(/\s+/g,' ');if(!name||Array.from(name).length>32){error('Введи ім’я від 1 до 32 символів.');input.focus();return null}if(registry.profiles.some(p=>p.name.toLocaleLowerCase('uk')===name.toLocaleLowerCase('uk')&&p.id!==(input.id==='profileRenameInput'?sessionId:null))){error('Профіль із таким ім’ям уже є. Вибери інше ім’я.');input.focus();return null}return name}
 document.addEventListener('DOMContentLoaded',()=>{
  render();const dialog=document.getElementById('profileDialog');
  document.getElementById('profileButton').onclick=()=>{error(storageError?'Профілі потребують доступу до сховища браузера.':'');render();dialog.showModal()};
  document.getElementById('profileClose').onclick=()=>dialog.close();
  document.getElementById('profileRenameForm').onsubmit=e=>{e.preventDefault();const name=readName(document.getElementById('profileRenameInput'));if(!name)return;try{persist({...registry,profiles:registry.profiles.map(p=>p.id===sessionId?{...p,name}:p)});render();error('Ім’я збережено.')}catch(e){error('Не вдалося зберегти ім’я.')}};
  document.getElementById('profileAddForm').onsubmit=e=>{e.preventDefault();const name=readName(document.getElementById('profileAddInput'));if(!name)return;try{const p={id:id(),name};persist({...registry,profiles:[...registry.profiles,p]});switchTo(p.id)}catch(e){error('Не вдалося створити профіль.')}};
 });
 // Each tab keeps its own learner. Registry changes refresh names or leave a deleted profile.
 window.addEventListener('storage',e=>{if(e.key!==registryKey)return;try{const next=JSON.parse(e.newValue);if(!next?.profiles?.some(p=>p.id===sessionId)){window.DEUTSCH_ADAPTIVE?.cancel();window.DEUTSCH_FLOW?.pause();sessionStorage.removeItem(activeKey);location.reload();return}registry=next;render()}catch{location.reload()}});
})();
