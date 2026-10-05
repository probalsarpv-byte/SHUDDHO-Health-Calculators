
const $=s=>document.querySelector(s);
let mode="quick", lastResult=null;

document.querySelectorAll(".modebtn").forEach(b=>b.onclick=()=>{
  mode=b.dataset.mode;
  document.body.classList.toggle("advanced",mode==="advanced");
  document.querySelectorAll(".modebtn").forEach(x=>x.classList.toggle("active",x===b));
});

function num(fd,k){const v=fd.get(k);return v===""||v===null?null:Number(v)}
function clamp(x,a=0,b=100){return Math.max(a,Math.min(b,x))}
function band(s){return s>=80?["Favorable","good"]:s>=65?["Generally good","good"]:s>=50?["Moderate / mixed","warn"]:s>=35?["Needs attention","warn"]:["High concern","bad"]}
function avg(arr){const x=arr.filter(v=>Number.isFinite(v));return x.length?x.reduce((a,b)=>a+b,0)/x.length:null}

function calcProfile(fd){
  const v={};
  ["age","height","weight","waist","weightchange","sbp","dbp","activity","sleep","fruitveg","fiber","proteinmeals","stress","bowel","strength","glucose","hba1c","tg","hdl","egfr","uacr","alt","ast","platelets"].forEach(k=>v[k]=num(fd,k));
  v.smoking=Number(fd.get("smoking")||0);v.diabetes=Number(fd.get("diabetes")||0);v.sex=fd.get("sex")||"";
  const red=[...document.querySelectorAll('input[name="redflag"]:checked')].map(x=>x.value);
  if(red.length) return {urgent:true,red};

  const domains={}, strengths=[], flags=[], missing=[];
  const add=(arr,score)=>{if(Number.isFinite(score))arr.push(clamp(score))};

  // Body composition
  let body=[];
  if(v.height&&v.weight){
    const bmi=v.weight/((v.height/100)**2);v.bmi=bmi;
    let s=100;
    if(bmi<18.5)s-=20+Math.min(20,(18.5-bmi)*3);
    else if(bmi>=25&&bmi<30)s-=15;
    else if(bmi>=30&&bmi<35)s-=30;
    else if(bmi>=35)s-=45;
    add(body,s);
    if(bmi>=18.5&&bmi<25) strengths.push("BMI in common healthy range");
    if(bmi>=25) flags.push(["Body composition","Higher BMI","Review waist, activity and nutrition context."]);
  } else missing.push("BMI inputs");
  if(v.waist&&v.height){
    const whtr=v.waist/v.height;v.whtr=whtr;
    let s=whtr<0.5?95:whtr<0.6?65:35;add(body,s);
    if(whtr<0.5)strengths.push("Waist-to-height ratio below 0.5");
    else flags.push(["Body composition","Higher waist-to-height ratio","Central adiposity is a useful cardiometabolic context marker."]);
  } else missing.push("Waist-to-height ratio");
  if(v.weightchange!==null){
    if(v.weightchange<=-5) add(body,45),flags.push(["Body composition","Unintentional weight loss","A ≥5% unintentional loss deserves clinical/nutrition review."]);
    else add(body,85);
  }
  domains.body={name:"Body composition",score:avg(body),coverage:body.length};

  // Metabolic
  let meta=[];
  if(v.glucose!==null){add(meta,v.glucose<100?90:v.glucose<126?55:30);if(v.glucose>=100)flags.push(["Metabolic","Higher fasting glucose","Confirm context with appropriate clinical testing."]);else strengths.push("Fasting glucose in common reference range")}
  else if(mode==="advanced")missing.push("Fasting glucose");
  if(v.hba1c!==null){add(meta,v.hba1c<5.7?92:v.hba1c<6.5?58:30);if(v.hba1c>=5.7)flags.push(["Metabolic","Higher HbA1c","Review glycemic status with a clinician if this is a laboratory result."])}
  else if(mode==="advanced")missing.push("HbA1c");
  if(v.tg!==null&&v.hdl!==null&&v.hdl>0){const ratio=v.tg/v.hdl;v.tghdl=ratio;add(meta,ratio<2?90:ratio<3.5?68:ratio<5?50:35);if(ratio>=3.5)flags.push(["Metabolic","Higher TG/HDL context","Interpret with fasting status and full lipid profile."])}
  else if(mode==="advanced")missing.push("Triglycerides + HDL");
  if(v.diabetes) add(meta,45),flags.push(["Metabolic","Known diabetes","Overall health priorities should include glucose, BP, kidney and cardiovascular follow-up."]);
  if(v.whtr!==undefined)add(meta,v.whtr<0.5?90:v.whtr<0.6?60:35);
  domains.metabolic={name:"Metabolic",score:avg(meta),coverage:meta.length};

  // Heart
  let heart=[];
  if(v.sbp!==null){
    let s=v.sbp<120?95:v.sbp<130?82:v.sbp<140?62:v.sbp<180?38:15;add(heart,s);
    if(v.sbp<130)strengths.push("Systolic BP not elevated by common screening thresholds");
    if(v.sbp>=130)flags.push(["Heart","Higher blood pressure","Repeat standardized BP readings and review cardiovascular context."]);
  } else missing.push("Blood pressure");
  if(v.smoking){add(heart,25);flags.push(["Heart","Current smoking","Stopping smoking is one of the highest-impact cardiovascular actions."])} else {add(heart,90);strengths.push("Non-smoking")}
  if(v.activity!==null)add(heart,v.activity>=5?95:v.activity>=3?80:v.activity>=1?55:35);
  domains.heart={name:"Heart & circulation",score:avg(heart),coverage:heart.length};

  // Kidney
  let kidney=[];
  if(v.egfr!==null){add(kidney,v.egfr>=90?92:v.egfr>=60?78:v.egfr>=45?55:v.egfr>=30?38:20);if(v.egfr<60)flags.push(["Kidney","Lower eGFR","Persistent eGFR <60 needs clinical kidney context."])}
  else if(mode==="advanced")missing.push("eGFR");
  if(v.uacr!==null){add(kidney,v.uacr<30?92:v.uacr<300?52:25);if(v.uacr>=30)flags.push(["Kidney","Higher UACR","Persistent albuminuria requires kidney and cardiovascular review."])}
  else if(mode==="advanced")missing.push("UACR");
  if(v.diabetes||v.sbp>=130)add(kidney,65);
  domains.kidney={name:"Kidney",score:avg(kidney),coverage:kidney.length};

  // Liver
  let liver=[];
  if(v.alt!==null){add(liver,v.alt<=55?88:v.alt<=100?58:35);if(v.alt>55)flags.push(["Liver","ALT above common reference context","Interpret with the laboratory range, symptoms, medicines and metabolic context."])}
  else if(mode==="advanced")missing.push("ALT");
  if(v.ast!==null){add(liver,v.ast<=48?88:v.ast<=100?58:35)}
  else if(mode==="advanced")missing.push("AST");
  if(v.ast&&v.alt&&v.platelets&&v.age){
    const fib4=(v.age*v.ast)/(v.platelets*Math.sqrt(v.alt));v.fib4=fib4;add(liver,fib4<1.3?90:fib4<2.67?58:30);
    if(fib4>=1.3)flags.push(["Liver","FIB-4 needs context","Age-specific thresholds and clinical setting matter; use the dedicated FIB-4 tool."]);
  } else if(mode==="advanced")missing.push("FIB-4 inputs");
  domains.liver={name:"Liver",score:avg(liver),coverage:liver.length};

  // Nutrition
  let nutrition=[];
  if(v.fruitveg!==null){add(nutrition,v.fruitveg>=5?95:v.fruitveg>=3?75:v.fruitveg>=1?52:35);if(v.fruitveg>=5)strengths.push("Good fruit/vegetable frequency");else flags.push(["Nutrition","Low produce intake","Increase fruit and vegetable variety progressively."])}
  else missing.push("Fruit/vegetable intake");
  if(v.fiber!==null){add(nutrition,v.fiber>=25?92:v.fiber>=18?72:v.fiber>=10?50:32);if(v.fiber<18)flags.push(["Nutrition","Low estimated fiber","Use the fiber calculator and food database to identify practical sources."])}
  else missing.push("Fiber intake");
  if(v.proteinmeals!==null){add(nutrition,v.proteinmeals>=3?90:v.proteinmeals>=2?75:v.proteinmeals>=1?52:30);if(v.proteinmeals>=2)strengths.push("Protein included in multiple meals")}
  else missing.push("Protein meal pattern");
  domains.nutrition={name:"Nutrition",score:avg(nutrition),coverage:nutrition.length};

  // Sleep/recovery
  let sleep=[];
  if(v.sleep!==null){add(sleep,(v.sleep>=7&&v.sleep<=9)?95:(v.sleep>=6&&v.sleep<10)?65:35);if(v.sleep>=7&&v.sleep<=9)strengths.push("Sleep duration in common adult target range");else flags.push(["Sleep","Sleep duration needs attention","Aim for a consistent sleep schedule and investigate persistent sleep problems."])}
  if(v.stress!==null){add(sleep,v.stress<=3?92:v.stress<=6?70:v.stress<=8?48:30);if(v.stress>6)flags.push(["Sleep","Higher stress burden","Stress and recovery can affect appetite, sleep and metabolic health."])}
  domains.sleep={name:"Sleep & recovery",score:avg(sleep),coverage:sleep.length};

  // Muscle/function
  let muscle=[];
  if(v.strength!==null){add(muscle,v.strength>=2?92:v.strength===1?65:40);if(v.strength>=2)strengths.push("Regular strength activity");else flags.push(["Muscle","Low strength training","Progressive resistance activity supports muscle and healthy ageing."])}
  if(v.age!==null&&v.age>=65&&v.proteinmeals!==null)add(muscle,v.proteinmeals>=3?85:v.proteinmeals>=2?65:40);
  if(v.weightchange!==null&&v.weightchange<=-5)add(muscle,40);
  domains.muscle={name:"Muscle & function",score:avg(muscle),coverage:muscle.length};

  // Gut/lifestyle
  let lifestyle=[];
  if(v.activity!==null){add(lifestyle,v.activity>=5?95:v.activity>=3?82:v.activity>=1?58:35);if(v.activity>=3)strengths.push("Regular physical activity");else flags.push(["Lifestyle","Low activity","Build toward regular weekly movement based on ability."])}
  if(v.bowel!==null){add(lifestyle,v.bowel>=7?90:v.bowel>=5?70:v.bowel>=3?50:35);if(v.bowel<5)flags.push(["Gut/lifestyle","Lower bowel comfort","Review fiber, hydration, food pattern and persistent symptoms."])}
  if(v.smoking)add(lifestyle,25); else add(lifestyle,90);
  domains.lifestyle={name:"Lifestyle & gut",score:avg(lifestyle),coverage:lifestyle.length};

  const domainList=Object.entries(domains).filter(([k,d])=>Number.isFinite(d.score));
  const overall=avg(domainList.map(([k,d])=>d.score));
  const totalCoverage=domainList.reduce((s,[k,d])=>s+d.coverage,0);
  const maxCoverage=mode==="advanced"?22:13;
  const coveragePct=Math.round(Math.min(100,totalCoverage/maxCoverage*100));
  const confidence=coveragePct>=75?"High":coveragePct>=45?"Moderate":"Low";

  flags.sort((a,b)=>{
    const map={body:domains.body.score,Metabolic:domains.metabolic.score,Heart:domains.heart.score,Kidney:domains.kidney.score,Liver:domains.liver.score,Nutrition:domains.nutrition.score,Sleep:domains.sleep.score,Muscle:domains.muscle.score,"Gut/lifestyle":domains.lifestyle.score};
    return (map[a[0]]??60)-(map[b[0]]??60);
  });

  return {urgent:false,mode,v,domains,overall,coveragePct,confidence,strengths:[...new Set(strengths)].slice(0,8),flags:flags.slice(0,8),missing:[...new Set(missing)].slice(0,10),createdAt:new Date().toISOString()};
}

function renderRadar(domains){
  const order=["body","metabolic","heart","kidney","liver","nutrition","sleep","muscle","lifestyle"];
  const names=["Body","Meta","Heart","Kidney","Liver","Nutrition","Sleep","Muscle","Life"];
  const cx=160,cy=160,R=112,n=order.length;
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]};
  const grid=[.25,.5,.75,1].map(fr=>`<polygon points="${order.map((_,i)=>pt(i,R*fr).join(",")).join(" ")}" fill="none" stroke="currentColor" opacity="${fr===1?.23:.1}"/>`).join("");
  const axes=order.map((_,i)=>{const p=pt(i,R);return `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="currentColor" opacity=".12"/>`}).join("");
  const poly=order.map((k,i)=>{const s=domains[k]?.score;return pt(i,R*((Number.isFinite(s)?s:0)/100)).join(",")}).join(" ");
  const labels=order.map((k,i)=>{const p=pt(i,R+22);return `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="currentColor" opacity=".75">${names[i]}</text>`}).join("");
  return `<svg viewBox="0 0 320 320" role="img" aria-label="Health domain radar chart">${grid}${axes}<polygon points="${poly}" fill="rgba(67,225,173,.22)" stroke="#43e1ad" stroke-width="3"/>${labels}</svg>`;
}

function toolRecommendations(r){
  const rec=[];
  const ds=r.domains;
  const add=(title,url,desc)=>rec.push([title,url,desc]);
  if(ds.metabolic.score!==null&&ds.metabolic.score<70)add("Metabolic Assessment","../assessments/","Review glucose, waist and metabolic lifestyle factors.");
  if(ds.heart.score!==null&&ds.heart.score<70)add("Heart & Circulation Calculators","../calculator/map/","Explore BP/MAP and lipid-related tools.");
  if(ds.kidney.score!==null&&ds.kidney.score<70)add("eGFR Calculator","../calculator/egfr-2021/","Review kidney filtration context.");
  if(ds.nutrition.score!==null&&ds.nutrition.score<70)add("Food & Nutrient Tools","../food-tools/","Use food composition data to improve fiber/protein choices.");
  if(ds.sleep.score!==null&&ds.sleep.score<70)add("Sleep Assessment","../assessments/","Review sleep and recovery patterns.");
  if(ds.muscle.score!==null&&ds.muscle.score<70)add("Protein / Muscle Tools","../calculator/protein/","Check protein target and muscle-health context.");
  if(!rec.length)add("Health Trackers","../trackers/","Track trends to maintain favorable areas.");
  add("Lab Interpreter","../labs/","Use when new laboratory values are available.");
  return rec.slice(0,6);
}

function render(r){
  $("#urgent").hidden=true;$("#results").hidden=false;
  const [status,cls]=band(r.overall);
  $("#overallScore").textContent=Math.round(r.overall);
  $("#overallScore").className=`bigscore ${cls}`;
  $("#overallStatus").textContent=status;
  $("#confidence").textContent=`Confidence: ${r.confidence} · Data coverage ${r.coveragePct}%`;
  $("#radar").innerHTML=renderRadar(r.domains);

  const order=["body","metabolic","heart","kidney","liver","nutrition","sleep","muscle","lifestyle"];
  $("#domains").innerHTML=order.map(k=>{
    const d=r.domains[k],s=d.score;
    if(!Number.isFinite(s))return `<div class="domain"><div class="domain-top"><b>${d.name}</b><span>Not enough data</span></div><div class="bar"><span style="width:0%"></span></div></div>`;
    const [b]=band(s);
    return `<div class="domain"><div class="domain-top"><b>${d.name}</b><span>${Math.round(s)}/100</span></div><div class="bar"><span style="width:${Math.round(s)}%"></span></div><small class="muted">${b}</small></div>`;
  }).join("");

  const flags=r.flags.slice(0,3);
  $("#priorities").innerHTML=flags.length?flags.map((x,i)=>`<div class="priority"><span class="chip">Priority ${i+1}</span><h3>${x[1]}</h3><p>${x[2]}</p><small class="muted">${x[0]}</small></div>`).join(""):`<div class="priority"><h3>No major priority flag from entered data</h3><p>Maintain healthy habits and keep tracking trends.</p></div>`;
  $("#strengths").innerHTML=r.strengths.length?r.strengths.map(x=>`<span class="tag">${x}</span>`).join(""):`<span class="tag">More data needed</span>`;
  $("#missing").innerHTML=r.missing.length?r.missing.map(x=>`<span class="tag">${x}</span>`).join(""):`<span class="tag">No major missing item for this mode</span>`;

  const actionList=[];
  flags.forEach(x=>actionList.push(x[2]));
  if(r.coveragePct<60)actionList.push("Add missing measurements/labs before relying heavily on the overall profile.");
  if(!actionList.length)actionList.push("Maintain current favorable habits and reassess periodically.");
  $("#actions").innerHTML=`<ol>${[...new Set(actionList)].slice(0,6).map(x=>`<li>${x}</li>`).join("")}</ol>`;

  $("#tools").innerHTML=toolRecommendations(r).map(x=>`<a class="card tool-card" href="${x[1]}"><h3>${x[0]}</h3><p>${x[2]}</p></a>`).join("");
  $("#results").scrollIntoView({behavior:"smooth",block:"start"});
}

$("#healthForm").onsubmit=e=>{
  e.preventDefault();
  const r=calcProfile(new FormData(e.target));
  if(r.urgent){
    $("#results").hidden=true;$("#urgent").hidden=false;
    $("#urgent").innerHTML=`<div class="warnbox"><h2>Urgent evaluation may be appropriate</h2><p>You selected a potentially serious current symptom. This tool should not calculate an overall score first. Seek urgent medical evaluation/emergency services appropriate to your location, especially if symptoms are severe, new, or worsening.</p><p class="muted">Selected red-flag categories: ${r.red.join(", ")}</p></div>`;
    $("#urgent").scrollIntoView({behavior:"smooth"});
    return;
  }
  lastResult=r;render(r);
};

$("#loadLocal").onclick=()=>{
  let p={},t={};try{p=SHUDDHO_LOCAL.migrateProfile()||{};t=JSON.parse(localStorage.getItem("shuddhoTrackerV5")||"{}")}catch(e){}
  const f=$("#healthForm");
  const set=(n,v)=>{if(v!==undefined&&v!==null&&f.elements[n])f.elements[n].value=v};
  set("age",p.age);set("sex",p.sex);set("height",p.height_cm);set("weight",p.weight_kg);set("activity",p.activity_days);set("sleep",p.sleep_hours);
  const latest=k=>{const a=t[k]||[];return a.length?a.slice().sort((x,y)=>x.date.localeCompare(y.date)).at(-1).value:null};
  set("weight",latest("weight")??f.elements.weight.value);set("waist",latest("waist"));set("sbp",latest("sbp"));set("dbp",latest("dbp"));
  alert("Saved local profile/tracker values loaded where available.");
};

$("#saveResult").onclick=()=>{
  if(!lastResult)return;
  localStorage.setItem("shuddhoUnifiedHealthV54",JSON.stringify(lastResult));
  if(window.SHUDDHO_SYNC&&SHUDDHO_SYNC.updateLocalMeta)SHUDDHO_SYNC.updateLocalMeta();
  $("#saveMsg").innerHTML='<div class="result" style="margin-top:12px"><strong>Unified Health Profile saved locally.</strong></div>';
};
$("#printResult").onclick=()=>window.print();
$("#resetBtn").onclick=()=>{lastResult=null;$("#results").hidden=true;$("#urgent").hidden=true};
