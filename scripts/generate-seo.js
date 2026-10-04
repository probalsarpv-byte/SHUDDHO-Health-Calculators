const fs=require("fs"),path=require("path");
const BASE=(process.env.BASE_URL||"https://probalsarpv-byte.github.io/SHUDDHO-Health-Calculators").replace(/\/+$/,"");
const data=JSON.parse(fs.readFileSync("data/calculators.json","utf8"));
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const active=data.calculators.filter(x=>x.status==="active");
const byGroup={}; for(const c of active)(byGroup[c.group]??=[]).push(c);
fs.rmSync("calculator",{recursive:true,force:true});fs.mkdirSync("calculator",{recursive:true});
const urls=[];
for(const c of active){
  const g=data.groups[c.group]||{en:c.group,bn:c.group};
  const url=`${BASE}/calculator/${c.id}/`; urls.push(url);
  const related=(byGroup[c.group]||[]).filter(x=>x.id!==c.id).slice(0,6);
  const title=`${c.name_en} | ${c.name_bn} | SHUDDHO Health Calculators`;
  const desc=`${c.summary_en} ${c.summary_bn}`.slice(0,310);
  const ld={"@context":"https://schema.org","@graph":[
    {"@type":"WebApplication","name":c.name_en,"alternateName":c.name_bn,"url":url,"applicationCategory":"HealthApplication","operatingSystem":"Any","browserRequirements":"JavaScript enabled","description":desc,"isAccessibleForFree":true},
    {"@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Health Calculators","item":`${BASE}/`},
      {"@type":"ListItem","position":2,"name":g.en,"item":`${BASE}/#${c.group}`},
      {"@type":"ListItem","position":3,"name":c.name_en,"item":url}
    ]}
  ]};
  const metaJson=JSON.stringify(c).replace(/</g,"\\u003c");
  const relatedHtml=related.map(r=>`<a href="${BASE}/calculator/${r.id}/">${esc(r.name_en)}<br><small>${esc(r.name_bn)}</small></a>`).join("");
  const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark light"><meta name="theme-color" content="#07111f">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="stylesheet" href="../../calculator-page.css?v=3.0.0">
<script>(function(){try{var t=localStorage.getItem("shuddhoCalcTheme");if(t)document.documentElement.dataset.theme=t}catch(e){}})()</script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g,"\\u003c")}</script>
</head>
<body>
<header class="top"><div class="wrap row"><a href="${BASE}/">SHUDDHO Health Calculators</a><div class="actions"><button class="btn" id="langBtn">বাংলা</button><button class="btn" id="themeBtn">🌙</button></div></div></header>
<section class="hero"><canvas id="mini3d" aria-hidden="true"></canvas><div class="wrap inner"><div class="crumb"><a href="${BASE}/">Home</a> › ${esc(g.en)} › ${esc(c.name_en)}</div><h1>${esc(c.name_en)}</h1><h2>${esc(c.name_bn)}</h2><p id="summary">${esc(c.summary_en)}</p></div></section>
<main class="wrap layout">
  <article>
    <section class="card"><h3>Calculator / ক্যালকুলেটর</h3><form id="calcForm" class="fields"></form></section>
    <section class="card"><h3>Result / ফলাফল</h3><div class="result" id="result"><span class="muted">Enter values and calculate.</span></div><div class="share-row"><button class="btn" id="copyBtn">Copy result</button><button class="btn" id="shareBtn">Share</button></div></section>
    <section class="card"><h3>How it works / কীভাবে কাজ করে</h3><p>${esc(c.summary_en)}</p><p>${esc(c.summary_bn)}</p><p><strong>Formula:</strong> <code>${esc(c.formula)}</code></p></section>
    <section class="card"><h3>Interpretation & limitations</h3><p>Results are estimates. Interpret them together with age, symptoms, medical history, medications, laboratory context and the limitations of the underlying equation or score.</p><p>ফলাফল একটি estimate। বয়স, উপসর্গ, রোগের ইতিহাস, ওষুধ, ল্যাব রিপোর্ট এবং formula/score-এর সীমাবদ্ধতার সাথে মিলিয়ে ব্যাখ্যা করতে হবে।</p><div class="notice">Educational/reference use only. Do not use this page alone to diagnose disease, change medication, or make urgent treatment decisions.</div></section>
    <section class="card"><h3>References</h3><ul>${(c.refs||[]).map(r=>`<li>${esc(r)}</li>`).join("")}</ul></section>
  </article>
  <aside>
    <section class="card"><h3>Calculator details</h3><p><strong>Category:</strong><br>${esc(g.en)}<br>${esc(g.bn)}</p><p><strong>Mode:</strong><br>Bangla + English</p><p><strong>Privacy:</strong><br>Calculation runs in your browser.</p></section>
    <section class="card backlinks"><h3>Related calculators</h3>${relatedHtml||"<p>No related calculators.</p>"}</section>
  </aside>
</main>
<script>window.CALCULATOR_META=${metaJson};</script>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script src="../../calculator-engine.js?v=3.0.0"></script>
<script src="../../calculator-ui.js?v=3.0.0"></script>
</body></html>`;
  const dir=path.join("calculator",c.id);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"index.html"),html);
}
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[`${BASE}/`,...urls].map(u=>`  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync("sitemap.xml",xml);
fs.writeFileSync("robots.txt",`User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
fs.writeFileSync(".nojekyll","");
fs.writeFileSync("calculator-manifest.json",JSON.stringify({active_calculators:active.length,groups:Object.keys(data.groups).length,generated_urls:urls.length+1,base_url:BASE},null,2));
console.log(`Generated ${active.length} calculator pages`);
