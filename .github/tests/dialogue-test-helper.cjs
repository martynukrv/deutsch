function install(){
 const permission={state:'granted'};window.dialoguePermission=permission;
 Object.defineProperty(navigator,'permissions',{configurable:true,value:{query:async()=>permission}});
 let current=null;window.dialogueRecognitionStarts=0;window.dialogueRecognitionAborts=0;
 class Recognition{start(){current=this;window.dialogueRecognitionStarts++;queueMicrotask(()=>this.onstart?.())}abort(){window.dialogueRecognitionAborts++;if(current===this)current=null}stop(){this.onend?.()}}
 window.SpeechRecognition=Recognition;
 window.dialogueEmit=(text,{interim=false,alternatives=[]}={})=>{if(!current?.onresult)return;const result=[{transcript:text,confidence:.9},...alternatives.map(transcript=>({transcript,confidence:.5}))];result.isFinal=!interim;const callback=current.onresult;callback({results:[result]});};
 window.dialogueError=error=>current?.onerror?.({error});
}
async function say(p,id,text){
 const phase=await p.locator('#'+id+'Voice').getAttribute('data-phase');if(['retry','review','paused','silent','recognition'].includes(phase))await p.click('#'+id+'Mic');
 await p.waitForFunction(id=>document.querySelector('#'+id+'Voice')?.dataset.phase==='listening',id);
 await p.evaluate(text=>dialogueEmit(text),text);
 if(await p.locator('#'+id+'Confirm').isVisible())await p.click('#'+id+'Confirm');
}
module.exports={install,say};
