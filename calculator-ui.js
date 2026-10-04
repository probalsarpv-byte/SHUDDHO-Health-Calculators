
(function(){
const meta=window.CALCULATOR_META||{}, $=(s,c=document)=>c.querySelector(s);
const storeGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}}, storeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let lang=storeGet("shuddhoCalcLang")||"bn", theme=storeGet("shuddhoCalcTheme")||((matchMedia&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark");
document.documentElement.dataset.theme=theme;

const cfg={
 sex:{type:"select",en:"Sex",bn:"লিঙ্গ",options:[["male","Male / পুরুষ"],["female","Female / নারী"]]},
 smoker:{type:"select",en:"Current smoking",bn:"বর্তমানে ধূমপান",options:[["false","No / না"],["true","Yes / হ্যাঁ"]]},
 diabetes:{type:"select",en:"Diabetes",bn:"ডায়াবেটিস",options:[["false","No / না"],["true","Yes / হ্যাঁ"]]},
 activity_factor:{type:"select",en:"Activity factor",bn:"অ্যাক্টিভিটি ফ্যাক্টর",options:[["1.2","Sedentary 1.2"],["1.375","Light 1.375"],["1.55","Moderate 1.55"],["1.725","Very active 1.725"],["1.9","Extra active 1.9"]]},
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
const defaults={age:35,weight_kg:70,height_cm:170,waist_cm:85,neck_cm:38,hip_cm:95,body_fat_pct:25,tdee:2200,deficit_kcal:400,protein_factor:1.2,water_ml_per_kg:35,calories:2000,protein_pct:25,carb_pct:45,fat_pct:30,daily_protein_g:90,meals:3,hba1c:5.7,eag_mgdl:117,fasting_glucose_mgdl:95,fasting_insulin:8,triglycerides_mgdl:130,hdl_mgdl:50,total_chol_mgdl:190,ldl_mgdl:110,creatinine_mgdl:0.9,urine_albumin_mgL:20,urine_creatinine_gL:1,sodium:140,chloride:103,bicarbonate:24,calcium_mgdl:9.2,albumin_gdl:4,glucose_mgdl:100,bun_mgdl:14,sbp:120,dbp:80,resting_hr:70,intensity_low:.5,intensity_high:.7,distance_km:5,time_min:30,lift_weight_kg:50,reps:8,cycle_length:28,ast:25,alt:25,platelets:250,ast_uln:40,protein_g:80,uun_g:10,dextrose_g_day:180,father_height_cm:170,mother_height_cm:158,non_hdl:140,egfr:90,uacr:20,measurement:10,reference_mean:10,reference_sd:1,activity_days:3,sleep_hours:7,fruitveg_servings:4,fiber_g:25,plant_variety_week:20,fermented_servings_week:3,strength_days:2,weight_loss_pct:0,breakfast_protein:25,lunch_protein:30,dinner_protein:35,sodium_mg:2000,target_mg:2300,potassium_mg:3000,protein_target_g:90,water_ml:2200,water_target_ml:2400,waist_height_ratio:.5};
function getLabel(k){const v=labels[k]||[k.replaceAll("_"," "),k.replaceAll("_"," "),""];return {en:v[0],bn:v[1],unit:v[2]}}
function fieldHTML(k){
  if(cfg[k]?.type==="select") return `<div class="field"><label>${lang==="bn"?cfg[k].bn:cfg[k].en}</label><select name="${k}">${cfg[k].options.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
  const l=getLabel(k), type=cfg[k]?.type||"number", val=type==="date"?"":(defaults[k]??"");
  return `<div class="field"><label>${lang==="bn"?l.bn:l.en}</label><input name="${k}" type="${type}" ${type==="number"?'step="any"':''} value="${val}">${l.unit?`<small>${l.unit}</small>`:""}</div>`;
}
function render(){
 document.documentElement.dataset.theme=theme;
 const form=$("#calcForm"); if(form) form.innerHTML=(meta.inputs||[]).map(fieldHTML).join("")+`<button class="calculate" type="submit">${lang==="bn"?"হিসাব করুন":"Calculate"}</button>`;
 $("#langBtn").textContent=lang==="bn"?"EN":"বাংলা";$("#themeBtn").textContent=theme==="dark"?"☀️":"🌙";
 $("#summary").textContent=lang==="bn"?meta.summary_bn:meta.summary_en;
}
function read(form){const o={};for(const el of form.elements){if(!el.name)continue;let v=el.value;if(["smoker","diabetes"].includes(el.name))v=v==="true";else if(el.type==="number")v=Number(v);o[el.name]=v}return o}
function pretty(r){if(r==null)return "—";if(typeof r==="number")return Number.isFinite(r)?String(Math.round(r*100)/100):"—";if(r.value!==undefined)return `${pretty(r.value)} ${r.unit||""}`.trim();return Object.entries(r).map(([k,v])=>`${k.replaceAll("_"," ")}: ${typeof v==="number"?Math.round(v*100)/100:v}`).join("\n")}
$("#calcForm").addEventListener("submit",e=>{e.preventDefault();try{const r=SHCALC.calculate(meta.id,read(e.target));$("#result").innerHTML=`<div><div class="big">${pretty(r).split("\n")[0]}</div>${pretty(r).includes("\n")?`<pre>${pretty(r)}</pre>`:""}</div>`;$("#result").scrollIntoView({behavior:"smooth",block:"nearest"})}catch(err){$("#result").textContent=err.message}});
$("#langBtn").onclick=()=>{lang=lang==="bn"?"en":"bn";storeSet("shuddhoCalcLang",lang);render()};
$("#themeBtn").onclick=()=>{theme=theme==="dark"?"light":"dark";storeSet("shuddhoCalcTheme",theme);render();init3D()};
$("#copyBtn").onclick=async()=>{const t=$("#result").innerText;try{await navigator.clipboard.writeText(t)}catch(e){}};
$("#shareBtn").onclick=async()=>{const d={title:meta.name_en,text:`${meta.name_en}: ${$("#result").innerText}`,url:location.href};if(navigator.share)try{await navigator.share(d)}catch(e){}else try{await navigator.clipboard.writeText(`${d.text}\n${d.url}`)}catch(e){}};
function init3D(){const c=$("#mini3d");if(!c||!window.THREE||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const host=c.parentElement,s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=5.2;const ren=new THREE.WebGLRenderer({canvas:c,alpha:true,antial:true});ren.setPixelRatio(Math.min(devicePixelRatio,1.5));const m=new THREE.Mesh(new THREE.TorusKnotGeometry(1.1,.32,110,16),new THREE.MeshPhysicalMaterial({color:theme==="dark"?0x39d6a0:0x087b58,roughness:.25,metalness:.18,transparent:true,opacity:.55}));m.position.x=2.1;s.add(m);function rs(){const w=host.clientWidth,h=host.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}rs();addEventListener("resize",rs,{passive:true});(function tick(){m.rotation.x+=.003;m.rotation.y+=.006;ren.render(s,cam);requestAnimationFrame(tick)})()}
render();init3D();
})();
