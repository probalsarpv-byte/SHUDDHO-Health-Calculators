
(function(){
const meta=window.CALCULATOR_META||{}, $=(s,c=document)=>c.querySelector(s);
const BASE="https://probalsarpv-byte.github.io/SHUDDHO-Health-Calculators";
const getStore=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const setStore=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let lang=getStore("shuddhoCalcLang")||"bn";
let theme=getStore("shuddhoCalcTheme")||((window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark");
const embed=new URLSearchParams(location.search).get("embed")==="1";
document.documentElement.dataset.theme=theme;
if(embed) document.body.classList.add("embed-mode");

const cfg={
 sex:{type:"select",en:"Sex",bn:"লিঙ্গ",options:[["male","Male / পুরুষ"],["female","Female / নারী"]]},
 smoker:{type:"select",en:"Current smoking",bn:"বর্তমানে ধূমপান",options:[["false","No / না"],["true","Yes / হ্যাঁ"]]},
 diabetes:{type:"select",en:"Diabetes",bn:"ডায়াবেটিস",options:[["false","No / না"],["true","Yes / হ্যাঁ"]]},
 activity_factor:{type:"select",en:"Activity factor",bn:"অ্যাক্টিভিটি ফ্যাক্টর",options:[["1.2","Sedentary 1.20"],["1.375","Light 1.375"],["1.55","Moderate 1.55"],["1.725","Very active 1.725"],["1.9","Extra active 1.90"]]},
 lmp_date:{type:"date",en:"First day of last period",bn:"শেষ মাসিকের প্রথম দিন"},
 cycle_start_date:{type:"date",en:"Cycle start date",bn:"সাইকেল শুরুর তারিখ"}
};

const labels={
 age:["Age","বয়স","years"],weight_kg:["Weight","ওজন","kg"],height_cm:["Height","উচ্চতা","cm"],waist_cm:["Waist","কোমর","cm"],neck_cm:["Neck","গলা","cm"],hip_cm:["Hip","নিতম্ব","cm"],
 body_fat_pct:["Body fat","বডি ফ্যাট","%"],tdee:["TDEE","TDEE","kcal/day"],deficit_kcal:["Calorie deficit","ক্যালরি ডেফিসিট","kcal/day"],protein_factor:["Protein factor","প্রোটিন ফ্যাক্টর","g/kg"],
 water_ml_per_kg:["Water factor","পানি ফ্যাক্টর","mL/kg"],calories:["Calories","ক্যালরি","kcal/day"],protein_pct:["Protein","প্রোটিন","%"],carb_pct:["Carbohydrate","কার্বোহাইড্রেট","%"],fat_pct:["Fat","ফ্যাট","%"],
 daily_protein_g:["Daily protein","দৈনিক প্রোটিন","g"],meals:["Meals per day","দৈনিক মিল",""],hba1c:["HbA1c","HbA1c","%"],eag_mgdl:["eAG","eAG","mg/dL"],fasting_glucose_mgdl:["Fasting glucose","ফাস্টিং গ্লুকোজ","mg/dL"],
 fasting_insulin:["Fasting insulin","ফাস্টিং ইনসুলিন","µU/mL"],triglycerides_mgdl:["Triglycerides","ট্রাইগ্লিসারাইড","mg/dL"],hdl_mgdl:["HDL","HDL","mg/dL"],total_chol_mgdl:["Total cholesterol","মোট কোলেস্টেরল","mg/dL"],
 ldl_mgdl:["LDL","LDL","mg/dL"],creatinine_mgdl:["Serum creatinine","সিরাম ক্রিয়েটিনিন","mg/dL"],urine_albumin_mgL:["Urine albumin","ইউরিন অ্যালবুমিন","mg/L"],urine_creatinine_gL:["Urine creatinine","ইউরিন ক্রিয়েটিনিন","g/L"],
 sodium:["Sodium","সোডিয়াম","mEq/L"],chloride:["Chloride","ক্লোরাইড","mEq/L"],bicarbonate:["Bicarbonate","বাইকার্বোনেট","mEq/L"],calcium_mgdl:["Calcium","ক্যালসিয়াম","mg/dL"],albumin_gdl:["Albumin","অ্যালবুমিন","g/dL"],
 glucose_mgdl:["Glucose","গ্লুকোজ","mg/dL"],bun_mgdl:["BUN","BUN","mg/dL"],sbp:["Systolic BP","সিস্টোলিক BP","mmHg"],dbp:["Diastolic BP","ডায়াস্টোলিক BP","mmHg"],resting_hr:["Resting heart rate","রেস্টিং হার্ট রেট","bpm"],
 intensity_low:["Low intensity","লো ইনটেনসিটি","0–1"],intensity_high:["High intensity","হাই ইনটেনসিটি","0–1"],distance_km:["Distance","দূরত্ব","km"],time_min:["Time","সময়","minutes"],lift_weight_kg:["Lifted weight","ওজন","kg"],reps:["Repetitions","রেপ",""],
 cycle_length:["Cycle length","সাইকেল দৈর্ঘ্য","days"],ast:["AST","AST","U/L"],alt:["ALT","ALT","U/L"],platelets:["Platelets","প্লেটলেট","10⁹/L"],ast_uln:["AST upper limit","AST upper limit","U/L"],protein_g:["Protein intake","প্রোটিন ইনটেক","g/day"],
 uun_g:["Urinary urea nitrogen","UUN","g/day"],dextrose_g_day:["Dextrose","ডেক্সট্রোজ","g/day"],father_height_cm:["Father height","বাবার উচ্চতা","cm"],mother_height_cm:["Mother height","মায়ের উচ্চতা","cm"],
 non_hdl:["Non-HDL cholesterol","নন-HDL","mg/dL"],egfr:["eGFR","eGFR","mL/min/1.73m²"],uacr:["UACR","UACR","mg/g"],measurement:["Measurement","মাপ",""],reference_mean:["Reference mean","রেফারেন্স mean",""],reference_sd:["Reference SD","রেফারেন্স SD",""],
 activity_days:["Active days/week","সপ্তাহে active days","days"],sleep_hours:["Sleep","ঘুম","hours/night"],fruitveg_servings:["Fruit & vegetable servings","ফল-সবজি servings","/day"],fiber_g:["Fiber","ফাইবার","g/day"],
 plant_variety_week:["Distinct plants/week","সপ্তাহে ভিন্ন plant foods",""],fermented_servings_week:["Fermented food servings","ফারমেন্টেড food servings","/week"],strength_days:["Strength-training days","স্ট্রেংথ ট্রেনিং","days/week"],weight_loss_pct:["Recent unintentional weight loss","অনিচ্ছাকৃত ওজন কমা","%"],
 breakfast_protein:["Breakfast protein","সকালের প্রোটিন","g"],lunch_protein:["Lunch protein","দুপুরের প্রোটিন","g"],dinner_protein:["Dinner protein","রাতের প্রোটিন","g"],sodium_mg:["Sodium intake","সোডিয়াম ইনটেক","mg/day"],target_mg:["Target","টার্গেট","mg/day"],potassium_mg:["Potassium intake","পটাশিয়াম ইনটেক","mg/day"],
 protein_target_g:["Protein target","প্রোটিন টার্গেট","g/day"],water_ml:["Water intake","পানি ইনটেক","mL/day"],water_target_ml:["Water target","পানি টার্গেট","mL/day"],waist_height_ratio:["Waist-height ratio","কোমর-উচ্চতা অনুপাত",""]
};

const defaults={age:35,weight_kg:70,height_cm:170,waist_cm:85,neck_cm:38,hip_cm:95,body_fat_pct:25,tdee:2200,deficit_kcal:400,protein_factor:1.2,water_ml_per_kg:35,calories:2000,protein_pct:25,carb_pct:45,fat_pct:30,daily_protein_g:90,meals:3,hba1c:5.7,eag_mgdl:117,fasting_glucose_mgdl:95,fasting_insulin:8,triglycerides_mgdl:130,hdl_mgdl:50,total_chol_mgdl:190,ldl_mgdl:110,creatinine_mgdl:.9,urine_albumin_mgL:20,urine_creatinine_gL:1,sodium:140,chloride:103,bicarbonate:24,calcium_mgdl:9.2,albumin_gdl:4,glucose_mgdl:100,bun_mgdl:14,sbp:120,dbp:80,resting_hr:70,intensity_low:.5,intensity_high:.7,distance_km:5,time_min:30,lift_weight_kg:50,reps:8,cycle_length:28,ast:25,alt:25,platelets:250,ast_uln:40,protein_g:80,uun_g:10,dextrose_g_day:180,father_height_cm:170,mother_height_cm:158,non_hdl:140,egfr:90,uacr:20,measurement:10,reference_mean:10,reference_sd:1,activity_days:3,sleep_hours:7,fruitveg_servings:4,fiber_g:25,plant_variety_week:20,fermented_servings_week:3,strength_days:2,weight_loss_pct:0,breakfast_protein:25,lunch_protein:30,dinner_protein:35,sodium_mg:2000,target_mg:2300,potassium_mg:3000,protein_target_g:90,water_ml:2200,water_target_ml:2400,waist_height_ratio:.5};

function L(en,bn){return lang==="bn"?bn:en}
function getLabel(k){const v=labels[k]||[k.replaceAll("_"," "),k.replaceAll("_"," "),""];return{en:v[0],bn:v[1],unit:v[2]}}
function fieldHTML(k){
  if(cfg[k]?.type==="select") return `<div class="field"><label>${L(cfg[k].en,cfg[k].bn)}</label><select name="${k}">${cfg[k].options.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
  const l=getLabel(k),type=cfg[k]?.type||"number",val=type==="date"?"":(defaults[k]??"");
  return `<div class="field"><label>${L(l.en,l.bn)}</label><input name="${k}" type="${type}" ${type==="number"?'step="any"':''} value="${val}">${l.unit?`<small>${l.unit}</small>`:""}</div>`;
}
function read(form){
  const o={};
  for(const el of form.elements){
    if(!el.name) continue;
    let v=el.value;
    if(["smoker","diabetes"].includes(el.name)) v=v==="true";
    else if(el.type==="number") v=Number(v);
    o[el.name]=v;
  }
  return o;
}
function prettyNumber(v){return Number.isFinite(Number(v))?(Math.round(Number(v)*100)/100).toLocaleString(undefined,{maximumFractionDigits:2}):String(v)}
function formatResult(r){
  if(r==null) return {primary:"—",unit:"",all:"—"};
  if(typeof r==="number") return {primary:prettyNumber(r),unit:"",all:prettyNumber(r)};
  if(r.value!==undefined) return {primary:prettyNumber(r.value),unit:r.unit||"",all:`${prettyNumber(r.value)} ${r.unit||""}`.trim()};
  const entries=Object.entries(r);
  if(entries.length===1) return {primary:prettyNumber(entries[0][1]),unit:entries[0][0].replaceAll("_"," "),all:`${entries[0][0]}: ${prettyNumber(entries[0][1])}`};
  const all=entries.map(([k,v])=>`${k.replaceAll("_"," ")}: ${prettyNumber(v)}`).join("\n");
  return {primary:prettyNumber(entries[0]?.[1]??"—"),unit:entries[0]?.[0]?.replaceAll("_"," ")||"",all};
}
function toneColor(t){return t==="positive"?"var(--good)":t==="caution"?"var(--caution)":t==="negative"?"var(--bad)":"var(--info)"}
function renderForm(){
  const f=$("#calcForm");
  if(!f) return;
  f.innerHTML=(meta.inputs||[]).map(fieldHTML).join("")+`<button class="calculate" type="submit">${L("Calculate","হিসাব করুন")}</button>`;
}
function renderStaticLanguage(){
  $("#langBtn").textContent=lang==="bn"?"EN":"বাংলা";
  $("#themeBtn").textContent=theme==="dark"?"☀️":"🌙";
  const s=$("#summary"); if(s)s.textContent=lang==="bn"?meta.summary_bn:meta.summary_en;
  const calcTitle=$("#calcTitle");if(calcTitle)calcTitle.textContent=L("Calculator","ক্যালকুলেটর");
  const detailsTitle=$("#detailsTitle");if(detailsTitle)detailsTitle.textContent=L("Calculator details","ক্যালকুলেটর ডিটেইলস");
}
function showResult(result,inputs){
  const f=formatResult(result);
  const insight=window.SHCALC_INTERPRET?SHCALC_INTERPRET.interpret(meta.id,result,inputs):null;
  $("#resultPrimary").textContent=f.primary;
  $("#resultUnit").textContent=f.unit;
  $("#resultAll").textContent=f.all.includes("\n")?f.all:"";
  const score=Math.max(0,Math.min(100,Number(insight?.score??65)));
  const gauge=$("#gauge");gauge.style.setProperty("--score",score);gauge.style.setProperty("--tone",toneColor(insight?.tone||"info"));
  $("#gaugeText").textContent=insight?.label_en?L(insight.label_en,insight.label_bn):L("Result","ফলাফল");
  const chip=$("#statusChip");chip.className=`status-chip status-${insight?.tone||"info"}`;chip.textContent=insight?L(insight.label_en,insight.label_bn):L("Calculated result","হিসাবকৃত ফলাফল");
  $("#statusTitle").textContent=insight?L(insight.label_en,insight.label_bn):L("What this means","এর অর্থ কী");
  $("#statusDetail").textContent=insight?L(insight.detail_en,insight.detail_bn):L("This is an estimate.","এটি একটি estimate।");
  $("#statusAction").textContent=insight?.action_en?L(insight.action_en,insight.action_bn):"";
  $("#resultCard").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function initEmbed(){
  const area=$("#embedCode"); if(!area)return;
  const src=`${location.origin}${location.pathname}?embed=1`;
  area.value=`<iframe src="${src}" width="100%" height="900" style="border:0;border-radius:24px;overflow:hidden" loading="lazy" title="${meta.name_en}"></iframe>`;
  $("#copyEmbed").onclick=async()=>{try{await navigator.clipboard.writeText(area.value);$("#copyEmbed").textContent=L("Copied","কপি হয়েছে");setTimeout(()=>$("#copyEmbed").textContent=L("Copy iframe","iframe কপি"),1400)}catch(e){}};
}
function init3D(){
  const c=$("#mini3d");if(!c||!window.THREE||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const host=c.parentElement,s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=5.5;
  const ren=new THREE.WebGLRenderer({canvas:c,alpha:true,antial:true});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));
  const group=new THREE.Group();s.add(group);
  const mat=new THREE.MeshPhysicalMaterial({color:theme==="dark"?0x43e1ad:0x0a9b70,roughness:.18,metalness:.23,transmission:.12,transparent:true,opacity:.64});
  const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,2),mat);m.position.x=2.2;group.add(m);
  const ring=new THREE.Mesh(new THREE.TorusKnotGeometry(1.9,.045,130,18),new THREE.MeshBasicMaterial({color:theme==="dark"?0x629cff:0x326be6,wireframe:true,transparent:true,opacity:.30}));ring.position.x=2.2;group.add(ring);
  const pts=[];for(let x=0;x<260;x++){const r=2.7+Math.random()*1.7,a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1);pts.push(r*Math.sin(b)*Math.cos(a)+2.1,r*Math.sin(b)*Math.sin(a),r*Math.cos(b))}
  const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  const p=new THREE.Points(pg,new THREE.PointsMaterial({size:.042,color:theme==="dark"?0xa778ff:0x7a46df,transparent:true,opacity:.62}));s.add(p);
  function rs(){const w=host.clientWidth,h=host.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}rs();addEventListener("resize",rs,{passive:true});
  (function tick(){group.rotation.x+=.0016;group.rotation.y+=.004;p.rotation.y-=.0007;ren.render(s,cam);requestAnimationFrame(tick)})();
}
function rerender(){
  document.documentElement.dataset.theme=theme;
  renderForm();renderStaticLanguage();initEmbed();
}
$("#calcForm").addEventListener("submit",e=>{e.preventDefault();try{const inputs=read(e.target),result=SHCALC.calculate(meta.id,inputs);showResult(result,inputs)}catch(err){$("#statusDetail").textContent=err.message}});
$("#langBtn").onclick=()=>{lang=lang==="bn"?"en":"bn";setStore("shuddhoCalcLang",lang);rerender()};
$("#themeBtn").onclick=()=>{theme=theme==="dark"?"light":"dark";setStore("shuddhoCalcTheme",theme);document.documentElement.dataset.theme=theme;location.reload()};
$("#copyBtn").onclick=async()=>{const t=`${meta.name_en}: ${$("#resultPrimary").textContent} ${$("#resultUnit").textContent}\n${$("#statusTitle").textContent}: ${$("#statusDetail").textContent}`;try{await navigator.clipboard.writeText(t)}catch(e){}};
$("#shareBtn").onclick=async()=>{const t=`${meta.name_en}: ${$("#resultPrimary").textContent} ${$("#resultUnit").textContent} — ${$("#statusTitle").textContent}`,d={title:meta.name_en,text:t,url:location.href};if(navigator.share)try{await navigator.share(d)}catch(e){}else try{await navigator.clipboard.writeText(`${t}\n${location.href}`)}catch(e){}};
rerender();init3D();
})();
