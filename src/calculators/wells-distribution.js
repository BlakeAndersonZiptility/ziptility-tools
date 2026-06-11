/* Wells & Distribution calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

  { id:"drawdown", cat:"Wells & Distribution", domains:["water"], title:"Drawdown / Specific Capacity", formula:"Depth = Airline − (psi × 2.3067)\nSC = Yield ÷ Drawdown", note:"Airline method. Enter airline + psi readings + yield.",
    fields:[{k:"air",label:"Air line ft"},{k:"poff",label:"psi pump OFF"},{k:"pon",label:"psi pump ON"},{k:"gpm",label:"GPM yield"},{k:"stat",label:"Static depth ft"},{k:"pump",label:"Pumping depth ft"},{k:"dd",label:"Drawdown ft"},{k:"sc",label:"GPM/ft (SC)"}],
    solve:(v)=>{ const values={}, computed=[]; let stat=v.stat, pump=v.pump;
      if(v.air!=null&&v.poff!=null){ stat=v.air-(v.poff*PSI2FT); values.stat=stat; computed.push("stat"); }
      if(v.air!=null&&v.pon!=null){ pump=v.air-(v.pon*PSI2FT); values.pump=pump; computed.push("pump"); }
      if(stat==null||pump==null) return {values:{},computed:[],error:"Need static & pumping depth (or airline + psi)."};
      const dd=pump-stat; values.dd=dd; computed.push("dd"); if(v.gpm!=null){ values.sc=dd!==0?v.gpm/dd:NaN; computed.push("sc"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.sc==null) return null; return {level:"info",text:"Track specific capacity over time — a steady decline usually signals well screen or pump fouling."}; }},
  { id:"water-loss", cat:"Wells & Distribution", domains:["water"], title:"Water Loss Summary", formula:"Pumped − Accounted = Lost", note:"Same units. Enter total pumped + the parts you know.",
    fields:[{k:"pump",label:"Total pumped"},{k:"met",label:"Metered"},{k:"unmet",label:"Unmetered"},{k:"leak",label:"Leaked"},{k:"other",label:"Other"},{k:"acct",label:"Accounted"},{k:"lost",label:"Amount lost"},{k:"pct",label:"% lost"}],
    solve:(v)=>{ if(v.pump==null) return {values:{},computed:[],error:"Enter total pumped."};
      const acct=(v.met||0)+(v.unmet||0)+(v.leak||0)+(v.other||0); const lost=v.pump-acct, pct=v.pump!==0?lost/v.pump*100:NaN;
      return {values:{acct,lost,pct},computed:["acct","lost","pct"],error:""}; },
    interpret:(m)=>{ if(m.pct==null||!isFinite(m.pct)) return null; if(m.pct<10) return {level:"good",text:"Under 10% — generally considered low, well-controlled loss."};
      if(m.pct<=20) return {level:"watch",text:"10–20% — worth investigating; check metering accuracy and known leaks."}; return {level:"alert",text:"Over 20% — high loss. Prioritize leak detection and meter testing."}; }},
  { id:"water-use", cat:"Wells & Distribution", domains:["water"], title:"Water Use (gpcd)", formula:"Water produced gpd ÷ Population = gpcd", note:"Gallons per capita per day. Enter any two values.",
    fields:[{k:"gpd",label:"Produced gpd"},{k:"pop",label:"Population"},{k:"gpcd",label:"gpcd"}],
    solve:(v)=>{ if(v.gpd!=null&&v.pop!=null) return {values:{gpcd:v.gpd/v.pop},computed:["gpcd"],error:""};
      if(v.gpd!=null&&v.gpcd!=null) return {values:{pop:v.gpd/v.gpcd},computed:["pop"],error:""};
      if(v.pop!=null&&v.gpcd!=null) return {values:{gpd:v.pop*v.gpcd},computed:["gpd"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.gpcd==null) return null; return {level:"info",text:"U.S. residential average is roughly 80–100 gpcd; whole-system numbers vary with industry and losses."}; }}
];
