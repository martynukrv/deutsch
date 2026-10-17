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
 let saved;try{saved=localStorage.getItem(activeKey)}catch(e){}
 const sessionId=registry.profiles.some(p=>p.id===saved)?saved:registry.profiles[0].id;
 try{localStorage.setItem(activeKey,sessionId)}catch(e){}
 window.profileStorage={getItem:key=>localStorage.getItem(prefix+sessionId+':'+key),setItem:(key,value)=>localStorage.setItem(prefix+sessionId+':'+key,String(value)),removeItem:key=>localStorage.removeItem(prefix+sessionId+':'+key)};
 window.DEUTSCH_PROFILES={sessionId,registryKey,activeKey};
 const current=()=>registry.profiles.find(p=>p.id===sessionId);
 const error=message=>{document.getElementById('profileError').textContent=message};
 function persist(next){localStorage.setItem(registryKey,JSON.stringify(next));registry=next}
 function switchTo(nextId){
  if(!registry.profiles.some(p=>p.id===nextId))return;
  try{localStorage.setItem(activeKey,nextId);location.reload()}catch(e){error('Не вдалося зберегти профіль. Перевір доступ до сховища браузера.')}
 }
 function render(){
  document.getElementById('profileName').textContent=current().name;
  document.getElementById('profileInitial').textContent=Array.from(current().name)[0].toUpperCase();
  document.getElementById('profileRenameInput').value=current().name;
  const list=document.getElementById('profileList');list.replaceChildren();
  for(const p of registry.profiles){
   const button=document.createElement('button');button.type='button';button.className='profile-choice'+(p.id===sessionId?' selected':'');button.setAttribute('aria-pressed',String(p.id===sessionId));
   const name=document.createElement('span');name.textContent=p.name;const status=document.createElement('small');status.textContent=p.id===sessionId?'Поточний профіль':'Перемкнутися';button.append(name,status);button.onclick=()=>switchTo(p.id);list.append(button);
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
 // Another tab can switch profiles. Never let an old exercise write into the new one.
 window.addEventListener('storage',e=>{if(e.key===activeKey||e.key===registryKey)location.reload()});
})();
