
const tests={
glucose:{n:"Fasting glucose",u:"mg/dL",lo:70,hi:99,notes:"Higher fasting glucose can reflect impaired glucose regulation. A diagnosis requires appropriate repeat/confirmatory testing."},
hba1c:{n:"HbA1c",u:"%",lo:4,hi:5.6,notes:"HbA1c reflects average glycemia over roughly 2–3 months but can be affected by anemia, hemoglobin variants and other factors."},
tc:{n:"Total cholesterol",u:"mg/dL",lo:0,hi:199,notes:"Total cholesterol is less informative than LDL, non-HDL, triglycerides and overall cardiovascular risk."},
ldl:{n:"LDL cholesterol",u:"mg/dL",lo:0,hi:99,notes:"LDL goals depend strongly on overall cardiovascular risk; high-risk patients may need lower targets."},
hdl:{n:"HDL cholesterol",u:"mg/dL",lo:40,hi:999,notes:"Higher HDL is often associated with lower risk, but HDL alone should not be treated as a protective score."},
tg:{n:"Triglycerides",u:"mg/dL",lo:0,hi:149,notes:"Triglycerides are influenced by fasting status, alcohol, glycemia, diet and genetics."},
creatinine:{n:"Serum creatinine",u:"mg/dL",lo:.6,hi:1.3,notes:"Creatinine depends on muscle mass and should be interpreted with eGFR, age and sex."},
egfr:{n:"eGFR",u:"mL/min/1.73m²",lo:90,hi:999,notes:"Reduced eGFR may indicate lower kidney filtration if persistent. UACR is also important."},
uacr:{n:"UACR",u:"mg/g",lo:0,hi:29,notes:"Persistent UACR ≥30 mg/g indicates increased albuminuria and requires kidney/cardiovascular context."},
alt:{n:"ALT",u:"U/L",lo:7,hi:55,notes:"ALT can rise with fatty liver, viral hepatitis, medicines, alcohol and other causes. Lab-specific ranges vary."},
ast:{n:"AST",u:"U/L",lo:8,hi:48,notes:"AST is found in liver and muscle; interpretation often requires ALT, symptoms and clinical context."},
tsh:{n:"TSH",u:"mIU/L",lo:.4,hi:4,notes:"TSH interpretation depends on free T4, pregnancy status, age and the laboratory method."},
hb:{n:"Hemoglobin",u:"g/dL",lo:12,hi:17.5,notes:"Hemoglobin reference ranges vary by sex, altitude, pregnancy and laboratory."},
wbc:{n:"White blood cells",u:"×10⁹/L",lo:4,hi:11,notes:"WBC can change with infection, inflammation, stress, medicines and many other conditions."},
platelets:{n:"Platelets",u:"×10⁹/L",lo:150,hi:450,notes:"Platelet count must be interpreted with CBC context, symptoms and trends."},
ferritin:{n:"Ferritin",u:"ng/mL",lo:20,hi:300,notes:"Ferritin reflects iron stores but also rises with inflammation; sex-specific and lab-specific ranges vary."}
};
const $=s=>document.querySelector(s);$("#test").innerHTML=Object.entries(tests).map(([k,v])=>`<option value="${k}">${v.n} (${v.u})</option>`).join("");
$("#go").onclick=()=>{const t=tests[$("#test").value],v=Number($("#value").value),low=$("#low").value===""?t.lo:Number($("#low").value),high=$("#high").value===""?t.hi:Number($("#high").value);if(!Number.isFinite(v))return;const state=v<low?["Below reference range","warn"]:v>high?["Above reference range","warn"]:["Within entered/reference range","good"];$("#result").innerHTML=`<div class="score ${state[1]}">${v}</div><h3>${state[0]}</h3><p><strong>Reference used:</strong> ${low}–${high} ${t.u}</p><p>${t.notes}</p><div class="notice">Use the actual reference interval printed by your laboratory whenever available. Symptoms or marked abnormalities need clinical review.</div>`}
