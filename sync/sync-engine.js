
window.SHUDDHO_SYNC = (function(){
  const META_KEY="shuddhoSyncMetaV52";
  const DEVICE_KEY="shuddhoDeviceIdV52";
  const INTERNAL=new Set([META_KEY,DEVICE_KEY,"shuddhoLastSyncV52"]);
  const state={ready:false,configured:false,user:null,lastSync:null,busy:false,error:null};
  let app=null,auth=null,db=null;

  function now(){return Date.now()}
  function uid(){return state.user&&state.user.uid}
  function safeParse(x,f){try{return JSON.parse(x)}catch(e){return f}}
  function meta(){return safeParse(localStorage.getItem(META_KEY)||"{}",{})}
  function setMeta(m){localStorage.setItem(META_KEY,JSON.stringify(m))}
  function deviceId(){
    let d=localStorage.getItem(DEVICE_KEY);
    if(!d){d="dev_"+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem(DEVICE_KEY,d)}
    return d;
  }
  function configured(){
    const c=window.SHUDDHO_FIREBASE_CONFIG||{};
    return !!(c.apiKey&&c.projectId&&!String(c.apiKey).includes("PASTE_")&&!String(c.projectId).includes("PASTE_"));
  }
  function hash(v){
    let h=2166136261,s=String(v??"");
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
    return (h>>>0).toString(16);
  }
  function localKeys(){
    const arr=[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k&&k.toLowerCase().startsWith("shuddho")&&!INTERNAL.has(k)) arr.push(k);
    }
    return arr.sort();
  }
  function updateLocalMeta(){
    const m=meta(),keys=localKeys(),seen=new Set(keys);
    keys.forEach(k=>{
      const raw=localStorage.getItem(k),h=hash(raw);
      if(!m[k]||m[k].hash!==h){
        m[k]={hash:h,updatedAt:now(),deleted:false};
      }
    });
    Object.keys(m).forEach(k=>{
      if(INTERNAL.has(k))return;
      if(!seen.has(k)&&m[k]&&!m[k].deleted){
        m[k]={hash:null,updatedAt:now(),deleted:true};
      }
    });
    setMeta(m);return m;
  }
  function docIdForKey(k){
    return btoa(unescape(encodeURIComponent(k))).replaceAll("/","_").replaceAll("+","-").replaceAll("=","");
  }
  function keyFromDoc(d){return d.key}
  function emit(name,detail={}){window.dispatchEvent(new CustomEvent(name,{detail}))}
  async function loadFirebase(){
    if(!configured()){state.configured=false;state.ready=true;emit("shuddho-sync-state",state);return false}
    state.configured=true;
    if(window.firebase&&firebase.auth&&firebase.firestore){
      if(!firebase.apps.length) app=firebase.initializeApp(window.SHUDDHO_FIREBASE_CONFIG); else app=firebase.app();
      auth=firebase.auth();db=firebase.firestore();
      try{await db.enablePersistence({synchronizeTabs:true})}catch(e){}
      auth.onAuthStateChanged(u=>{state.user=u||null;emit("shuddho-auth-state",state);if(u)syncAll().catch(()=>{})});
      state.ready=true;emit("shuddho-sync-state",state);return true;
    }
    state.error="Firebase SDK not loaded";state.ready=true;emit("shuddho-sync-state",state);return false;
  }
  async function signInGoogle(){
    if(!auth)throw new Error("Firebase is not configured.");
    const p=new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(p);
  }
  async function signInEmail(email,password){
    if(!auth)throw new Error("Firebase is not configured.");
    return auth.signInWithEmailAndPassword(email,password);
  }
  async function createEmail(email,password){
    if(!auth)throw new Error("Firebase is not configured.");
    return auth.createUserWithEmailAndPassword(email,password);
  }
  async function signOut(){if(auth)await auth.signOut()}
  async function resetPassword(email){
    if(!auth)throw new Error("Firebase is not configured.");
    return auth.sendPasswordResetEmail(email);
  }
  async function syncAll(){
    if(!db||!uid()||state.busy)return false;
    state.busy=true;state.error=null;emit("shuddho-sync-state",state);
    try{
      const m=updateLocalMeta();
      const ref=db.collection("users").doc(uid()).collection("localData");
      const snap=await ref.get();
      const cloud={};snap.forEach(doc=>{const d=doc.data();if(d&&d.key)cloud[d.key]=d});
      const keys=new Set([...Object.keys(m),...Object.keys(cloud)]);
      const batch=db.batch();
      let writes=0,localChanges=0;
      for(const k of keys){
        if(INTERNAL.has(k))continue;
        const lm=m[k]||{updatedAt:0,deleted:true},cd=cloud[k]||null;
        const ct=cd&&Number(cd.updatedAt||0)||0,lt=Number(lm.updatedAt||0);
        if(cd&&ct>lt){
          if(cd.deleted){localStorage.removeItem(k);m[k]={hash:null,updatedAt:ct,deleted:true}}
          else{
            localStorage.setItem(k,cd.value);
            m[k]={hash:hash(cd.value),updatedAt:ct,deleted:false};
          }
          localChanges++;
        }else if(lt>ct){
          const value=lm.deleted?null:localStorage.getItem(k);
          batch.set(ref.doc(docIdForKey(k)),{
            key:k,value:value,deleted:!!lm.deleted,updatedAt:lt,deviceId:deviceId(),schemaVersion:"5.2"
          });
          writes++;
        }
      }
      if(writes)await batch.commit();
      setMeta(m);
      state.lastSync=new Date().toISOString();
      localStorage.setItem("shuddhoLastSyncV52",state.lastSync);
      emit("shuddho-data-synced",{writes,localChanges,lastSync:state.lastSync});
      emit("shuddho-sync-state",state);
      return true;
    }catch(e){
      state.error=e&&e.message?e.message:String(e);emit("shuddho-sync-state",state);throw e;
    }finally{state.busy=false;emit("shuddho-sync-state",state)}
  }
  async function deleteCloudData(){
    if(!db||!uid())throw new Error("Sign in first.");
    const ref=db.collection("users").doc(uid()).collection("localData");
    const snap=await ref.get();
    let batch=db.batch(),n=0,total=0;
    for(const doc of snap.docs){
      batch.delete(doc.ref);n++;total++;
      if(n===400){await batch.commit();batch=db.batch();n=0}
    }
    if(n)await batch.commit();
    return total;
  }
  async function deleteAccountAndCloud(){
    if(!state.user)throw new Error("Sign in first.");
    await deleteCloudData();
    await db.collection("users").doc(uid()).delete().catch(()=>{});
    await state.user.delete();
  }
  function getState(){return {...state,lastSync:localStorage.getItem("shuddhoLastSyncV52")||state.lastSync}}
  let timer=null;
  function startAutoSync(){
    if(timer)return;
    timer=setInterval(()=>{if(state.user&&!document.hidden)syncAll().catch(()=>{})},30000);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden&&state.user)syncAll().catch(()=>{})});
    window.addEventListener("online",()=>{if(state.user)syncAll().catch(()=>{})});
    window.addEventListener("beforeunload",()=>{updateLocalMeta()});
  }
  loadFirebase().then(startAutoSync);
  return {getState,configured,signInGoogle,signInEmail,createEmail,signOut,resetPassword,syncAll,deleteCloudData,deleteAccountAndCloud,updateLocalMeta,deviceId};
})();
