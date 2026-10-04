
window.SHUDDHO_PERSONALIZE=(function(){
  function recommendations(p={}){
    const rec=[];
    const goal=(p.goal||"").toLowerCase();
    const priority=(p.priority||"").toLowerCase();
    const age=Number(p.age||0);
    if(goal.includes("weight")) rec.push(["BMI & Waist","calculator/bmi/","Start with BMI, then waist-to-height ratio."]);
    if(goal.includes("metabolic")||priority.includes("metabolic")) rec.push(["Metabolic Assessment","assessments/","Review glucose, waist, activity and sleep."]);
    if(goal.includes("muscle")||priority.includes("muscle")||age>=60) rec.push(["Protein & Muscle","calculator/older-adult-protein/","Set a protein target and review muscle health."]);
    if(goal.includes("pregnancy")||priority.includes("pregnancy")) rec.push(["Pregnancy Tools","calculator/pregnancy-due-date/","Use pregnancy dating and nutrition tools."]);
    if(priority.includes("kidney")) rec.push(["Kidney Tools","calculator/egfr-2021/","Review eGFR, UACR and kidney assessment."]);
    if(priority.includes("heart")||priority.includes("cardio")) rec.push(["Heart & Lipids","calculator/non-hdl/","Review BP, non-HDL and cardiovascular assessment."]);
    if(priority.includes("gut")) rec.push(["Gut & Food Diversity","assessments/","Complete gut assessment and plant diversity tools."]);
    if(priority.includes("sleep")) rec.push(["Sleep & Recovery","assessments/","Complete the sleep assessment and track sleep."]);
    if(!rec.length){
      rec.push(["General Health Assessment","assessments/","Start with a broad lifestyle and health review."]);
      rec.push(["Health Trackers","trackers/","Track one metric that matters to you."]);
    }
    rec.push(["Lab Interpreter","labs/","Use this when you have laboratory values."]);
    rec.push(["Food & Nutrient Tools","food-tools/","Connect goals with Bangladesh food composition data."]);
    return rec.slice(0,6);
  }
  return {recommendations};
})();
