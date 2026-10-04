const fs=require("fs"),path=require("path");
const BASE=(process.env.BASE_URL||"https://probalsarpv-byte.github.io/SHUDDHO-Health-Calculators").replace(/\/+$/,"");
const data=JSON.parse(fs.readFileSync("data/calculators.json","utf8"));
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const active=data.calculators.filter(x=>x.status==="active");
const byGroup={};for(const c of active)(byGroup[c.group]??=[]).push(c);
fs.rmSync("calculator",{recursive:true,force:true});fs.mkdirSync("calculator",{recursive:true});
const modulePaths=["assessments/","trackers/","labs/","food-tools/","medication-nutrition/","dashboard/","profile/","planner/","challenges/","reports/","learn/","symptoms/","reminders/","professional/","onboarding/","privacy/","account/"];
const moduleUrls=modulePaths.map(p=>`${BASE}/${p}`);
const urls=[];
for(const c of active){
  const g=data.groups[c.group]||{en:c.group,bn:c.group},url=`${BASE}/calculator/${c.id}/`;urls.push(url);
  const related=(byGroup[c.group]||[]).filter(x=>x.id!==c.id).slice(0,7);
  const title=`${c.name_en} | ${c.name_bn} | SHUDDHO Health Calculators`;
  const desc=`${c.summary_en} ${c.summary_bn}`.slice(0,310);
  const faq=[
    {q:`What does the ${c.name_en} result mean?`,a:`The result is an estimate based on ${c.formula}. The page provides contextual interpretation, but it is not a diagnosis.`},
    {q:`Is ${c.name_en} accurate?`,a:`Accuracy depends on the quality of the inputs and the limitations of the underlying equation. Use trends and clinical context when appropriate.`},
    {q:`Can I use this calculator in Bangla?`,a:`Yes. SHUDDHO Health Calculators supports Bangla and English on the same page.`}
  ];
  const ld={"@context":"https://schema.org","@graph":[
    {"@type":"WebApplication","name":c.name_en,"alternateName":c.name_bn,"url":url,"applicationCategory":"HealthApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled","description":desc,"isAccessibleForFree":true},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Health Calculators","item":`${BASE}/`},{"@type":"ListItem","position":2,"name":g.en,"item":`${BASE}/#${c.group}`},{"@type":"ListItem","position":3,"name":c.name_en,"item":url}]},
    {"@type":"FAQPage","mainEntity":faq.map(x=>({"@type":"Question","name":x.q,"acceptedAnswer":{"@type":"Answer","text":x.a}}))}
  ]};
  const metaJson=JSON.stringify(c).replace(/</g,"\\u003c");
  const relatedHtml=related.map(r=>`<a href="${BASE}/calculator/${r.id}/">${esc(r.name_en)}<br><small>${esc(r.name_bn)}</small></a>`).join("");
  const refs=(c.refs||[]).map(r=>`<li>${esc(r)}</li>`).join("");
  const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#07131b"><meta name="color-scheme" content="dark light">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="${url}"><link rel="stylesheet" href="../../calculator-page.css?v=5.3">
<script>(function(){try{var t=localStorage.getItem("shuddhoCalcTheme");if(t)document.documentElement.dataset.theme=t}catch(e){}})()</script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g,"\\u003c")}</script>
</head>
<body>
<header class="top"><div class="wrap row"><div class="navleft"><button class="btn back-page" onclick="history.length>1?history.back():location.href=\'${BASE}/\'" aria-label="Back">←</button><a href="${BASE}/">SHUDDHO Health Calculators</a></div><div class="actions"><button class="btn" id="langBtn">বাংলা</button><button class="btn" id="themeBtn">🌙</button></div></div></header>
<section class="hero"><canvas id="mini3d" aria-hidden="true"></canvas><div class="wrap inner"><div class="crumb"><a href="${BASE}/">Home</a> › ${esc(g.en)} › ${esc(c.name_en)}</div><h1>${esc(c.name_en)}</h1><h2>${esc(c.name_bn)}</h2><p id="summary">${esc(c.summary_en)}</p></div></section>
<div class="wrap page-tools"><a class="toolchip" href="${BASE}/">← All calculators</a><span class="toolchip">${esc(g.en)}</span><a class="toolchip" href="${BASE}/dashboard/">Dashboard</a></div>
<main class="wrap layout">
  <section class="leftcol">
    <section class="card calculator-card calc-panel"><h3 id="calcTitle">Calculator / ক্যালকুলেটর</h3><form id="calcForm" class="fields"></form></section>

    <section class="card details-card"><h3 id="detailsTitle">Calculator details / ক্যালকুলেটর ডিটেইলস</h3>
      <div class="details-grid">
        <div class="detailbox"><b>Category</b><span>${esc(g.en)}<br><small>${esc(g.bn)}</small></span></div>
        <div class="detailbox"><b>Formula</b><span>${esc(c.formula)}</span></div>
        <div class="detailbox"><b>Privacy</b><span>Runs in your browser</span></div>
      </div>
    </section>

    <section class="card how-card"><h3>How it works / কীভাবে কাজ করে</h3><p>${esc(c.summary_en)}</p><p>${esc(c.summary_bn)}</p><p><strong>Formula:</strong> <code>${esc(c.formula)}</code></p></section>

    <section class="card limitations-card"><h3>Interpretation & limitations</h3>
      <div class="insight-grid">
        <div class="insight"><strong>Result ≠ diagnosis</strong><p>The calculator gives a formula-based estimate. Symptoms, history, medicines, age, ethnicity and laboratory context can change meaning.</p></div>
        <div class="insight"><strong>Trend matters</strong><p>Repeated measurements made the same way are often more useful than one isolated number.</p></div>
        <div class="insight"><strong>বাংলা ব্যাখ্যা</strong><p>Result-এর পাশে status ও health meaning দেখানো হবে, যাতে শুধু সংখ্যা নয়—context-ও বোঝা যায়।</p></div>
        <div class="insight"><strong>Professional context</strong><p>High-risk, abnormal or symptomatic results should be interpreted by an appropriate health professional.</p></div>
      </div>
      <div class="notice" style="margin-top:14px">Educational/reference use only. Do not use this page alone to diagnose disease, stop/change medicine, or make urgent treatment decisions.</div>
    </section>

    <section class="card faq-card"><h3>FAQ</h3>
      <h4>${esc(faq[0].q)}</h4><p>${esc(faq[0].a)}</p>
      <h4>${esc(faq[1].q)}</h4><p>${esc(faq[1].a)}</p>
      <h4>${esc(faq[2].q)}</h4><p>${esc(faq[2].a)}</p>
    </section>

    <section class="card refs-card"><h3>References</h3><ul>${refs}</ul></section>
  </section>

  <aside class="rightcol">
    <section class="card result-card" id="resultCard">
      <div class="result-head"><small>YOUR RESULT / আপনার ফলাফল</small></div>
      <div class="result-wrap">
        <div class="result-shell">
          <div class="gauge" id="gauge" style="--score:65;--tone:var(--info)"><div class="gtext"><b id="gaugeText">Result</b><small>context score</small></div></div>
          <div class="result-value"><div class="big" id="resultPrimary">—</div><div class="unit" id="resultUnit">Enter values and calculate</div><pre id="resultAll" class="muted"></pre></div>
        </div>
        <div class="status">
          <span class="status-chip status-info" id="statusChip">Waiting for result</span>
          <h4 id="statusTitle">What this means</h4>
          <p id="statusDetail">Calculate to see whether the result is generally favorable, needs attention, or requires clinical context.</p>
          <p class="action" id="statusAction"></p>
        </div>
        <div class="share-row"><button class="btn" id="copyBtn">Copy result</button><button class="btn" id="shareBtn">Share</button></div>
      </div>
    </section>

    <section class="card backlinks related-card"><h3>Related calculators</h3>${relatedHtml||"<p>No related calculators.</p>"}</section>
  </aside>
</main>
<script>window.CALCULATOR_META=${metaJson};</script>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script src="../../calculator-engine.js?v=5.3"></script>
<script src="../../interpretation-engine.js?v=5.3"></script>
<script src="../../calculator-ui.js?v=5.3"></script>
</body></html>`;
  const dir=path.join("calculator",c.id);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"index.html"),html);
}
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[`${BASE}/`,...moduleUrls,...urls].map(u=>`  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync("sitemap.xml",xml);
fs.writeFileSync("robots.txt",`User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
fs.writeFileSync(".nojekyll","");
fs.writeFileSync("calculator-manifest.json",JSON.stringify({version:"5.3.0",active_calculators:active.length,groups:Object.keys(data.groups).length,generated_urls:urls.length+moduleUrls.length+1,base_url:BASE,features:["bilingual","result interpretation","dark-light","threejs","iframe mode","seo faq","assessments","trackers","lab interpreter","food database integration","MediNutrition integration","dashboard","planner","reports","local-only profile","privacy center","personalization","optional Firebase auth","hybrid local-first auto sync","cross-device sync","classification explorer","back navigation","compact calculator directory"]},null,2));
console.log(`Generated ${active.length} calculator pages`);
