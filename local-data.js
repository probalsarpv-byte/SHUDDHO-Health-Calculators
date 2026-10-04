
window.SHUDDHO_LOCAL=(function(){
  const PREFIX="shuddho";
  const KEYS={
    profile:"shuddhoProfileV51",
    profiles:"shuddhoFamilyProfilesV51",
    assessments:"shuddhoAssessmentsV5",
    trackers:"shuddhoTrackerV5",
    challenges:"shuddhoChallengesV5",
    reminders:"shuddhoRemindersV5",
    prefs:"shuddhoPreferencesV51"
  };
  function safeParse(v,fallback){try{return JSON.parse(v)}catch(e){return fallback}}
  function get(k,fallback=null){try{const v=localStorage.getItem(k);return v===null?fallback:safeParse(v,v)}catch(e){return fallback}}
  function set(k,v){try{localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v));return true}catch(e){return false}}
  function remove(k){try{localStorage.removeItem(k);return true}catch(e){return false}}
  function all(){
    const out={};
    const skip=new Set(["shuddhoSyncMetaV52","shuddhoDeviceIdV52","shuddhoLastSyncV52"]);
    try{
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k && k.toLowerCase().startsWith(PREFIX) && !skip.has(k)) out[k]=safeParse(localStorage.getItem(k),localStorage.getItem(k));
      }
    }catch(e){}
    return out;
  }
  function exportData(){
    return {
      format:"SHUDDHO_LOCAL_BACKUP",
      version:"5.1",
      exported_at:new Date().toISOString(),
      data:all()
    };
  }
  function importData(obj){
    if(!obj||obj.format!=="SHUDDHO_LOCAL_BACKUP"||!obj.data) throw new Error("Invalid SHUDDHO backup file");
    Object.entries(obj.data).forEach(([k,v])=>set(k,v));
    return true;
  }
  function clearAll(){
    try{
      const preserve=new Set(["shuddhoSyncMetaV52","shuddhoDeviceIdV52","shuddhoLastSyncV52"]);
      const ks=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k && k.toLowerCase().startsWith(PREFIX) && !preserve.has(k)) ks.push(k);
      }
      ks.forEach(k=>localStorage.removeItem(k));
      if(window.SHUDDHO_SYNC&&SHUDDHO_SYNC.updateLocalMeta) SHUDDHO_SYNC.updateLocalMeta();
      return ks.length;
    }catch(e){return 0}
  }
  function migrateProfile(){
    const current=get(KEYS.profile,null);
    if(current) return current;
    const old=get("shuddhoProfileV5",null);
    if(old && typeof old==="object"){set(KEYS.profile,old);return old}
    return null;
  }
  return {KEYS,get,set,remove,all,exportData,importData,clearAll,migrateProfile};
})();
