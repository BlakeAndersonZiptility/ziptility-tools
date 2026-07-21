/* Wells & Distribution calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834, Q_HYD } from '../constants.js';

export default [

  { id:"drawdown", cat:"Wells & Distribution", domains:["water"], title:"Drawdown / Specific Capacity", formula:"Depth = Airline − (psi × 2.3067)\nSC = Yield ÷ Drawdown", note:"Airline method. Enter airline + psi readings + yield.",
    fields:[{k:"air",label:"Air line ft"},{k:"poff",label:"psi pump OFF"},{k:"pon",label:"psi pump ON"},{k:"gpm",label:"GPM yield"},{k:"stat",label:"Static depth ft"},{k:"pump",label:"Pumping depth ft"},{k:"dd",label:"Drawdown ft"},{k:"sc",label:"GPM/ft (SC)"}],
    solve:(v)=>{ const values={}, computed=[]; let stat=v.stat, pump=v.pump;
      if(v.air!=null&&v.poff!=null){ stat=v.air-(v.poff*PSI2FT); values.stat=stat; computed.push("stat"); }
      if(v.air!=null&&v.pon!=null){ pump=v.air-(v.pon*PSI2FT); values.pump=pump; computed.push("pump"); }
      if(stat==null||pump==null) return {values:{},computed:[],error:"Need static & pumping depth (or airline + psi)."};
      const dd=pump-stat; values.dd=dd; computed.push("dd"); if(v.gpm!=null){ values.sc=dd!==0?v.gpm/dd:NaN; computed.push("sc"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.sc==null) return null; return {level:"info",text:"Track specific capacity over time: a steady decline usually signals well screen or pump fouling."}; }},
  { id:"water-loss", cat:"Wells & Distribution", domains:["water"], title:"Water Loss Summary", formula:"Pumped − Accounted = Lost", note:"Same units. Enter total pumped + the parts you know.",
    fields:[{k:"pump",label:"Total pumped"},{k:"met",label:"Metered"},{k:"unmet",label:"Unmetered"},{k:"leak",label:"Leaked"},{k:"other",label:"Other"},{k:"acct",label:"Accounted"},{k:"lost",label:"Amount lost"},{k:"pct",label:"% lost"}],
    solve:(v)=>{ if(v.pump==null) return {values:{},computed:[],error:"Enter total pumped."};
      const acct=(v.met||0)+(v.unmet||0)+(v.leak||0)+(v.other||0); const lost=v.pump-acct, pct=v.pump!==0?lost/v.pump*100:NaN;
      return {values:{acct,lost,pct},computed:["acct","lost","pct"],error:""}; },
    interpret:(m)=>{ if(m.pct==null||!isFinite(m.pct)) return null; if(m.pct<10) return {level:"good",text:"Under 10%: generally considered low, well-controlled loss."};
      if(m.pct<=20) return {level:"watch",text:"10–20%: worth investigating; check metering accuracy and known leaks."}; return {level:"alert",text:"Over 20%: high loss. Prioritize leak detection and meter testing."}; }},
  { id:"water-use", cat:"Wells & Distribution", domains:["water"], title:"Water Use (gpcd)", formula:"Water produced gpd ÷ Population = gpcd", note:"Gallons per capita per day. Enter any two values.",
    fields:[{k:"gpd",label:"Produced gpd"},{k:"pop",label:"Population"},{k:"gpcd",label:"gpcd"}],
    solve:(v)=>{ if(v.gpd!=null&&v.pop!=null) return {values:{gpcd:v.gpd/v.pop},computed:["gpcd"],error:""};
      if(v.gpd!=null&&v.gpcd!=null) return {values:{pop:v.gpd/v.gpcd},computed:["pop"],error:""};
      if(v.pop!=null&&v.gpcd!=null) return {values:{gpd:v.pop*v.gpcd},computed:["gpd"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.gpcd==null) return null; return {level:"info",text:"U.S. residential average is roughly 80–100 gpcd; whole-system numbers vary with industry and losses."}; }},
  { id:"customer-leak", cat:"Wells & Distribution", domains:["water"], title:"Customer Leak Estimator", formula:"gal/day = gal/hr × 24 · $/month = gal/month ÷ 1000 × $/1000 gal", note:"Enter the leak rate any way you have it (meter sweep gal/hr works well). Add your rate for the bill impact.",
    fields:[{k:"gph",label:"Leak gal/hr"},{k:"gpd",label:"Gallons/day"},{k:"gpmo",label:"Gallons/month"},{k:"rate",label:"Rate $/1000 gal"},{k:"cost",label:"Cost $/month"}],
    solve:(v)=>{ let gpd=null, src=null;
      if(v.gph!=null){ gpd=v.gph*24; src="gph"; } else if(v.gpd!=null){ gpd=v.gpd; src="gpd"; } else if(v.gpmo!=null){ gpd=v.gpmo/30; src="gpmo"; }
      else return {values:{},computed:[],error:"Enter a leak rate (gal/hr, gal/day, or gal/month)."};
      const values={gph:gpd/24, gpd, gpmo:gpd*30}, computed=[];
      for(const k of ["gph","gpd","gpmo"]) if(k!==src) computed.push(k);
      if(v.rate!=null){ values.cost=values.gpmo/1000*v.rate; computed.push("cost"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.gpd==null) return null; return {level:"info",text:"For scale (EPA WaterSense): a dripping faucet wastes ~3,000 gal/yr; a running toilet ~200 gal/day."}; },
    links:[{label:"EPA WaterSense: Fix a Leak",href:"https://www.epa.gov/watersense/fix-leak-week"}]},
  { id:"break-loss", cat:"Wells & Distribution", domains:["water"], title:"Main Break / Repair Loss", formula:"gpm ≈ 29.83 × C × d² × √psi\nTotal gal = gpm × minutes + flushing gal", note:"Order-of-magnitude estimate for incident reporting, not billing. C defaults to 0.6 (sharp-edged opening).",
    fields:[{k:"d",label:"Opening dia",unit:"length",def:"in",units:["in","mm","cm"]},{k:"c",label:"Orifice coeff C"},{k:"psi",label:"Pressure psi"},{k:"gpm",label:"Est. flow gpm"},{k:"mins",label:"Duration min"},{k:"flush",label:"Flushing gal"},{k:"total",label:"Total gal lost"}],
    solve:(v)=>{ const cc=(v.c!=null&&v.c!==0)?v.c:0.6; let gpm=v.gpm; const values={}, computed=[];
      if(v.d!=null&&v.psi!=null){ if(v.psi<0) return {values:{},computed:[],error:"Pressure can't be negative."};
        const din=v.d*12; gpm=Q_HYD*cc*din*din*Math.sqrt(v.psi); values.gpm=gpm; computed.push("gpm"); if(v.c==null){ values.c=0.6; computed.push("c"); } }
      if(gpm==null) return {values:{},computed:[],error:"Enter opening size + pressure (or an estimated gpm)."};
      if(v.mins!=null){ values.total=gpm*v.mins+(v.flush||0); computed.push("total"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.gpm==null&&m.total==null) return null; return {level:"info",text:"Treat this as a reporting estimate: actual loss depends on the opening shape and how pressure held during the event."}; }},
  { id:"capacity-assessment", cat:"Wells & Distribution", domains:["water"], title:"Capacity & Storage Assessment", formula:"Capacity ratio = Source ÷ Peak day\nStorage days = Storage ÷ Avg day", note:"Composite score is a Ziptility convention (60% capacity, 40% storage), not a published standard. Benchmarks: source ≥ peak-day demand; ~1 day of average demand in storage.",
    fields:[{k:"avg",label:"Avg day gpd"},{k:"peak",label:"Peak day gpd"},{k:"source",label:"Source gpd"},{k:"storage",label:"Storage gal"},{k:"capr",label:"Capacity ratio"},{k:"sdays",label:"Storage days"},{k:"capsub",label:"Capacity score"},{k:"storsub",label:"Storage score"},{k:"score",label:"Composite 0–100"}],
    solve:(v)=>{ const values={}, computed=[]; let capr=null, sdays=null;
      if(v.source!=null&&v.peak!=null&&v.peak!==0){ capr=v.source/v.peak; values.capr=capr; computed.push("capr"); }
      if(v.storage!=null&&v.avg!=null&&v.avg!==0){ sdays=v.storage/v.avg; values.sdays=sdays; computed.push("sdays"); }
      if(capr==null&&sdays==null) return {values:{},computed:[],error:"Enter demands plus source capacity and/or storage."};
      if(capr!=null&&sdays!=null){
        const capSub=Math.max(0,Math.min(100,(capr-0.5)/0.5*100)), storSub=Math.max(0,Math.min(100,sdays*100));
        values.capsub=capSub; values.storsub=storSub; values.score=0.6*capSub+0.4*storSub;
        computed.push("capsub","storsub","score"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.score==null){ if(m.capr==null) return null;
        return m.capr>=1 ? {level:"good",text:"Source meets peak-day demand (ratio ≥ 1.0). Add storage + avg day for the full score."}
          : {level:"watch",text:"Source is below peak-day demand. Add storage + avg day for the full score."}; }
      if(m.score>=85) return {level:"good",text:"Meets typical capacity & storage benchmarks (source ≥ peak day, ~1 day of storage)."};
      if(m.score>=60) return {level:"watch",text:"Marginal: source or storage sits below the usual benchmarks; review against growth and fire-flow needs."};
      return {level:"alert",text:"Source or storage shortfall: review your capacity development / capital improvement plan."}; },
    links:[{label:"EPA: Drinking water capacity development",href:"https://www.epa.gov/dwcapacity"}]}
];
