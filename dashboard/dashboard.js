
const $=s=>document.querySelector(s);
let A={},T={},P={};
try{
  A=JSON.parse(localStorage.getItem("shuddhoAssessmentsV5")||"{}");
  T=JSON.parse(localStorage.getItem("shuddhoTrackerV5")||"{}");
  P=SHUDDHO_LOCAL.migrateProfile()||{};
}catch(e){}
const av=Object.values(A),avg=av.length?Math.round(av.reduce((s,x)=>s+(x.score||0),0)/av.length):null,metrics=Object.keys(T).filter(k=>T[k]?.length);
$("#summary").innerHTML=`
<div class="card"><h3>${P.display_name?`Welcome, ${P.display_name}`:"Your local profile"}</h3><div class="score">${P.age||"—"}</div><p>${P.goal?`Goal: ${P.goal}`:"Set your goal to personalize the platform."}</p><a href="../profile/">Edit local profile →</a></div>
<div class="card"><h3>Assessment profile</h3><div class="score ${avg===null?'':avg>=75?'good':avg>=50?'warn':'bad'}">${avg===null?'—':avg}</div><p>${av.length} assessment(s) saved locally</p></div>
<div class="card"><h3>Tracked metrics</h3><div class="score">${metrics.length}</div><p>${metrics.join(", ")||"No tracker data yet"}</p></div>`;
$("#assess").innerHTML=av.length?av.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map(x=>`<div class="choice"><strong>${x.name}</strong><br>Score: ${x.score}/100 · ${x.status}</div>`).join(""):"<p class='muted'>No assessment results yet.</p>";
$("#track").innerHTML=metrics.length?metrics.map(k=>{const d=T[k].slice().sort((a,b)=>a.date.localeCompare(b.date)),x=d.at(-1);return `<div class="choice"><strong>${k}</strong><br>Latest: ${x.value} · ${x.date}</div>`}).join(""):"<p class='muted'>No tracker data yet.</p>";

const recs=SHUDDHO_PERSONALIZE.recommendations(P);
const target=document.querySelector("main .card:last-of-type .grid");
if(target) target.innerHTML=recs.map(x=>`<a class="card tool-card" href="../${x[1]}"><h3>${x[0]}</h3><p>${x[2]}</p></a>`).join("");
