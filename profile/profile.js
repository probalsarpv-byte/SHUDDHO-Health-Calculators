
const f=document.getElementById("profileForm"), saved=document.getElementById("saved"), recs=document.getElementById("recs");
let p=SHUDDHO_LOCAL.migrateProfile()||{};
for(const [k,v] of Object.entries(p)) if(f.elements[k]) f.elements[k].value=v;
function showRecs(){
  p=SHUDDHO_LOCAL.get(SHUDDHO_LOCAL.KEYS.profile,{})||{};
  const arr=SHUDDHO_PERSONALIZE.recommendations(p);
  recs.innerHTML=arr.map(x=>`<a class="card tool-card" href="../${x[1]}"><h3>${x[0]}</h3><p>${x[2]}</p></a>`).join("");
}
f.onsubmit=e=>{
  e.preventDefault();
  const o=Object.fromEntries(new FormData(f));
  ["age","height_cm","weight_kg","activity_days","sleep_hours"].forEach(k=>{if(o[k]!=="")o[k]=Number(o[k])});
  SHUDDHO_LOCAL.set(SHUDDHO_LOCAL.KEYS.profile,o);
  localStorage.setItem("shuddhoCalcLang",o.language||"bn");
  saved.innerHTML='<div class="result"><h3>Profile saved locally</h3><p>No account or cloud upload was used.</p><a href="../dashboard/">Open personalized dashboard →</a></div>';
  showRecs();
};
showRecs();
