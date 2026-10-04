
const state={lang:storageGet("shuddhoCalcLang")||"bn",theme:storageGet("shuddhoCalcTheme")||((matchMedia&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark"),data:null};
const $=(s,c=document)=>c.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function storageGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function storageSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function label(obj){return state.lang==="bn"?(obj.bn||obj.en):(obj.en||obj.bn)}
async function init(){
  document.documentElement.dataset.theme=state.theme;
  const r=await fetch("./data/calculators.json?v=3");
  if(!r.ok) throw new Error("Calculator catalog could not be loaded.");
  state.data=await r.json();
  render();
  init3D();
  initReveal();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
}
function render(){
  const active=state.data.calculators.filter(x=>x.status==="active");
  document.documentElement.dataset.theme=state.theme;
  $("#app").innerHTML=`
    <header class="topbar"><div class="wrap row">
      <div class="brand">SHUDDHO <span>Health Calculators</span></div>
      <div class="actions">
        <button class="pillbtn" id="langBtn">${state.lang==="bn"?"EN":"বাংলা"}</button>
        <button class="iconbtn" id="themeBtn">${state.theme==="dark"?"☀️":"🌙"}</button>
      </div>
    </div></header>
    <section class="hero">
      <canvas id="hero3d" aria-hidden="true"></canvas>
      <div class="wrap content">
        <span class="kicker">65 tools · Bangla + English · browser-based</span>
        <h1>${state.lang==="bn"?'আপনার <span class="gradient">Health Data</span> বুঝুন':'Understand your <span class="gradient">Health Data</span>'}</h1>
        <p>${state.lang==="bn"?"Nutrition, metabolic health, kidney, fitness, pregnancy, child health ও healthy ageing—সব calculator এক জায়গায়।":"Nutrition, metabolic health, kidney, fitness, pregnancy, child health and healthy ageing calculators in one premium bilingual hub."}</p>
        <div class="searchbox"><input id="q" aria-label="Search calculators" placeholder="${state.lang==="bn"?"ক্যালকুলেটর খুঁজুন...":"Search calculators..."}"></div>
        <div class="stats">
          <div class="stat"><b>${active.length}</b><small>${state.lang==="bn"?"Active calculators":"Active calculators"}</small></div>
          <div class="stat"><b>${Object.keys(state.data.groups).length}</b><small>${state.lang==="bn"?"Categories":"Categories"}</small></div>
          <div class="stat"><b>2</b><small>${state.lang==="bn"?"Languages":"Languages"}</small></div>
          <div class="stat"><b>100%</b><small>${state.lang==="bn"?"Client-side":"Client-side"}</small></div>
        </div>
      </div>
    </section>
    <main id="main" class="wrap"></main>
    <footer class="footer"><div class="wrap">Educational/reference use only. Clinical tools do not replace professional assessment.</div></footer>`;
  $("#langBtn").onclick=()=>{state.lang=state.lang==="bn"?"en":"bn";storageSet("shuddhoCalcLang",state.lang);render();init3D();initReveal()};
  $("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";storageSet("shuddhoCalcTheme",state.theme);render();init3D();initReveal()};
  $("#q").oninput=e=>draw(e.target.value);
  draw("");
}
function draw(query){
  const q=query.trim().toLowerCase(), host=$("#main"); let html="";
  if(!q){
    const modules=[
      ["assessments/","Health Assessments","স্বাস্থ্য মূল্যায়ন","Personalized result + strengths + priority areas + suggestions"],
      ["trackers/","Health Trackers","হেলথ ট্র্যাকার","Weight, waist, BP, glucose, sleep, water, protein, steps and more"],
      ["labs/","Lab Interpreter","ল্যাব রিপোর্ট ব্যাখ্যা","Glucose, HbA1c, lipids, kidney, liver, thyroid and CBC context"],
      ["food-tools/","Food & Nutrient Tools","ফুড ও নিউট্রিয়েন্ট টুলস","Connected to Bangladesh Food Composition database"],
      ["medication-nutrition/","Medication–Nutrition","মেডিসিন–নিউট্রিশন","Connected to MediNutrition + safety checklist"],
      ["dashboard/","Health Dashboard","হেলথ ড্যাশবোর্ড","Combined local summary of assessments, trackers and profile"],
      ["planner/","Goal Planner","গোল প্ল্যানার","Weekly actions for weight, metabolic health, muscle and healthy ageing"],
      ["challenges/","Habit Challenges","হ্যাবিট চ্যালেঞ্জ","Hydration, fiber, plant diversity, sleep and movement challenges"],
      ["reports/","Report Generator","রিপোর্ট জেনারেটর","Printable / Save-as-PDF local health summary"],
      ["symptoms/","Symptom & Lifestyle Checker","সিম্পটম ও লাইফস্টাইল চেকার","Non-diagnostic pattern checker"],
      ["learn/","Education & Pathways","এডুকেশন ও পাথওয়ে","What to check next and connected tool pathways"],
      ["professional/","Professional Mode","প্রফেশনাল মোড","Fast workflow for health professionals"],
      ["profile/","Local Health Profile","লোকাল হেলথ প্রোফাইল","Personalize goals, language, units and priorities without an account"],
      ["privacy/","Privacy Center","প্রাইভেসি সেন্টার","Control local data, backups, cloud copies and deletion"],
      ["account/","Account & Auto Sync","অ্যাকাউন্ট ও অটো সিঙ্ক","Optional Google/email login with cross-device sync"]
    ];
    html+=`<section class="section reveal"><div class="section-head"><div><h2>${state.lang==="bn"?"Health Platform":"Health Platform"}</h2><p>${state.lang==="bn"?"Calculate → Assess → Track → Interpret → Plan → Learn → Report":"Calculate → Assess → Track → Interpret → Plan → Learn → Report"}</p></div></div><div class="grid">${modules.map(m=>`<a class="card" href="./${m[0]}"><span class="tag">SHUDDHO</span><h3>${state.lang==="bn"?m[2]:m[1]}</h3><p>${m[3]}</p><span class="open">${state.lang==="bn"?"খুলুন →":"Open →"}</span></a>`).join("")}</div></section>`;
  }
  for(const [gid,g] of Object.entries(state.data.groups)){
    if(gid==="future") continue;
    const items=state.data.calculators.filter(x=>x.group===gid&&x.status==="active"&&(!q||`${x.name_en} ${x.name_bn} ${x.summary_en} ${x.summary_bn}`.toLowerCase().includes(q)));
    if(!items.length) continue;
    html+=`<section class="section reveal" id="${gid}"><div class="section-head"><div><h2>${esc(label(g))}</h2><p>${items.length} tools</p></div></div><div class="grid">${items.map(x=>`<a class="card" href="./calculator/${x.id}/"><span class="tag">${esc(g.en)}</span><h3>${esc(state.lang==="bn"?x.name_bn:x.name_en)}</h3><p>${esc(state.lang==="bn"?x.summary_bn:x.summary_en)}</p><span class="open">${state.lang==="bn"?"খুলুন →":"Open calculator →"}</span></a>`).join("")}</div></section>`;
  }
  host.innerHTML=html||`<div class="empty">No calculator found.</div>`;
  initReveal();
}
function initReveal(){
  const els=[...document.querySelectorAll(".reveal")];
  if(!("IntersectionObserver" in window)){els.forEach(x=>x.classList.add("on"));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.08});
  els.forEach(x=>io.observe(x));
}
function init3D(){
  const canvas=$("#hero3d"); if(!canvas||!window.THREE||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const hero=canvas.parentElement, scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(55,1,.1,100);
  camera.position.z=7;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  const group=new THREE.Group();scene.add(group);
  const mat=new THREE.MeshPhysicalMaterial({color:state.theme==="dark"?0x39d6a0:0x087b58,roughness:.22,metalness:.15,transmission:.18,transparent:true,opacity:.74});
  const geo=new THREE.IcosahedronGeometry(1.45,2), mesh=new THREE.Mesh(geo,mat);group.add(mesh);
  const ringMat=new THREE.MeshBasicMaterial({color:state.theme==="dark"?0x5ca8ff:0x2563eb,wireframe:true,transparent:true,opacity:.22});
  const ring=new THREE.Mesh(new THREE.TorusKnotGeometry(2.15,.055,160,18),ringMat);group.add(ring);
  const dots=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({size:.045,color:state.theme==="dark"?0xb78cff:0x7c3aed,transparent:true,opacity:.65}));
  const pts=[];for(let i=0;i<420;i++){const r=3.1+Math.random()*1.4,a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1);pts.push(r*Math.sin(b)*Math.cos(a),r*Math.sin(b)*Math.sin(a),r*Math.cos(b))}
  dots.geometry.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));scene.add(dots);
  function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();addEventListener("resize",resize,{passive:true});
  let mx=0,my=0;hero.addEventListener("pointermove",e=>{mx=(e.clientX/innerWidth-.5)*.35;my=(e.clientY/innerHeight-.5)*.2},{passive:true});
  function tick(){group.rotation.y+=.003;group.rotation.x+=.0015;dots.rotation.y-=.0007;group.position.x+=(mx-group.position.x)*.03;group.position.y+=(-my-group.position.y)*.03;renderer.render(scene,camera);requestAnimationFrame(tick)}tick();
}
init().catch(err=>{document.body.innerHTML=`<main class="wrap" style="padding:40px"><h1>Loading error</h1><p>${esc(err.message)}</p><p>Make sure <code>data/calculators.json</code> exists in the repository.</p></main>`});
