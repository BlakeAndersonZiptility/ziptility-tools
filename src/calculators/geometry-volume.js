/* Geometry & Volume calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

  { id:"area-rect", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Area — Rectangle", formula:"Length × Width = Area", note:"Enter any two values.",
    fields:[{k:"L",label:"Length",unit:"length",def:"ft"},{k:"W",label:"Width",unit:"length",def:"ft"},{k:"A",label:"Area",unit:"area",def:"sqft"}],
    solve:(v)=>{ if(v.L!=null&&v.W!=null) return {values:{A:v.L*v.W},computed:["A"],error:""};
      if(v.A!=null&&v.L!=null) return {values:{W:v.A/v.L},computed:["W"],error:""};
      if(v.A!=null&&v.W!=null) return {values:{L:v.A/v.W},computed:["L"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"area-triangle", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Area — Triangle", formula:"½ × Base × Height = Area", note:"Enter any two values.",
    fields:[{k:"b",label:"Base",unit:"length",def:"ft"},{k:"h",label:"Height",unit:"length",def:"ft"},{k:"A",label:"Area",unit:"area",def:"sqft"}],
    solve:(v)=>{ if(v.b!=null&&v.h!=null) return {values:{A:0.5*v.b*v.h},computed:["A"],error:""};
      if(v.A!=null&&v.b!=null) return {values:{h:2*v.A/v.b},computed:["h"],error:""};
      if(v.A!=null&&v.h!=null) return {values:{b:2*v.A/v.h},computed:["b"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"area-circle", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Area — Circle", formula:"0.785 × D²  (or)  π × R² = Area", note:"Enter one value.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"A",label:"Area",unit:"area",def:"sqft"}],
    solve:(v)=>{ let D=v.D,R=v.R,A=v.A,computed=[];
      if(D!=null){ R=D/2; A=PI4*D*D; computed=["R","A"]; } else if(R!=null){ D=2*R; A=Math.PI*R*R; computed=["D","A"]; }
      else if(A!=null){ R=Math.sqrt(A/Math.PI); D=2*R; computed=["D","R"]; } else return {values:{},computed:[],error:"Enter diameter, radius, or area."};
      return {values:{D,R,A},computed,error:""}; }},
  { id:"circumference", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Circumference", formula:"π × D = Circumference", note:"Enter one value.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"c",label:"Circumference",unit:"length",def:"ft"}],
    solve:(v)=>{ let D=v.D,R=v.R,c=v.c,computed=[];
      if(D!=null){ R=D/2; c=Math.PI*D; computed=["R","c"]; } else if(R!=null){ D=2*R; c=Math.PI*D; computed=["D","c"]; }
      else if(c!=null){ D=c/Math.PI; R=D/2; computed=["D","R"]; } else return {values:{},computed:[],error:"Enter one value."};
      return {values:{D,R,c},computed,error:""}; }},
  { id:"vol-box", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Rectangular Tank", formula:"L × W × H = Volume", note:"Enter 3 lengths — or a volume to back-solve.",
    fields:[{k:"L",label:"Length",unit:"length",def:"ft"},{k:"W",label:"Width",unit:"length",def:"ft"},{k:"H",label:"Height",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ if(v.L!=null&&v.W!=null&&v.H!=null) return {values:{V:v.L*v.W*v.H*C},computed:["V"],error:""};
      const cf=v.V!=null? v.V/C : null;
      if(cf!=null&&v.L!=null&&v.W!=null) return {values:{H:cf/(v.L*v.W)},computed:["H"],error:""};
      if(cf!=null&&v.L!=null&&v.H!=null) return {values:{W:cf/(v.L*v.H)},computed:["W"],error:""};
      if(cf!=null&&v.W!=null&&v.H!=null) return {values:{L:cf/(v.W*v.H)},computed:["L"],error:""};
      return {values:{},computed:[],error:"Enter 3 lengths, or a volume + 2 lengths."}; }},
  { id:"vol-cyl", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Cylinder", formula:"0.785 × D² × H = Volume", note:"Enter D (or R) + height — or a volume.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"H",label:"Height",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ let D=v.D,R=v.R,computed=[]; if(D!=null&&R==null){ R=D/2; computed.push("R"); } else if(R!=null&&D==null){ D=2*R; computed.push("D"); }
      const cf=v.V!=null? v.V/C : null;
      if(D!=null&&v.H!=null&&v.V==null){ computed.push("V"); return {values:{D,R,V:PI4*D*D*v.H*C},computed,error:""}; }
      if(cf!=null&&D!=null&&v.H==null){ computed.push("H"); return {values:{D,R,H:cf/(PI4*D*D)},computed,error:""}; }
      if(cf!=null&&v.H!=null&&D==null){ const d=Math.sqrt(cf/(PI4*v.H)); return {values:{D:d,R:d/2},computed:["D","R"],error:""}; }
      return {values:{},computed:[],error:"Enter D (or R) + H, or a volume."}; }},
  { id:"vol-cone", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Cone / Hopper", formula:"⅓ × 0.785 × D² × H = Volume", note:"Enter D (or R) + height.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"H",label:"Height",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ let D=v.D,R=v.R,computed=[]; if(D!=null&&R==null){ R=D/2; computed.push("R"); } else if(R!=null&&D==null){ D=2*R; computed.push("D"); }
      if(D!=null&&v.H!=null){ computed.push("V"); return {values:{D,R,V:(1/3)*PI4*D*D*v.H*C},computed,error:""}; }
      if(v.V!=null&&D!=null){ computed.push("H"); return {values:{D,R,H:(v.V/C)/((1/3)*PI4*D*D)},computed,error:""}; }
      return {values:{},computed:[],error:"Enter D (or R) + height."}; }},
  { id:"vol-sphere", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Sphere", formula:"(π ÷ 6) × D³ = Volume", note:"Enter diameter or radius.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ let D=v.D,R=v.R,computed=[]; if(D!=null&&R==null){ R=D/2; computed.push("R"); } else if(R!=null&&D==null){ D=2*R; computed.push("D"); }
      if(D!=null){ computed.push("V"); return {values:{D,R,V:(Math.PI/6)*D*D*D*C},computed,error:""}; }
      if(v.V!=null){ const d=Math.cbrt((v.V/C)*6/Math.PI); return {values:{D:d,R:d/2},computed:["D","R"],error:""}; }
      return {values:{},computed:[],error:"Enter diameter or radius."}; }}
];
