
const state={
  lang:storageGet("shuddhoCalcLang")||"bn",
  theme:storageGet("shuddhoCalcTheme")||((window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark"),
  data:null,
  mode:"group",
  filter:"all",
  query:""
};
const $=(s,c=document)=>c.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"\']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","\'":"&#039;"}[m]));
function storageGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function storageSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function label(obj){return state.lang==="bn"?(obj.bn||obj.en):(obj.en||obj.bn)}
function goBack(){if(history.length>1)history.back();else location.href="./"}

async function init(){
  document.documentElement.dataset.theme=state.theme;
  const r=await fetch("./data/calculators.json?v=5.4");
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
      <div class="navleft">
        <button class="backbtn" id="backBtn" aria-label="Back">←</button>
        <a class="brand" href="./">SHUDDHO <span>Health Platform</span></a>
      </div>
      <div class="actions">
        <a class="pillbtn linkbtn" href="./dashboard/">${state.lang==="bn"?"Dashboard":"Dashboard"}</a>
        <button class="pillbtn" id="langBtn">${state.lang==="bn"?"EN":"বাংলা"}</button>
        <button class="iconbtn" id="themeBtn" aria-label="Theme">${state.theme==="dark"?"☀️":"🌙"}</button>
      </div>
    </div></header>

    <section class="hero">
      <canvas id="hero3d" aria-hidden="true"></canvas>
      <div class="wrap content">
        <span class="kicker">${active.length} ${state.lang==="bn"?"ক্যালকুলেটর":"calculators"} · ${Object.keys(state.data.groups).filter(x=>x!=="future").length} ${state.lang==="bn"?"ক্যাটেগরি":"categories"} · বাংলা + English</span>
        <h1>${state.lang==="bn"?'এক জায়গায় <span class="gradient">Health Intelligence</span>':'Your <span class="gradient">Health Intelligence</span> Hub'}</h1>
        <p>${state.lang==="bn"?"ক্যালকুলেটর, assessment, tracker, lab interpretation, food composition, medication–nutrition এবং personalized dashboard—একটি connected health platform।":"Calculators, assessments, trackers, lab interpretation, food composition, medication–nutrition and a personalized dashboard in one connected health platform."}</p>
        <div class="searchbox"><span>⌕</span><input id="q" aria-label="Search calculators" placeholder="${state.lang==="bn"?"নাম, রোগ, বয়স বা ক্যাটেগরি দিয়ে খুঁজুন...":"Search by name, disease, age or category..."}"></div>
        <div class="stats">
          <div class="stat"><b>${active.length}</b><small>${state.lang==="bn"?"ক্যালকুলেটর":"Calculators"}</small></div>
          <div class="stat"><b>${Object.keys(state.data.groups).filter(x=>x!=="future").length}</b><small>${state.lang==="bn"?"ক্যাটেগরি":"Categories"}</small></div>
          <div class="stat"><b>2</b><small>${state.lang==="bn"?"ভাষা":"Languages"}</small></div>
          <div class="stat"><b>100%</b><small>${state.lang==="bn"?"Client-side core":"Client-side core"}</small></div>
        </div>
      </div>
    </section>

    <main id="main" class="wrap"></main>
    <footer class="footer"><div class="wrap">Educational/reference use only. Clinical tools do not replace professional assessment.</div></footer>`;

  $("#backBtn").onclick=goBack;
  $("#langBtn").onclick=()=>{state.lang=state.lang==="bn"?"en":"bn";storageSet("shuddhoCalcLang",state.lang);render();init3D();initReveal()};
  $("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";storageSet("shuddhoCalcTheme",state.theme);render();init3D();initReveal()};
  $("#q").oninput=e=>{state.query=e.target.value;draw()};
  draw();
}

function calcCard(x){
  const g=state.data.groups[x.group]||{en:x.group,bn:x.group};
  return `<a class="calc-card" href="./calculator/${x.id}/">
    <div class="calc-icon">${iconFor(x.group)}</div>
    <div class="calc-copy">
      <span class="micro">${esc(state.lang==="bn"?g.bn:g.en)}</span>
      <h3>${esc(state.lang==="bn"?x.name_bn:x.name_en)}</h3>
      <p>${esc(state.lang==="bn"?x.summary_bn:x.summary_en)}</p>
    </div>
    <span class="arrow">→</span>
  </a>`;
}
function iconFor(g){
  return ({body:"⚖",energy:"⚡",metabolic:"◉",kidney:"◈",lab:"⚗",cardio:"♥",fitness:"↗",women:"♀",clinical:"✚",child:"★",ageing:"⌛",ckm:"♥",personalized:"◎",microbiome:"◌","healthy-ageing":"◇"})[g]||"＋";
}
function moduleCards(){
  const modules=[
    ["unified-health/","Unified Health Profile","সমন্বিত স্বাস্থ্য মূল্যায়ন","Overall health status across body, metabolic, heart, kidney, liver, nutrition, sleep, muscle and lifestyle","◎"],
    ["assessments/","Health Assessments","স্বাস্থ্য মূল্যায়ন","Result + strengths + priority areas + suggestions","✓"],
    ["trackers/","Health Trackers","হেলথ ট্র্যাকার","Weight, BP, glucose, sleep, water, protein, steps","⌁"],
    ["labs/","Lab Interpreter","ল্যাব রিপোর্ট ব্যাখ্যা","Glucose, HbA1c, lipids, kidney, liver, thyroid, CBC","⚗"],
    ["food-tools/","Food & Nutrient Tools","ফুড ও নিউট্রিয়েন্ট টুলস","Bangladesh Food Composition database connected","◉"],
    ["medication-nutrition/","Medication–Nutrition","মেডিসিন–নিউট্রিশন","MediNutrition + interaction awareness","✚"],
    ["dashboard/","Personal Dashboard","পার্সোনাল ড্যাশবোর্ড","Profile, results, trends and recommendations","▦"]
  ];
  return modules.map(m=>`<a class="module-card" href="./${m[0]}"><span class="module-icon">${m[4]}</span><div><h3>${state.lang==="bn"?m[2]:m[1]}</h3><p>${m[3]}</p></div><b>→</b></a>`).join("");
}
function moreLinks(){
  const m=[
   ["profile/","Profile","প্রোফাইল"],["planner/","Goal Planner","গোল প্ল্যানার"],["challenges/","Challenges","চ্যালেঞ্জ"],
   ["reports/","Reports","রিপোর্ট"],["symptoms/","Symptom Checker","সিম্পটম চেকার"],["learn/","Learn","লার্ন"],
   ["professional/","Professional","প্রফেশনাল"],["account/","Account & Sync","অ্যাকাউন্ট ও সিঙ্ক"],["privacy/","Privacy","প্রাইভেসি"]
  ];
  return m.map(x=>`<a class="softchip" href="./${x[0]}">${state.lang==="bn"?x[2]:x[1]}</a>`).join("");
}
function featured(){
  const ids=["bmi","tdee","protein","egfr-2021","hba1c-to-eag","waist-height-ratio"];
  return ids.map(id=>state.data.calculators.find(x=>x.id===id)).filter(Boolean).map(calcCard).join("");
}
function filterTabs(){
  const top=[
    ["group",state.lang==="bn"?"ক্যাটেগরি":"Category"],
    ["disease",state.lang==="bn"?"রোগ/স্বাস্থ্য ক্ষেত্র":"Disease / Health"],
    ["gender",state.lang==="bn"?"লিঙ্গ":"Gender"],
    ["age",state.lang==="bn"?"বয়স":"Age"]
  ];
  let options=[];
  if(state.mode==="group"){
    options=[["all",{en:"All calculators",bn:"সব ক্যালকুলেটর"}],...Object.entries(state.data.groups).filter(([k])=>k!=="future")];
  }else{
    options=Object.entries(state.data.filter_labels?.[state.mode]||{});
  }
  return `<div class="explorer">
    <div class="axis-tabs">${top.map(([id,l])=>`<button class="axis ${state.mode===id?"active":""}" data-mode="${id}">${l}</button>`).join("")}</div>
    <div class="filter-strip">${options.map(([id,o])=>`<button class="filterchip ${state.filter===id?"active":""}" data-filter="${id}">${esc(label(o))}</button>`).join("")}</div>
  </div>`;
}
function matches(c){
  const q=(state.query||"").trim().toLowerCase();
  const searchable=[c.name_en,c.name_bn,c.summary_en,c.summary_bn,c.group,...(c.disease_tags||[]),...(c.gender_tags||[]),...(c.age_tags||[])].join(" ").toLowerCase();
  if(q && !searchable.includes(q)) return false;
  if(state.filter==="all") return true;
  if(state.mode==="group") return c.group===state.filter;
  if(state.mode==="disease") return (c.disease_tags||[]).includes(state.filter);
  if(state.mode==="gender"){
    if(state.filter==="all") return true;
    return (c.gender_tags||[]).includes(state.filter) || (c.gender_tags||[]).includes("all");
  }
  if(state.mode==="age"){
    if(state.filter==="all") return true;
    return (c.age_tags||[]).includes(state.filter);
  }
  return true;
}
function draw(){
  const host=$("#main"), active=state.data.calculators.filter(x=>x.status==="active");
  const items=active.filter(matches);
  host.innerHTML=`
    ${!state.query?`
    <section class="section reveal">
      <div class="section-head"><div><span class="eyebrow">SHUDDHO ECOSYSTEM</span><h2>${state.lang==="bn"?"শুধু ক্যালকুলেটর নয়":"Beyond calculators"}</h2><p>${state.lang==="bn"?"Assessment থেকে report—সব টুল connected।":"Connected tools from assessment to report."}</p></div></div>
      <div class="module-grid">${moduleCards()}</div>
      <div class="more-strip">${moreLinks()}</div>
    </section>
    <section class="section reveal featured">
      <div class="section-head"><div><span class="eyebrow">QUICK START</span><h2>${state.lang==="bn"?"গুরুত্বপূর্ণ ক্যালকুলেটর":"Popular starting points"}</h2></div></div>
      <div class="compact-grid">${featured()}</div>
    </section>`:""}
    <section class="section explorer-section">
      <div class="section-head"><div><span class="eyebrow">CALCULATOR DIRECTORY</span><h2>${state.lang==="bn"?"যেভাবে চান সেভাবে খুঁজুন":"Find calculators your way"}</h2><p>${state.lang==="bn"?"ক্যাটেগরি, রোগ/স্বাস্থ্য ক্ষেত্র, লিঙ্গ বা বয়স নির্বাচন করুন।":"Filter by category, disease/health area, gender or age."}</p></div><span class="count">${items.length} ${state.lang==="bn"?"টি":"tools"}</span></div>
      ${filterTabs()}
      <div class="results-head"><strong id="selectionLabel">${currentSelectionLabel()}</strong><span>${items.length} ${state.lang==="bn"?"ক্যালকুলেটর পাওয়া গেছে":"calculators found"}</span></div>
      <div class="compact-grid" id="calcResults">${items.map(calcCard).join("")||`<div class="empty">${state.lang==="bn"?"কোনো ক্যালকুলেটর পাওয়া যায়নি।":"No calculator found."}</div>`}</div>
    </section>`;
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{
    state.mode=b.dataset.mode;state.filter="all";draw();document.querySelector(".explorer-section")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{
    state.filter=b.dataset.filter;draw();document.querySelector(".explorer-section")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  initReveal();
}
function currentSelectionLabel(){
  if(state.filter==="all") return state.lang==="bn"?"সব ক্যালকুলেটর":"All calculators";
  if(state.mode==="group") return label(state.data.groups[state.filter]||{en:state.filter,bn:state.filter});
  return label(state.data.filter_labels?.[state.mode]?.[state.filter]||{en:state.filter,bn:state.filter});
}
function initReveal(){
  const els=[...document.querySelectorAll(".reveal")];
  if(!("IntersectionObserver" in window)){els.forEach(x=>x.classList.add("on"));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.06});
  els.forEach(x=>io.observe(x));
}
function init3D(){
  const canvas=$("#hero3d"); if(!canvas||!window.THREE||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const hero=canvas.parentElement, scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(55,1,.1,100);
  camera.position.z=7;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.45));
  const group=new THREE.Group();scene.add(group);
  const mat=new THREE.MeshPhysicalMaterial({color:state.theme==="dark"?0x39d6a0:0x087b58,roughness:.22,metalness:.15,transmission:.18,transparent:true,opacity:.72});
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1.45,2),mat);group.add(mesh);
  const ring=new THREE.Mesh(new THREE.TorusKnotGeometry(2.15,.055,150,18),new THREE.MeshBasicMaterial({color:state.theme==="dark"?0x5ca8ff:0x2563eb,wireframe:true,transparent:true,opacity:.20}));group.add(ring);
  const dots=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({size:.045,color:state.theme==="dark"?0xb78cff:0x7c3aed,transparent:true,opacity:.55}));
  const pts=[];for(let i=0;i<330;i++){const r=3.1+Math.random()*1.4,a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1);pts.push(r*Math.sin(b)*Math.cos(a),r*Math.sin(b)*Math.sin(a),r*Math.cos(b))}
  dots.geometry.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));scene.add(dots);
  function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();addEventListener("resize",resize,{passive:true});
  let mx=0,my=0;hero.addEventListener("pointermove",e=>{mx=(e.clientX/innerWidth-.5)*.35;my=(e.clientY/innerHeight-.5)*.2},{passive:true});
  function tick(){group.rotation.y+=.003;group.rotation.x+=.0015;dots.rotation.y-=.0007;group.position.x+=(mx-group.position.x)*.03;group.position.y+=(-my-group.position.y)*.03;renderer.render(scene,camera);requestAnimationFrame(tick)}tick();
}
init().catch(err=>{document.body.innerHTML=`<main class="wrap" style="padding:40px"><h1>Loading error</h1><p>${esc(err.message)}</p></main>`});