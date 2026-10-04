
(function(){
  const src=(document.currentScript&&document.currentScript.src)||"";
  const root=src.split("/sync/bootstrap.js")[0]+"/";
  function load(url){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=url;s.defer=true;s.onload=resolve;s.onerror=()=>reject(new Error("Could not load "+url));document.head.appendChild(s)})}
  async function boot(){
    try{
      await load(root+"firebase/firebase-config.js?v=5.2");
      const c=window.SHUDDHO_FIREBASE_CONFIG||{};
      const configured=c.apiKey&&!String(c.apiKey).includes("PASTE_")&&c.projectId&&!String(c.projectId).includes("PASTE_");
      if(!configured){
        window.dispatchEvent(new CustomEvent("shuddho-sync-unconfigured"));
        return;
      }
      await load("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
      await load("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");
      await load("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js");
      await load(root+"sync/sync-engine.js?v=5.2");
    }catch(e){
      console.warn("SHUDDHO optional sync unavailable; local-only mode continues.",e);
      window.dispatchEvent(new CustomEvent("shuddho-sync-error",{detail:{message:e.message}}));
    }
  }
  boot();
})();
