
const $=s=>document.querySelector(s),status=$("#status");
function render(){
 const S=window.SHUDDHO_SYNC&&SHUDDHO_SYNC.getState?SHUDDHO_SYNC.getState():null;
 if(!S){
   status.innerHTML='<h3>Local-only mode active</h3><p>Firebase is not configured yet, or the optional sync SDK is still loading. All V5/V5.1 local features continue to work.</p>';
   return;
 }
 if(!S.configured){status.innerHTML='<h3>Firebase setup required</h3><p>Add your Firebase Web App config to <code>firebase/firebase-config.js</code>. Until then the app stays local-only.</p>';return}
 if(S.user){
   status.innerHTML=`<h3 class="good">Signed in & sync enabled</h3><p><strong>${S.user.email||"Google account"}</strong></p><p>Last sync: ${S.lastSync?new Date(S.lastSync).toLocaleString():"Not synced yet"}</p>${S.error?`<p class="bad">${S.error}</p>`:""}`;
 }else status.innerHTML='<h3>Guest / local-only</h3><p>Sign in only if you want cross-device backup and auto sync.</p>';
}
function wait(){render();setTimeout(render,1200);setTimeout(render,3000)}
window.addEventListener("shuddho-auth-state",render);window.addEventListener("shuddho-sync-state",render);window.addEventListener("shuddho-sync-unconfigured",render);window.addEventListener("shuddho-data-synced",render);wait();
$("#google").onclick=async()=>{try{await SHUDDHO_SYNC.signInGoogle();await SHUDDHO_SYNC.syncAll()}catch(e){alert(e.message)}};
$("#login").onclick=async()=>{try{await SHUDDHO_SYNC.signInEmail($("#email").value,$("#password").value);await SHUDDHO_SYNC.syncAll()}catch(e){alert(e.message)}};
$("#create").onclick=async()=>{try{await SHUDDHO_SYNC.createEmail($("#email").value,$("#password").value);await SHUDDHO_SYNC.syncAll()}catch(e){alert(e.message)}};
$("#reset").onclick=async()=>{try{await SHUDDHO_SYNC.resetPassword($("#email").value);alert("Password reset email sent.")}catch(e){alert(e.message)}};
$("#sync").onclick=async()=>{try{await SHUDDHO_SYNC.syncAll();render()}catch(e){alert(e.message)}};
$("#signout").onclick=async()=>{try{await SHUDDHO_SYNC.signOut();render()}catch(e){alert(e.message)}};
