
const status=document.getElementById("status"),cloud=document.getElementById("cloud"),msg=document.getElementById("msg");
function refreshLocal(){
 const d=SHUDDHO_LOCAL.all(), keys=Object.keys(d);
 let chars=0;Object.entries(d).forEach(([k,v])=>chars+=k.length+JSON.stringify(v).length);
 status.innerHTML=`<div class="score">${keys.length}</div><p>SHUDDHO local entries</p><p>Approximate stored text: ${(chars/1024).toFixed(1)} KB</p><div class="chips">${keys.map(k=>`<span class="chip">${k}</span>`).join("")}</div>`;
}
function refreshCloud(){
 if(!window.SHUDDHO_SYNC){cloud.innerHTML='<h3>Local-only mode</h3><p>Firebase is not configured or is still loading.</p>';return}
 const s=SHUDDHO_SYNC.getState();
 if(!s.configured) cloud.innerHTML='<h3>Local-only mode</h3><p>Firebase has not been configured.</p>';
 else if(!s.user) cloud.innerHTML='<h3>Not signed in</h3><p>No cloud sync is active.</p>';
 else cloud.innerHTML=`<h3 class="good">Signed in</h3><p>${s.user.email||"Authenticated user"}</p><p>Last sync: ${s.lastSync?new Date(s.lastSync).toLocaleString():"Not yet synced"}</p>`;
}
document.getElementById("export").onclick=()=>{
 const obj=SHUDDHO_LOCAL.exportData(), blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),a=document.createElement("a");
 a.href=URL.createObjectURL(blob);a.download=`shuddho-local-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
document.getElementById("import").onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{SHUDDHO_LOCAL.importData(JSON.parse(await file.text()));if(window.SHUDDHO_SYNC)SHUDDHO_SYNC.updateLocalMeta();msg.innerHTML='<div class="result"><h3>Backup restored locally</h3><p>Use Sync now if you also want to update the signed-in cloud copy.</p></div>';refreshLocal()}catch(err){msg.textContent=err.message}
};
document.getElementById("clearLocal").onclick=async()=>{
 if(confirm("Delete SHUDDHO health data from this browser?")){
   const n=SHUDDHO_LOCAL.clearAll();
   if(window.SHUDDHO_SYNC&&SHUDDHO_SYNC.getState().user){try{await SHUDDHO_SYNC.syncAll()}catch(e){}}
   msg.innerHTML=`<div class="result"><h3>Deleted ${n} local entries</h3></div>`;refreshLocal();refreshCloud();
 }
};
document.getElementById("clearCloud").onclick=async()=>{
 if(!window.SHUDDHO_SYNC||!SHUDDHO_SYNC.getState().user){alert("Sign in first.");return}
 if(confirm("Delete the synced SHUDDHO health data from the cloud?")){
   try{const n=await SHUDDHO_SYNC.deleteCloudData();msg.innerHTML=`<div class="result"><h3>Deleted ${n} cloud documents</h3><p>Your local browser data remains.</p></div>`}catch(e){alert(e.message)}
 }
};
document.getElementById("deleteAccount").onclick=async()=>{
 if(!window.SHUDDHO_SYNC||!SHUDDHO_SYNC.getState().user){alert("Sign in first.");return}
 if(confirm("Permanently delete the Firebase account and synced SHUDDHO cloud data?")){
   try{await SHUDDHO_SYNC.deleteAccountAndCloud();msg.innerHTML='<div class="result"><h3>Account deletion completed</h3></div>';refreshCloud()}catch(e){alert(e.message+" You may need to sign in again before deleting the account.")}
 }
};
window.addEventListener("shuddho-auth-state",refreshCloud);window.addEventListener("shuddho-sync-state",refreshCloud);window.addEventListener("shuddho-sync-unconfigured",refreshCloud);
refreshLocal();refreshCloud();setTimeout(refreshCloud,1500);
