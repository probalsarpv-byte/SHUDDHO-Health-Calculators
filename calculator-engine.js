window.SHCALC=(function(){const n=x=>Number(x),out=(value,unit="",extra={})=>({value:Number.isFinite(value)?value:null,unit,...extra});const calc={
bmi:i=>out(n(i.weight_kg)/((n(i.height_cm)/100)**2),"kg/m²"),
"healthy-weight":i=>{const h=n(i.height_cm)/100;return{low:18.5*h*h,high:24.9*h*h,unit:"kg"}},
"ideal-body-weight":i=>{const inch=n(i.height_cm)/2.54;return out((i.sex==="female"?45.5:50)+2.3*Math.max(0,inch-60),"kg")},
"adjusted-body-weight":i=>{const inch=n(i.height_cm)/2.54,ibw=(i.sex==="female"?45.5:50)+2.3*Math.max(0,inch-60);return out(ibw+.4*(n(i.weight_kg)-ibw),"kg",{ibw})},
"lean-body-mass":i=>out(i.sex==="female"?.252*n(i.weight_kg)+.473*n(i.height_cm)-48.3:.407*n(i.weight_kg)+.267*n(i.height_cm)-19.2,"kg"),
"body-fat-navy":i=>{const h=n(i.height_cm),w=n(i.waist_cm),neck=n(i.neck_cm),hip=n(i.hip_cm);const v=i.sex==="female"?495/(1.29579-.35004*Math.log10(w+hip-neck)+.221*Math.log10(h))-450:495/(1.0324-.19077*Math.log10(w-neck)+.15456*Math.log10(h))-450;return out(v,"%")},
"waist-height-ratio":i=>out(n(i.waist_cm)/n(i.height_cm),""),
"waist-hip-ratio":i=>out(n(i.waist_cm)/n(i.hip_cm),""),
absi:i=>{const h=n(i.height_cm)/100,b=n(i.weight_kg)/(h*h);return out((n(i.waist_cm)/100)/(Math.pow(b,2/3)*Math.sqrt(h)),"")},
bai:i=>out(n(i.hip_cm)/Math.pow(n(i.height_cm)/100,1.5)-18,"%"),
ffmi:i=>{const h=n(i.height_cm)/100,ffm=n(i.weight_kg)*(1-n(i.body_fat_pct)/100);return out(ffm/(h*h),"kg/m²")},
"bmr-mifflin":i=>out(10*n(i.weight_kg)+6.25*n(i.height_cm)-5*n(i.age)+(i.sex==="female"?-161:5),"kcal/day"),
tdee:i=>{const b=10*n(i.weight_kg)+6.25*n(i.height_cm)-5*n(i.age)+(i.sex==="female"?-161:5);return out(b*n(i.activity_factor),"kcal/day",{bmr:b})},
"calorie-deficit":i=>out(n(i.tdee)-n(i.deficit_kcal),"kcal/day"),
protein:i=>out(n(i.weight_kg)*n(i.protein_factor),"g/day"),
water:i=>out(n(i.weight_kg)*n(i.water_ml_per_kg),"mL/day"),
fiber:i=>out(n(i.calories)*14/1000,"g/day"),
macro:i=>({protein_g:n(i.calories)*n(i.protein_pct)/100/4,carb_g:n(i.calories)*n(i.carb_pct)/100/4,fat_g:n(i.calories)*n(i.fat_pct)/100/9}),
carbohydrate:i=>out(n(i.calories)*n(i.carb_pct)/100/4,"g/day"),
"fat-intake":i=>out(n(i.calories)*n(i.fat_pct)/100/9,"g/day"),
"meal-protein":i=>out(n(i.daily_protein_g)/n(i.meals),"g/meal"),
"hba1c-eag":i=>out(28.7*n(i.hba1c)-46.7,"mg/dL"),
"eag-hba1c":i=>out((n(i.eag_mgdl)+46.7)/28.7,"%"),
"homa-ir":i=>out(n(i.fasting_glucose_mgdl)*n(i.fasting_insulin)/405,""),
quicki:i=>out(1/(Math.log10(n(i.fasting_insulin))+Math.log10(n(i.fasting_glucose_mgdl))),""),
tyg:i=>out(Math.log(n(i.triglycerides_mgdl)*n(i.fasting_glucose_mgdl)/2),""),
"tg-hdl":i=>out(n(i.triglycerides_mgdl)/n(i.hdl_mgdl),""),
"non-hdl":i=>out(n(i.total_chol_mgdl)-n(i.hdl_mgdl),"mg/dL"),
"remnant-cholesterol":i=>out(n(i.total_chol_mgdl)-n(i.ldl_mgdl)-n(i.hdl_mgdl),"mg/dL"),
"egfr-2021":i=>{const s=n(i.creatinine_mgdl),a=n(i.age),f=i.sex==="female",k=f?.7:.9,alpha=f?-.241:-.302;return out(142*Math.pow(Math.min(s/k,1),alpha)*Math.pow(Math.max(s/k,1),-1.2)*Math.pow(.9938,a)*(f?1.012:1),"mL/min/1.73m²")},
crcl:i=>out(((140-n(i.age))*n(i.weight_kg)/(72*n(i.creatinine_mgdl)))*(i.sex==="female"?.85:1),"mL/min"),
bsa:i=>out(Math.sqrt(n(i.height_cm)*n(i.weight_kg)/3600),"m²"),
uacr:i=>out(n(i.urine_albumin_mgL)/n(i.urine_creatinine_gL),"mg/g"),
"anion-gap":i=>out(n(i.sodium)-(n(i.chloride)+n(i.bicarbonate)),"mEq/L"),
"corrected-calcium":i=>out(n(i.calcium_mgdl)+.8*(4-n(i.albumin_gdl)),"mg/dL"),
"corrected-sodium":i=>out(n(i.sodium)+1.6*((n(i.glucose_mgdl)-100)/100),"mEq/L"),
"serum-osmolality":i=>out(2*n(i.sodium)+n(i.glucose_mgdl)/18+n(i.bun_mgdl)/2.8,"mOsm/kg"),
map:i=>out(n(i.dbp)+(n(i.sbp)-n(i.dbp))/3,"mmHg"),
"pulse-pressure":i=>out(n(i.sbp)-n(i.dbp),"mmHg"),
"target-heart-rate":i=>{const max=220-n(i.age),r=max-n(i.resting_hr);return{low:r*n(i.intensity_low)+n(i.resting_hr),high:r*n(i.intensity_high)+n(i.resting_hr),unit:"bpm"}},
pace:i=>out(n(i.time_min)/n(i.distance_km),"min/km"),
"one-rep-max":i=>out(n(i.lift_weight_kg)*(1+n(i.reps)/30),"kg"),
"pregnancy-due-date":i=>{const d=new Date(i.lmp_date);d.setDate(d.getDate()+280);return{date:d.toISOString().slice(0,10)}},
"gestational-age":i=>out((new Date()-new Date(i.lmp_date))/(86400000*7),"weeks"),
ovulation:i=>{const d=new Date(i.cycle_start_date);d.setDate(d.getDate()+n(i.cycle_length)-14);return{date:d.toISOString().slice(0,10)}},
"fertile-window":i=>{const o=new Date(i.cycle_start_date);o.setDate(o.getDate()+n(i.cycle_length)-14);const a=new Date(o),b=new Date(o);a.setDate(a.getDate()-5);b.setDate(b.getDate()+1);return{start:a.toISOString().slice(0,10),end:b.toISOString().slice(0,10)}},
fib4:i=>out(n(i.age)*n(i.ast)/(n(i.platelets)*Math.sqrt(n(i.alt))),""),
apri:i=>out((n(i.ast)/n(i.ast_uln))/n(i.platelets)*100,""),
"nitrogen-balance":i=>out(n(i.protein_g)/6.25-(n(i.uun_g)+4),"g N/day"),
"glucose-infusion-rate":i=>out(n(i.dextrose_g_day)*1000/(n(i.weight_kg)*1440),"mg/kg/min"),
"maintenance-fluid-child":i=>{let w=n(i.weight_kg),ml=w<=10?w*100:w<=20?1000+(w-10)*50:1500+(w-20)*20;return out(ml,"mL/day")},
"mid-parental-height":i=>out((n(i.father_height_cm)+n(i.mother_height_cm)+(i.sex==="male"?13:-13))/2,"cm"),
"older-adult-protein":i=>out(n(i.weight_kg)*n(i.protein_factor),"g/day")

,"ckm-risk-explorer":i=>{let s=0;s+=Math.min(20,Math.max(0,(n(i.age)-35)*.35));s+=Math.min(18,Math.max(0,(n(i.sbp)-110)*.3));s+=i.smoker?15:0;s+=i.diabetes?18:0;s+=Math.min(10,Math.max(0,(n(i.bmi)-23)*1.2));s+=Math.min(10,Math.max(0,(n(i.non_hdl)-100)*.08));s+=Math.min(9,Math.max(0,(90-n(i.egfr))*.15));return out(Math.max(0,Math.min(100,s)),"/100")}
,"child-growth-z-learning":i=>out((n(i.measurement)-n(i.reference_mean))/n(i.reference_sd),"z")
,"kidney-risk-factor-explorer":i=>{let s=0;s+=Math.min(15,Math.max(0,(n(i.age)-40)*.3));s+=Math.min(35,Math.max(0,(90-n(i.egfr))*.55));s+=Math.min(25,Math.max(0,Math.log10(Math.max(1,n(i.uacr)))*8));s+=i.diabetes?12:0;s+=Math.min(13,Math.max(0,(n(i.sbp)-120)*.25));return out(Math.max(0,Math.min(100,s)),"/100")}
,"personalized-nutrition-profile":i=>{const p=Math.min(100,20+Math.min(20,n(i.activity_days)*3)+Math.min(20,n(i.sleep_hours)*2.2)+Math.min(15,n(i.fruitveg_servings)*3)+Math.min(15,n(i.protein_g)/Math.max(1,n(i.weight_kg))*10)+Math.min(10,n(i.fiber_g)/3));return out(p,"/100")}
,"microbiome-diversity-score":i=>{const s=Math.min(60,n(i.plant_variety_week)*2)+Math.min(20,n(i.fermented_servings_week)*2)+Math.min(20,n(i.fiber_g)*.7);return out(Math.min(100,s),"/100")}
,"sarcopenia-nutrition-screen":i=>{let s=0;s+=n(i.age)>=65?20:0;s+=n(i.protein_g)/Math.max(1,n(i.weight_kg))<1?25:0;s+=n(i.strength_days)<2?20:0;s+=Math.min(35,Math.max(0,n(i.weight_loss_pct)*5));return out(Math.min(100,s),"/100")}
,"protein-distribution-score":i=>{const a=[n(i.breakfast_protein),n(i.lunch_protein),n(i.dinner_protein)],m=(a[0]+a[1]+a[2])/3,dev=(Math.abs(a[0]-m)+Math.abs(a[1]-m)+Math.abs(a[2]-m))/3;return out(Math.max(0,100-(dev/Math.max(1,m))*100),"/100")}
,"plant-diversity":i=>out(n(i.plant_variety_week),"plants/week")
,"sodium-target":i=>({difference:n(i.sodium_mg)-n(i.target_mg),unit:"mg/day"})
,"potassium-intake":i=>({gap:n(i.target_mg)-n(i.potassium_mg),unit:"mg/day"})
,"sleep-nutrition-recovery":i=>{const s=Math.min(30,n(i.sleep_hours)/8*30)+Math.min(25,n(i.protein_g)/Math.max(1,n(i.protein_target_g))*25)+Math.min(20,n(i.water_ml)/Math.max(1,n(i.water_target_ml))*20)+Math.min(25,n(i.activity_days)/5*25);return out(Math.min(100,s),"/100")}
,"metabolic-flexibility-score":i=>{let s=100;s-=Math.max(0,(n(i.waist_height_ratio)-.5)*120);s-=Math.max(0,(n(i.triglycerides_mgdl)-150)*.08);s-=Math.max(0,(50-n(i.hdl_mgdl))*.4);s-=Math.max(0,(n(i.fasting_glucose_mgdl)-100)*.35);s+=Math.min(10,n(i.activity_days)*2);return out(Math.max(0,Math.min(100,s)),"/100")}
};return{calculate:(id,inputs)=>{if(!calc[id])throw new Error("Calculator not implemented");return calc[id](inputs)},ids:Object.keys(calc)}})();