
(function(){
  if(new URLSearchParams(location.search).get("embed")==="1")return;
  function fallback(){
    const marker="/SHUDDHO-Health-Calculators/";
    const i=location.pathname.indexOf(marker);
    return i>=0?location.origin+location.pathname.slice(0,i+marker.length):"../";
  }
  function back(){if(history.length>1)history.back();else location.href=fallback()}
  function mount(){
    if(document.querySelector(".global-back,.back-page,.backbtn"))return;
    const b=document.createElement("button");
    b.className="global-back";b.type="button";b.setAttribute("aria-label","Back");b.textContent="←";
    b.onclick=back;
    const row=document.querySelector(".top .row,.topbar .row");
    if(row){row.insertBefore(b,row.firstChild)}else{document.body.appendChild(b);b.classList.add("floating")}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
