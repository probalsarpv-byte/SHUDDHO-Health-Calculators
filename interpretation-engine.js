
window.SHCALC_INTERPRET=(function(){
  const n=x=>Number(x);
  const finite=x=>Number.isFinite(Number(x));
  const val=r=>r&&typeof r==="object"&&"value" in r?Number(r.value):Number(r);
  const pack=(tone,label_en,label_bn,detail_en,detail_bn,action_en="",action_bn="",score=null)=>({
    tone,label_en,label_bn,detail_en,detail_bn,action_en,action_bn,score
  });
  const band=(v,cuts,labels)=>{
    for(let i=0;i<cuts.length;i++) if(v<cuts[i]) return labels[i];
    return labels[labels.length-1];
  };

  function interpret(id,r,i={}){
    const v=val(r);

    switch(id){
      case "bmi":
        if(v<18.5) return pack("caution","Underweight","ওজন কম","Your BMI is below the usual healthy adult range. Low BMI can be linked with inadequate energy/protein intake, illness or low muscle mass, depending on context.","আপনার BMI সাধারণ adult healthy range-এর নিচে। কম BMI কম energy/protein intake, অসুস্থতা বা কম muscle mass-এর সঙ্গে সম্পর্কিত হতে পারে।","Review recent weight change, diet quality and muscle status.","সাম্প্রতিক ওজন পরিবর্তন, খাবারের মান ও muscle status দেখুন.",28);
        if(v<25) return pack("positive","Healthy range","স্বাভাবিক সীমা","Your BMI falls within the standard WHO healthy adult range. BMI does not show fat distribution or muscle mass, so waist and body-composition measures can add context.","আপনার BMI WHO standard adult healthy range-এর মধ্যে। তবে BMI fat distribution বা muscle mass দেখায় না—waist ও body-composition measure সাথে দেখলে ভালো বোঝা যায়।","Maintain a balanced diet, regular activity and waist monitoring.","সুষম খাবার, নিয়মিত activity ও waist monitoring বজায় রাখুন.",82);
        if(v<30) return pack("caution","Overweight range","ওভারওয়েট সীমা","Your BMI is in the overweight range. Health risk depends strongly on waist size, blood pressure, glucose, lipids, fitness and ethnicity.","আপনার BMI overweight range-এ। Health risk বুঝতে waist size, blood pressure, glucose, lipids, fitness ও ethnicity গুরুত্বপূর্ণ।","Check waist-to-height ratio and cardiometabolic markers.","Waist-to-height ratio ও cardiometabolic marker দেখুন.",58);
        if(v<35) return pack("negative","Obesity class I","স্থূলতা: ক্লাস I","BMI is in obesity class I. This can be associated with higher cardiometabolic risk, but BMI alone cannot define individual health.","BMI obesity class I range-এ। এটি cardiometabolic risk বাড়ার সঙ্গে সম্পর্কিত হতে পারে, তবে BMI একা ব্যক্তিগত স্বাস্থ্য নির্ধারণ করে না।","Consider a structured weight-management plan with professional support if appropriate.","প্রয়োজনে professional support নিয়ে structured weight-management plan বিবেচনা করুন.",35);
        if(v<40) return pack("negative","Obesity class II","স্থূলতা: ক্লাস II","BMI is in obesity class II. Clinical context and obesity-related conditions become especially important.","BMI obesity class II range-এ। Clinical context এবং obesity-related conditions বিশেষভাবে গুরুত্বপূর্ণ।","Discuss weight, blood pressure, glucose, lipids, sleep and liver health with a clinician.","Weight, BP, glucose, lipids, sleep ও liver health নিয়ে clinician-এর সাথে আলোচনা করুন.",24);
        return pack("negative","Obesity class III","স্থূলতা: ক্লাস III","BMI is in obesity class III. This range is associated with substantially increased population-level health risk.","BMI obesity class III range-এ। Population level-এ এই range উল্লেখযোগ্যভাবে বাড়তি health risk-এর সাথে সম্পর্কিত।","Professional assessment is recommended for an individualized plan.","Individualized plan-এর জন্য professional assessment উপকারী.",15);

      case "healthy-weight":
        return pack("info","Reference weight range","রেফারেন্স ওজনের সীমা",
          `For this height, the standard BMI 18.5–24.9 range corresponds to about ${r.low?.toFixed?.(1)??r.low}–${r.high?.toFixed?.(1)??r.high} kg. This is a screening range, not a personal ideal.`,
          `এই height-এর জন্য standard BMI 18.5–24.9 অনুযায়ী প্রায় ${r.low?.toFixed?.(1)??r.low}–${r.high?.toFixed?.(1)??r.high} kg reference range হয়। এটি screening range, ব্যক্তিগত “ideal” নয়।`,
          "Use waist size, body composition, strength and health markers alongside weight.","ওজনের সাথে waist, body composition, strength ও health marker দেখুন.",70);

      case "ideal-body-weight":
      case "adjusted-body-weight":
        return pack("info","Clinical reference estimate","ক্লিনিক্যাল রেফারেন্স estimate","This is a formula-based reference weight mainly used in some clinical calculations. It is not a target body weight for everyone.","এটি formula-based reference weight, মূলত কিছু clinical calculation-এ ব্যবহৃত হয়। সবার জন্য target body weight নয়।","Interpret together with current weight, body composition and clinical purpose.","বর্তমান ওজন, body composition ও clinical purpose-এর সাথে ব্যাখ্যা করুন.",65);

      case "lean-body-mass":
      case "ffmi":
        return pack("info","Body-composition estimate","বডি কম্পোজিশন estimate","This estimates lean or fat-free mass. A single number is most useful when tracked over time with the same method.","এটি lean/fat-free mass estimate। একই method দিয়ে সময়ের সাথে trend দেখলে বেশি উপকারী।","Combine with strength, waist and body-fat measures.","Strength, waist ও body-fat measure-এর সাথে দেখুন.",70);

      case "body-fat-navy":{
        const female=i.sex==="female";
        const low=female?21:8, upper=female?33:24;
        if(v<low) return pack("caution","Low body-fat estimate","কম body-fat estimate","Estimated body fat is relatively low for a general adult reference. Athletic targets and healthy ranges vary by age and sex.","General adult reference অনুযায়ী estimated body fat তুলনামূলক কম। Age, sex ও athletic status অনুযায়ী range বদলায়।","Avoid interpreting this as a diagnosis; consider nutrition, hormones and performance context.","Diagnosis হিসেবে নেবেন না; nutrition, hormone ও performance context দেখুন.",45);
        if(v<=upper) return pack("positive","Generally favorable range","সাধারণত অনুকূল range","Estimated body fat is within a broad general adult reference range.","Estimated body fat broad general adult reference range-এর মধ্যে।","Track trend rather than chasing one exact percentage.","একটি exact percentage-এর চেয়ে trend দেখুন.",82);
        return pack("caution","Higher body-fat estimate","উচ্চ body-fat estimate","Estimated body fat is above a broad general adult reference range. Cardiometabolic risk depends more on overall pattern and visceral fat.","Estimated body fat broad adult reference range-এর উপরে। Cardiometabolic risk বুঝতে overall pattern ও visceral fat গুরুত্বপূর্ণ।","Check waist-to-height ratio and metabolic markers.","Waist-to-height ratio ও metabolic marker দেখুন.",52);
      }

      case "waist-height-ratio":
        if(v<0.4) return pack("info","Low waist-to-height ratio","কম waist-to-height ratio","A low ratio can be favorable, though very low values should be interpreted with overall nutritional status.","কম ratio অনুকূল হতে পারে, তবে খুব কম হলে overall nutritional status-এর সাথে দেখুন.","Keep monitoring trend and body composition.","Trend ও body composition দেখুন.",76);
        if(v<0.5) return pack("positive","Generally favorable","সাধারণত অনুকূল","Waist is less than half of height, a commonly used simple marker of lower central-adiposity risk.","Waist height-এর অর্ধেকের কম—central adiposity risk-এর একটি সাধারণত অনুকূল marker।","Maintain activity and a waist-friendly dietary pattern.","Activity ও waist-friendly dietary pattern বজায় রাখুন.",88);
        if(v<0.6) return pack("caution","Increased central-adiposity signal","কেন্দ্রীয় মেদ বাড়ার ইঙ্গিত","A ratio of 0.50–0.59 suggests more central adiposity and potentially higher cardiometabolic risk.","0.50–0.59 ratio central adiposity ও cardiometabolic risk বাড়ার ইঙ্গিত দিতে পারে।","Consider weight, BP, glucose, TG/HDL and activity together.","Weight, BP, glucose, TG/HDL ও activity একসাথে দেখুন.",48);
        return pack("negative","High central-adiposity signal","উচ্চ central-adiposity signal","A ratio of 0.60 or more is associated with substantially greater central adiposity.","0.60 বা তার বেশি ratio উল্লেখযোগ্য central adiposity-এর সাথে সম্পর্কিত।","A structured cardiometabolic risk review is sensible.","Structured cardiometabolic risk review উপকারী হতে পারে.",25);

      case "waist-hip-ratio":{
        const cutoff=i.sex==="female"?0.85:0.90;
        return v<cutoff
          ? pack("positive","Below common risk cutoff","সাধারণ risk cutoff-এর নিচে","Your waist-to-hip ratio is below a commonly used WHO risk threshold for this sex.","আপনার waist-to-hip ratio এই sex-এর সাধারণ WHO risk threshold-এর নিচে।","Use waist-to-height ratio for an additional simple check.","আরেকটি simple check হিসেবে waist-to-height ratio দেখুন.",82)
          : pack("caution","Above common risk cutoff","সাধারণ risk cutoff-এর উপরে","Your waist-to-hip ratio is above a commonly used risk threshold and may indicate more abdominal fat distribution.","আপনার ratio সাধারণ risk threshold-এর উপরে, যা abdominal fat distribution বেশি হওয়ার ইঙ্গিত দিতে পারে।","Review waist, BP, glucose and lipid profile.","Waist, BP, glucose ও lipid profile review করুন.",44);
      }

      case "bai":
      case "absi":
        return pack("info","Screening index","স্ক্রিনিং ইনডেক্স","This index is best interpreted against age/sex/population references; a single universal healthy cutoff is not appropriate.","এই index age/sex/population reference-এর সাথে ব্যাখ্যা করা ভালো; একটিমাত্র universal healthy cutoff উপযুক্ত নয়।","Use BMI, waist and metabolic markers for context.","BMI, waist ও metabolic marker-এর সাথে দেখুন.",60);

      case "bmr-mifflin":
        return pack("info","Estimated resting energy need","আনুমানিক resting energy need",`Your estimated basal/resting energy requirement is about ${Math.round(v)} kcal/day. This is energy needed before normal activity is added.`,`আপনার আনুমানিক basal/resting energy requirement প্রায় ${Math.round(v)} kcal/day। দৈনন্দিন activity যোগ করার আগের energy need এটি।`,"Use TDEE—not BMR alone—for a daily calorie target.","Daily calorie target-এর জন্য BMR নয়, TDEE ব্যবহার করুন.",72);

      case "tdee":
        return pack("info","Estimated daily energy expenditure","আনুমানিক দৈনিক energy expenditure",`Estimated total daily energy expenditure is about ${Math.round(v)} kcal/day at the selected activity level.`,`নির্বাচিত activity level-এ আনুমানিক total daily energy expenditure প্রায় ${Math.round(v)} kcal/day।`,"Real-world needs vary; compare this estimate with weight trend over 2–4 weeks.","বাস্তব need ভিন্ন হতে পারে; 2–4 সপ্তাহের weight trend-এর সাথে মিলিয়ে দেখুন.",72);

      case "calorie-deficit":
        return pack("info","Estimated calorie target","আনুমানিক calorie target",`The calculated intake target is about ${Math.round(v)} kcal/day based on the entered TDEE and deficit.`,`Entered TDEE ও deficit অনুযায়ী calorie target প্রায় ${Math.round(v)} kcal/day।`,"Avoid overly aggressive deficits; energy, protein, sleep and training quality matter.","অতিরিক্ত aggressive deficit এড়িয়ে চলুন; energy, protein, sleep ও training quality গুরুত্বপূর্ণ.",68);

      case "protein":
      case "older-adult-protein":
        return pack("info","Daily protein target","দৈনিক protein target",`Estimated protein target: about ${Math.round(v)} g/day based on the selected g/kg factor.`,`নির্বাচিত g/kg factor অনুযায়ী আনুমানিক protein target প্রায় ${Math.round(v)} g/day।`,"Adjust for age, training, kidney status, pregnancy and clinical conditions.","Age, training, kidney status, pregnancy ও clinical condition অনুযায়ী adjust করুন.",74);

      case "water":
        return pack("info","Baseline fluid estimate","Baseline fluid estimate",`Estimated baseline fluid: about ${Math.round(v)} mL/day. Heat, sweating, pregnancy, illness, kidney/heart conditions and diet can change needs.`,`Baseline fluid estimate প্রায় ${Math.round(v)} mL/day। Heat, sweating, pregnancy, illness, kidney/heart condition ও diet অনুযায়ী need বদলাতে পারে।`,"Use thirst, urine pattern and clinical restrictions as context.","Thirst, urine pattern ও clinical restriction-এর সাথে মিলিয়ে দেখুন.",72);

      case "fiber":
        return pack("info","Fiber target estimate","ফাইবার টার্গেট",`Estimated fiber target is about ${Math.round(v)} g/day using 14 g per 1000 kcal.`,`14 g/1000 kcal অনুযায়ী আনুমানিক fiber target প্রায় ${Math.round(v)} g/day।`,"Increase fiber gradually with adequate fluid if current intake is low.","বর্তমান intake কম হলে adequate fluid-এর সাথে ধীরে বাড়ান.",78);

      case "macro":
        return pack("info","Macronutrient distribution","ম্যাক্রোনিউট্রিয়েন্ট distribution","This converts your selected calorie percentages into grams. There is no single best macro split for everyone.","Selected calorie percentage-কে gram-এ convert করা হয়েছে। সবার জন্য একটিমাত্র best macro split নেই।","Choose a pattern you can sustain while meeting protein, fiber and micronutrient needs.","Protein, fiber ও micronutrient need পূরণ করে sustainable pattern বেছে নিন.",70);

      case "carbohydrate":
      case "fat-intake":
      case "meal-protein":
        return pack("info","Calculated nutrition target","হিসাবকৃত nutrition target","This result is a planning target based on the inputs you selected, not a diagnosis.","এটি selected input অনুযায়ী planning target, diagnosis নয়।","Adjust according to goal, tolerance, activity and clinical context.","Goal, tolerance, activity ও clinical context অনুযায়ী adjust করুন.",70);

      case "hba1c-eag":
        if(v<117) return pack("positive","Average glucose in a generally normal-equivalent zone","Average glucose সাধারণ normal-equivalent zone-এ","The converted eAG is roughly consistent with HbA1c below the usual prediabetes threshold, assuming the HbA1c is reliable.","Converted eAG আনুমানিকভাবে usual prediabetes threshold-এর নিচের HbA1c-এর সাথে মেলে, যদি HbA1c reliable হয়।","Use the actual HbA1c and clinical context for diagnosis.","Diagnosis-এর জন্য actual HbA1c ও clinical context ব্যবহার করুন.",84);
        if(v<140) return pack("caution","Average glucose in a prediabetes-equivalent zone","Prediabetes-equivalent zone","The converted eAG is approximately consistent with the HbA1c prediabetes range.","Converted eAG আনুমানিকভাবে HbA1c prediabetes range-এর সাথে মেলে।","Consider repeat testing and lifestyle review with a clinician.","Repeat testing ও lifestyle review বিবেচনা করুন.",50);
        return pack("negative","Average glucose in a diabetes-equivalent zone","Diabetes-equivalent zone","The converted eAG is approximately consistent with HbA1c in the diabetes diagnostic range, but diagnosis requires proper clinical testing.","Converted eAG আনুমানিকভাবে diabetes diagnostic HbA1c range-এর সাথে মেলে, তবে diagnosis proper clinical testing ছাড়া করা যায় না।","Seek clinical confirmation rather than relying on this conversion alone.","শুধু conversion-এর উপর নির্ভর না করে clinical confirmation নিন.",28);

      case "eag-hba1c":
        if(v<5.7) return pack("positive","Below common prediabetes threshold","সাধারণ prediabetes threshold-এর নিচে","Estimated HbA1c is below 5.7%.","Estimated HbA1c 5.7%-এর নিচে।","Use a laboratory HbA1c for clinical decisions.","Clinical decision-এর জন্য laboratory HbA1c ব্যবহার করুন.",84);
        if(v<6.5) return pack("caution","Prediabetes-equivalent estimate","Prediabetes-equivalent estimate","Estimated HbA1c falls in the common 5.7–6.4% prediabetes range.","Estimated HbA1c common 5.7–6.4% prediabetes range-এ।","Confirm with laboratory testing.","Laboratory testing দিয়ে confirm করুন.",50);
        return pack("negative","Diabetes-equivalent estimate","Diabetes-equivalent estimate","Estimated HbA1c is at or above 6.5%, a common diagnostic threshold when confirmed appropriately.","Estimated HbA1c 6.5% বা তার বেশি—appropriate confirmation থাকলে এটি common diagnostic threshold।","Seek clinical confirmation.","Clinical confirmation নিন.",28);

      case "homa-ir":
        return pack("info","Insulin-resistance estimate","Insulin resistance estimate","Higher HOMA-IR generally suggests greater insulin resistance, but there is no single universal cutoff across populations and laboratories.","HOMA-IR বেশি হলে সাধারণত insulin resistance বেশি বোঝাতে পারে, তবে population/lab অনুযায়ী cutoff ভিন্ন।","Compare with glucose, HbA1c, TG/HDL, waist and clinical context.","Glucose, HbA1c, TG/HDL, waist ও clinical context-এর সাথে দেখুন.",55);

      case "quicki":
        return pack("info","Insulin-sensitivity estimate","Insulin sensitivity estimate","Higher QUICKI generally reflects greater insulin sensitivity. Universal clinical cutoffs are not standardized.","QUICKI বেশি হলে সাধারণত insulin sensitivity বেশি বোঝায়। Universal clinical cutoff standardized নয়।","Use alongside fasting glucose/insulin and clinical context.","Fasting glucose/insulin ও clinical context-এর সাথে দেখুন.",60);

      case "tyg":
        return pack("info","Metabolic risk marker","মেটাবলিক risk marker","Higher TyG values are associated with insulin resistance and cardiometabolic risk in population studies, but cutoffs vary by population.","Population study-তে higher TyG insulin resistance ও cardiometabolic risk-এর সাথে সম্পর্কিত, তবে cutoff population অনুযায়ী ভিন্ন।","Track trends with waist, glucose, TG and HDL.","Waist, glucose, TG ও HDL-এর সাথে trend দেখুন.",58);

      case "tg-hdl":
        return pack("info","Lipid ratio","লিপিড ratio","Lower TG/HDL is generally more favorable, but interpretation differs by sex, ethnicity and metabolic context.","Lower TG/HDL সাধারণত বেশি অনুকূল, তবে sex, ethnicity ও metabolic context অনুযায়ী interpretation বদলায়।","Review the full lipid profile rather than this ratio alone.","শুধু ratio নয়, full lipid profile দেখুন.",60);

      case "non-hdl":
        if(v<130) return pack("positive","Generally favorable for many adults","অনেক adult-এর জন্য সাধারণত অনুকূল","Non-HDL cholesterol is below 130 mg/dL, a commonly used general screening target for many average-risk adults.","Non-HDL 130 mg/dL-এর নিচে—অনেক average-risk adult-এর জন্য common general screening target।","Risk-based targets can be lower in high-risk patients.","High-risk patient-এর target আরও কম হতে পারে.",82);
        if(v<160) return pack("caution","Borderline-high range","Borderline-high range","Non-HDL is moderately elevated. Individual targets depend on overall cardiovascular risk.","Non-HDL কিছুটা বেশি। Individual target overall cardiovascular risk-এর উপর নির্ভর করে।","Review LDL, TG, BP, diabetes and family history.","LDL, TG, BP, diabetes ও family history দেখুন.",50);
        return pack("negative","High non-HDL cholesterol","উচ্চ non-HDL cholesterol","Non-HDL is high by common screening categories and may reflect greater atherogenic cholesterol burden.","Common screening category অনুযায়ী non-HDL high, যা atherogenic cholesterol burden বেশি বোঝাতে পারে।","A cardiovascular risk review is appropriate.","Cardiovascular risk review উপকারী.",28);

      case "remnant-cholesterol":
        return pack("info","Estimated remnant cholesterol","Estimated remnant cholesterol","This is a calculated remnant cholesterol estimate. Higher values may reflect triglyceride-rich lipoprotein burden, but universal treatment cutoffs are not established.","এটি calculated remnant cholesterol estimate। বেশি মান triglyceride-rich lipoprotein burden বোঝাতে পারে, তবে universal treatment cutoff established নয়।","Interpret with TG, LDL/non-HDL and overall risk.","TG, LDL/non-HDL ও overall risk-এর সাথে দেখুন.",58);

      case "egfr-2021":
        if(v>=90) return pack("positive","G1 filtration range","G1 filtration range","eGFR is 90 or higher. This alone does not rule out CKD if albuminuria or other kidney abnormalities are present.","eGFR 90 বা বেশি। তবে albuminuria বা অন্য kidney abnormality থাকলে CKD পুরোপুরি বাদ যায় না।","Check UACR and trend over time.","UACR ও সময়ের trend দেখুন.",88);
        if(v>=60) return pack("info","G2 filtration range","G2 filtration range","eGFR is 60–89. CKD is not diagnosed from this value alone without persistent kidney damage markers.","eGFR 60–89। Persistent kidney-damage marker ছাড়া এই value একা CKD diagnosis করে না।","Review UACR and repeat results if clinically indicated.","UACR ও repeat result প্রয়োজনমতো দেখুন.",70);
        if(v>=45) return pack("caution","G3a range","G3a range","eGFR is 45–59, consistent with moderately reduced filtration if persistent.","Persistent হলে eGFR 45–59 moderately reduced filtration-এর সাথে মেলে।","Clinical review and albuminuria assessment are appropriate.","Clinical review ও albuminuria assessment উপকারী.",48);
        if(v>=30) return pack("caution","G3b range","G3b range","eGFR is 30–44, indicating moderately to severely reduced filtration if persistent.","Persistent হলে eGFR 30–44 moderately-to-severely reduced filtration বোঝায়।","Medication dosing and kidney follow-up become increasingly important.","Medication dosing ও kidney follow-up গুরুত্বপূর্ণ.",38);
        if(v>=15) return pack("negative","G4 range","G4 range","eGFR is 15–29, a severely reduced filtration range if persistent.","Persistent হলে eGFR 15–29 severely reduced filtration range।","Prompt nephrology/clinical management is usually warranted.","Nephrology/clinical management সাধারণত প্রয়োজন.",20);
        return pack("negative","G5 range","G5 range","eGFR is below 15, a kidney-failure range if confirmed and persistent.","Confirmed ও persistent হলে eGFR 15-এর নিচে kidney-failure range।","Urgent specialist management is important.","Specialist management গুরুত্বপূর্ণ.",8);

      case "uacr":
        if(v<30) return pack("positive","A1 albuminuria category","A1 albuminuria","UACR is below 30 mg/g, the normal-to-mildly increased category.","UACR 30 mg/g-এর নিচে—normal-to-mildly increased category।","Interpret with eGFR and repeat if clinically indicated.","eGFR-এর সাথে দেখুন ও প্রয়োজনে repeat করুন.",86);
        if(v<=300) return pack("caution","A2 albuminuria category","A2 albuminuria","UACR is 30–300 mg/g, a moderately increased albuminuria range.","UACR 30–300 mg/g—moderately increased albuminuria range।","Persistent elevation warrants kidney and cardiovascular risk assessment.","Persistent হলে kidney ও cardiovascular risk assessment প্রয়োজন.",45);
        return pack("negative","A3 albuminuria category","A3 albuminuria","UACR is above 300 mg/g, a severely increased albuminuria range.","UACR 300 mg/g-এর বেশি—severely increased albuminuria range।","Clinical evaluation is important, especially with reduced eGFR.","বিশেষ করে eGFR কম হলে clinical evaluation গুরুত্বপূর্ণ.",20);

      case "crcl":
        return pack("info","Creatinine-clearance estimate","Creatinine-clearance estimate","Cockcroft–Gault creatinine clearance is commonly used for some medication-dosing decisions. It is not interchangeable with eGFR.","Cockcroft–Gault creatinine clearance কিছু medication dosing-এ ব্যবহৃত হয়। এটি eGFR-এর সাথে interchangeable নয়।","Use the equation required by the medication guideline.","Medication guideline যে equation চায় সেটি ব্যবহার করুন.",65);

      case "bsa":
        return pack("info","Body surface area","Body surface area","BSA is mainly a clinical scaling measure used in drug dosing and physiologic calculations. It is not a health grade.","BSA মূলত drug dosing ও physiologic calculation-এর clinical scaling measure। এটি health grade নয়।","Use only for the clinical purpose intended.","যে clinical purpose-এর জন্য দরকার সেই context-এ ব্যবহার করুন.",70);

      case "anion-gap":
        if(v<8) return pack("caution","Low anion gap","কম anion gap","This is below a common reference range, but lab methods and albumin strongly affect interpretation.","এটি common reference range-এর নিচে, তবে lab method ও albumin interpretation-কে প্রভাবিত করে।","Confirm with the reporting laboratory range.","Reporting lab range-এর সাথে মিলিয়ে দেখুন.",45);
        if(v<=12) return pack("positive","Within a common reference range","সাধারণ reference range-এর মধ্যে","The calculated anion gap is within a commonly used 8–12 mEq/L range when potassium is excluded.","Potassium বাদ দিয়ে common 8–12 mEq/L range-এর মধ্যে।","Always use the local laboratory reference interval.","Local lab reference interval ব্যবহার করুন.",82);
        return pack("caution","Elevated anion gap","উচ্চ anion gap","An elevated gap can occur with unmeasured acids, including several metabolic acidosis states.","Elevated gap বিভিন্ন unmeasured acid ও metabolic acidosis state-এ দেখা যেতে পারে।","Clinical evaluation and acid-base context are important.","Clinical evaluation ও acid-base context গুরুত্বপূর্ণ.",38);

      case "corrected-calcium":
        if(v<8.5) return pack("caution","Low corrected calcium estimate","কম corrected calcium","Below a common adult reference range. The correction formula is imperfect and ionized calcium may be more informative in some settings.","Common adult reference range-এর নিচে। Correction formula imperfect; কিছু setting-এ ionized calcium বেশি informative।","Compare with local lab range and clinical context.","Local lab range ও clinical context-এর সাথে দেখুন.",40);
        if(v<=10.5) return pack("positive","Within a common adult range","সাধারণ adult range-এর মধ্যে","Corrected calcium falls within a commonly used adult reference range.","Corrected calcium common adult reference range-এর মধ্যে।","Use local laboratory ranges.","Local laboratory range ব্যবহার করুন.",82);
        return pack("caution","High corrected calcium estimate","উচ্চ corrected calcium","Above a common adult reference range.","Common adult reference range-এর উপরে।","Clinical confirmation is appropriate.","Clinical confirmation উপকারী.",38);

      case "corrected-sodium":
        if(v<135) return pack("caution","Low sodium estimate","কম sodium","Corrected sodium remains below a common 135–145 mEq/L reference range.","Corrected sodium common 135–145 mEq/L range-এর নিচে।","Sodium disorders can be clinically important; interpret with symptoms and fluid status.","Symptoms ও fluid status-এর সাথে clinical interpretation প্রয়োজন.",35);
        if(v<=145) return pack("positive","Within a common reference range","সাধারণ reference range-এর মধ্যে","Corrected sodium is within a commonly used adult reference range.","Corrected sodium common adult range-এর মধ্যে।","Use the laboratory result and clinical context.","Laboratory result ও clinical context ব্যবহার করুন.",82);
        return pack("caution","High sodium estimate","উচ্চ sodium","Corrected sodium is above a common adult reference range.","Corrected sodium common adult range-এর উপরে।","Assess fluid balance and clinical context.","Fluid balance ও clinical context দেখুন.",35);

      case "serum-osmolality":
        if(v<275) return pack("caution","Low calculated osmolality","কম calculated osmolality","Below a commonly used serum osmolality range.","Common serum osmolality range-এর নিচে।","Compare with measured osmolality if clinically relevant.","প্রয়োজনে measured osmolality-এর সাথে compare করুন.",40);
        if(v<=295) return pack("positive","Within common range","সাধারণ range-এর মধ্যে","Calculated serum osmolality is within a commonly used 275–295 mOsm/kg range.","Calculated serum osmolality common 275–295 mOsm/kg range-এর মধ্যে।","Interpret with sodium, glucose and renal context.","Sodium, glucose ও renal context-এর সাথে দেখুন.",82);
        return pack("caution","High calculated osmolality","উচ্চ calculated osmolality","Above a common reference range.","Common reference range-এর উপরে।","Consider hydration, sodium, glucose and renal status.","Hydration, sodium, glucose ও renal status দেখুন.",40);

      case "map":
        if(v<65) return pack("negative","Low MAP","কম MAP","MAP below about 65 mmHg may be inadequate for organ perfusion in some acute-care contexts.","কিছু acute-care context-এ MAP প্রায় 65 mmHg-এর নিচে organ perfusion-এর জন্য কম হতে পারে।","If this reflects a real blood pressure reading and you feel unwell, seek clinical assessment.","Real BP reading হলে এবং অসুস্থ লাগলে clinical assessment নিন.",25);
        if(v<=100) return pack("positive","Common resting range","সাধারণ resting range","MAP is within a broad commonly observed resting range.","MAP broad commonly observed resting range-এর মধ্যে।","Interpret with the actual systolic/diastolic readings.","Actual systolic/diastolic reading-এর সাথে দেখুন.",82);
        return pack("caution","Elevated MAP","উচ্চ MAP","MAP is elevated and may reflect higher average arterial pressure.","MAP elevated, যা higher average arterial pressure বোঝাতে পারে।","Confirm with repeated standardized BP measurements.","Standardized repeated BP measurement দিয়ে confirm করুন.",42);

      case "pulse-pressure":
        if(v<30) return pack("caution","Narrow pulse pressure","Narrow pulse pressure","A narrow pulse pressure can occur in several physiologic or clinical states.","Narrow pulse pressure বিভিন্ন physiologic/clinical state-এ হতে পারে।","Interpret with BP, symptoms and age.","BP, symptoms ও age-এর সাথে দেখুন.",45);
        if(v<=60) return pack("positive","Common pulse-pressure range","সাধারণ pulse-pressure range","Pulse pressure is within a broad commonly observed adult range.","Pulse pressure broad common adult range-এর মধ্যে।","Track alongside systolic BP.","Systolic BP-এর সাথে trend দেখুন.",80);
        return pack("caution","Wide pulse pressure","Wide pulse pressure","A wider pulse pressure, especially in older adults, can reflect arterial stiffness or other factors.","বিশেষ করে older adult-এ wide pulse pressure arterial stiffness বা অন্য factor-এর সাথে সম্পর্কিত হতে পারে।","Confirm with repeated BP readings.","Repeated BP reading দিয়ে confirm করুন.",44);

      case "target-heart-rate":
      case "pace":
      case "one-rep-max":
        return pack("info","Training estimate","ট্রেনিং estimate","This is a performance/planning estimate, not a health diagnosis.","এটি performance/planning estimate, health diagnosis নয়।","Use perceived exertion, technique, recovery and medical context.","Perceived exertion, technique, recovery ও medical context দেখুন.",72);

      case "pregnancy-due-date":
      case "gestational-age":
      case "ovulation":
      case "fertile-window":
        return pack("info","Date estimate","তারিখের estimate","This is a calendar estimate. Cycle variability, ultrasound dating and clinical information can change the interpretation.","এটি calendar estimate। Cycle variability, ultrasound dating ও clinical information অনুযায়ী interpretation বদলাতে পারে।","Use clinical dating for pregnancy care decisions.","Pregnancy care decision-এর জন্য clinical dating ব্যবহার করুন.",70);

      case "fib4":
        if(v<1.3) return pack("positive","Lower-risk FIB-4 zone","Lower-risk FIB-4 zone","In many adult pathways, FIB-4 below 1.3 is a lower-risk zone for advanced fibrosis. Age changes interpretation.","অনেক adult pathway-এ FIB-4 1.3-এর নিচে advanced fibrosis-এর lower-risk zone। Age অনুযায়ী interpretation বদলায়।","Use age-appropriate thresholds and clinical context.","Age-appropriate threshold ও clinical context ব্যবহার করুন.",82);
        if(v<=2.67) return pack("caution","Indeterminate FIB-4 zone","Indeterminate FIB-4 zone","This is an intermediate/indeterminate zone in many pathways.","অনেক pathway-এ এটি intermediate/indeterminate zone।","Further fibrosis assessment may be appropriate depending on context.","Context অনুযায়ী further fibrosis assessment উপকারী হতে পারে.",48);
        return pack("negative","Higher-risk FIB-4 zone","Higher-risk FIB-4 zone","FIB-4 above 2.67 is a higher-risk zone in many adult pathways, though age and disease context matter.","অনেক adult pathway-এ FIB-4 2.67-এর উপরে higher-risk zone, তবে age ও disease context গুরুত্বপূর্ণ।","Clinical liver assessment is appropriate.","Clinical liver assessment উপকারী.",26);

      case "apri":
        return pack("info","Fibrosis screening index","Fibrosis screening index","APRI is a liver-fibrosis screening index mainly studied in chronic liver disease. Threshold performance varies by disease and setting.","APRI chronic liver disease-এ studied fibrosis screening index। Disease ও setting অনুযায়ী threshold performance বদলায়।","Do not interpret without liver-disease context.","Liver-disease context ছাড়া interpret করবেন না.",58);

      case "nitrogen-balance":
        if(v>2) return pack("positive","Positive nitrogen balance","Positive nitrogen balance","Positive balance suggests nitrogen retention/anabolism, though measurement errors are common.","Positive balance nitrogen retention/anabolism-এর ইঙ্গিত দিতে পারে, তবে measurement error common।","Use trends and clinical context.","Trend ও clinical context দেখুন.",78);
        if(v>=-2) return pack("info","Near neutral balance","Near-neutral balance","This is near neutral nitrogen balance.","এটি near-neutral nitrogen balance।","Interpret with illness, energy intake and protein target.","Illness, energy intake ও protein target-এর সাথে দেখুন.",68);
        return pack("caution","Negative nitrogen balance","Negative nitrogen balance","Negative balance suggests net nitrogen loss/catabolism or inadequate intake, depending on context.","Negative balance net nitrogen loss/catabolism বা inadequate intake বোঝাতে পারে।","Review protein, energy adequacy and clinical stress.","Protein, energy adequacy ও clinical stress review করুন.",42);

      case "glucose-infusion-rate":
        if(v<2) return pack("info","Low GIR","কম GIR","This is a relatively low glucose infusion rate for many adult parenteral-nutrition contexts.","অনেক adult PN context-এর জন্য এটি তুলনামূলক low GIR।","Assess total energy and clinical goal.","Total energy ও clinical goal দেখুন.",60);
        if(v<=5) return pack("positive","Common adult PN range","Common adult PN range","This falls within a commonly used adult glucose-infusion range, though needs vary by clinical state.","এটি common adult glucose-infusion range-এর মধ্যে, তবে clinical state অনুযায়ী need বদলায়।","Monitor glucose, triglycerides and tolerance.","Glucose, triglyceride ও tolerance monitor করুন.",80);
        return pack("caution","High GIR","উচ্চ GIR","Higher GIR may increase risk of hyperglycemia or overfeeding in some patients.","Higher GIR কিছু patient-এ hyperglycemia বা overfeeding risk বাড়াতে পারে।","Clinical monitoring is important.","Clinical monitoring গুরুত্বপূর্ণ.",40);

      case "maintenance-fluid-child":
      case "mid-parental-height":
        return pack("info","Pediatric estimate","Pediatric estimate","This is a pediatric reference estimate and should not replace growth-chart or clinical assessment.","এটি pediatric reference estimate; growth chart বা clinical assessment-এর বিকল্প নয়।","Use age-appropriate pediatric references.","Age-appropriate pediatric reference ব্যবহার করুন.",68);

      case "child-growth-z-learning":
        if(v<-2) return pack("caution","Below −2 z-score","−2 z-score-এর নিচে","If the reference mean/SD you entered are appropriate, this result is more than 2 SD below the reference mean.","আপনার reference mean/SD appropriate হলে result reference mean-এর 2 SD-এর বেশি নিচে।","For child growth, use official age/sex-specific growth standards.","Child growth-এর জন্য official age/sex-specific growth standard ব্যবহার করুন.",38);
        if(v<=2) return pack("positive","Within ±2 z-score","±2 z-score-এর মধ্যে","If the reference values are appropriate, this lies within ±2 SD of the reference mean.","Reference value appropriate হলে result mean-এর ±2 SD-এর মধ্যে।","Clinical child growth still requires official reference tables and trend.","Clinical child growth-এর জন্য official reference table ও trend দরকার.",80);
        return pack("caution","Above +2 z-score","+2 z-score-এর উপরে","If the entered reference is appropriate, this is more than 2 SD above the mean.","Entered reference appropriate হলে mean-এর 2 SD-এর বেশি উপরে।","Use official growth references for interpretation.","Official growth reference ব্যবহার করুন.",38);

      case "ckm-risk-explorer":
      case "kidney-risk-factor-explorer":
      case "sarcopenia-nutrition-screen":{
        if(v<25) return pack("positive","Lower concern band","Lower concern band","This original SHUDDHO educational score falls in the lower concern band. It is not a validated event-probability model.","Original SHUDDHO educational score lower concern band-এ। এটি validated event-probability model নয়।","Use standard clinical measures for decisions.","Decision-এর জন্য standard clinical measure ব্যবহার করুন.",86);
        if(v<50) return pack("info","Moderate concern band","Moderate concern band","Several entered risk factors are contributing to the score.","কয়েকটি entered risk factor score-এ contribution দিচ্ছে।","Focus on the modifiable factors driving the score.","যে modifiable factor score বাড়াচ্ছে সেগুলোতে focus করুন.",62);
        if(v<75) return pack("caution","Higher concern band","Higher concern band","Multiple risk factors are contributing substantially to this educational score.","একাধিক risk factor educational score-এ substantial contribution দিচ্ছে।","A structured health review is reasonable.","Structured health review উপকারী.",38);
        return pack("negative","Very high concern band","Very high concern band","The entered risk-factor pattern produces a very high educational score.","Entered risk-factor pattern খুব high educational score তৈরি করেছে।","Use validated clinical assessment for real risk estimation.","Real risk estimation-এর জন্য validated clinical assessment ব্যবহার করুন.",18);
      }

      case "personalized-nutrition-profile":
      case "microbiome-diversity-score":
      case "protein-distribution-score":
      case "sleep-nutrition-recovery":
      case "metabolic-flexibility-score":{
        if(v>=75) return pack("positive","Strong lifestyle pattern","ভালো lifestyle pattern","Your inputs produce a strong score in this original SHUDDHO lifestyle model.","Original SHUDDHO lifestyle model-এ আপনার input strong score দিয়েছে।","Maintain the strong domains and improve any weak ones.","Strong domain বজায় রাখুন, weak domain উন্নত করুন.",88);
        if(v>=50) return pack("info","Mixed / moderate pattern","মিশ্র / মাঝারি pattern","Some domains are strong while others leave room for improvement.","কিছু domain ভালো, কিছু domain উন্নতির সুযোগ আছে।","Target the lowest-scoring habits first.","সবচেয়ে দুর্বল habit আগে improve করুন.",62);
        return pack("caution","Needs improvement","উন্নতির প্রয়োজন","Several lifestyle inputs are below the model’s favorable range.","কয়েকটি lifestyle input model-এর favorable range-এর নিচে।","Choose one or two realistic changes rather than changing everything at once.","সব একসাথে না বদলে ১–২টি বাস্তবসম্মত change বেছে নিন.",36);
      }

      case "plant-diversity":
        return pack(v>=30?"positive":v>=20?"info":"caution",
          v>=30?"High weekly plant variety":v>=20?"Moderate plant variety":"Low plant variety",
          v>=30?"উচ্চ plant variety":v>=20?"মাঝারি plant variety":"কম plant variety",
          "Greater diversity of plant foods can support dietary variety and microbiome substrate diversity. There is no universal clinical cutoff.",
          "বেশি ধরনের plant food dietary variety ও microbiome substrate diversity বাড়াতে সহায়তা করতে পারে। Universal clinical cutoff নেই।",
          "Increase variety gradually across vegetables, fruits, legumes, whole grains, nuts, seeds, herbs and spices.",
          "Vegetable, fruit, legume, whole grain, nuts, seeds, herbs ও spice-এর variety ধীরে বাড়ান.",v>=30?86:v>=20?64:40);

      case "sodium-target":
        if(r.difference<=0) return pack("positive","At or below selected sodium target","Selected sodium target-এর মধ্যে",`Your entered intake is ${Math.abs(Math.round(r.difference))} mg/day at or below the selected target.`,`Entered intake selected target-এর তুলনায় ${Math.abs(Math.round(r.difference))} mg/day কম বা সমান।`,"Remember that appropriate targets can differ by condition and guideline.","Condition ও guideline অনুযায়ী target ভিন্ন হতে পারে.",84);
        return pack("caution","Above selected sodium target","Selected sodium target-এর উপরে",`Your entered intake is about ${Math.round(r.difference)} mg/day above the selected target.`,`Entered intake selected target-এর তুলনায় প্রায় ${Math.round(r.difference)} mg/day বেশি।`,"Look for major sodium sources such as packaged foods, sauces and restaurant meals.","Packaged food, sauce ও restaurant meal-এর sodium source দেখুন.",42);

      case "potassium-intake":
        if(r.gap<=0) return pack("positive","At or above selected potassium target","Selected potassium target পূরণ",`Your entered intake meets or exceeds the selected target by about ${Math.abs(Math.round(r.gap))} mg/day.`,`Entered intake selected target প্রায় ${Math.abs(Math.round(r.gap))} mg/day পূরণ/অতিক্রম করেছে।`,"Kidney disease and some medicines can require individualized potassium advice.","Kidney disease ও কিছু medicine-এ individualized potassium advice লাগে.",84);
        return pack("caution","Below selected potassium target","Selected potassium target-এর নিচে",`Your entered intake is about ${Math.round(r.gap)} mg/day below the selected target.`,`Entered intake selected target-এর তুলনায় প্রায় ${Math.round(r.gap)} mg/day কম।`,"Food-based potassium sources may help if medically appropriate.","Medically appropriate হলে food-based potassium source বাড়ানো যায়.",46);

      default:
        return pack("info","Calculated result","হিসাবকৃত ফলাফল","This result is an estimate from the selected formula. A single calculator should not be used as a diagnosis.","এই ফলাফল selected formula থেকে পাওয়া estimate। একটি calculator একা diagnosis হিসেবে ব্যবহার করা উচিত নয়।","Use trends and the surrounding health context.","Trend ও surrounding health context-এর সাথে দেখুন.",65);
    }
  }

  return {interpret};
})();
