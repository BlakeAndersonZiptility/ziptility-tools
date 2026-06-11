/* Central calculator registry.
   Adding a calculator = appending one definition object to the matching
   file in src/calculators/. Adding a CATEGORY = new file + import here
   + entry in CAT_ORDER. validate() runs in tests so a malformed
   definition fails CI instead of breaking the live page. */
import geometryVolume from './calculators/geometry-volume.js';
import flowPressure from './calculators/flow-pressure.js';
import treatmentFiltration from './calculators/treatment-filtration.js';
import loadingMass from './calculators/loading-mass.js';
import processControl from './calculators/process-control.js';
import solidsSettling from './calculators/solids-settling.js';
import wellsDistribution from './calculators/wells-distribution.js';
import dosageChemical from './calculators/dosage-chemical.js';
import fieldDisinfection from './calculators/field-disinfection.js';
import pumpsPower from './calculators/pumps-power.js';
import lab from './calculators/lab.js';
import conversions from './calculators/conversions.js';
import { UNITS } from './units.js';

export const CAT_ORDER = ["Geometry & Volume","Flow & Pressure","Treatment & Filtration","Loading & Mass","Process Control","Solids & Settling","Wells & Distribution","Dosage & Chemical","Field Disinfection","Pumps & Power","Lab","Conversions"];

export const calculators = [
  ...geometryVolume, ...flowPressure, ...treatmentFiltration, ...loadingMass,
  ...processControl, ...solidsSettling, ...wellsDistribution, ...dosageChemical,
  ...fieldDisinfection, ...pumpsPower, ...lab, ...conversions
];

const DOMAINS = ["water","wastewater"];

export function validate(){
  const errors = [], ids = new Set();
  for(const c of calculators){
    const where = 'calculator "' + (c.id || '(missing id)') + '"';
    if(!c.id || !/^[a-z0-9-]+$/.test(c.id)) errors.push(where+': id must be kebab-case');
    if(ids.has(c.id)) errors.push(where+': duplicate id'); ids.add(c.id);
    if(!CAT_ORDER.includes(c.cat)) errors.push(where+': unknown cat "'+c.cat+'"');
    if(!Array.isArray(c.domains) || c.domains.length===0 || c.domains.some(d=>!DOMAINS.includes(d))) errors.push(where+': domains must be a non-empty subset of '+DOMAINS.join('/'));
    if(typeof c.title!=='string' || !c.title) errors.push(where+': missing title');
    if(typeof c.formula!=='string' || typeof c.note!=='string') errors.push(where+': missing formula/note');
    if(!Array.isArray(c.fields) || c.fields.length===0) errors.push(where+': fields must be a non-empty array');
    else for(const f of c.fields){
      if(!f.k || typeof f.label!=='string') errors.push(where+': field missing k/label');
      if(f.unit && !UNITS[f.unit]) errors.push(where+': field "'+f.k+'" has unknown unit group "'+f.unit+'"');
      if(f.unit && f.def && !UNITS[f.unit][f.def]) errors.push(where+': field "'+f.k+'" default unit "'+f.def+'" not in group');
    }
    if(typeof c.solve!=='function') errors.push(where+': missing solve()');
    if(c.interpret!=null && typeof c.interpret!=='function') errors.push(where+': interpret must be a function');
    if(c.links!=null){
      if(!Array.isArray(c.links)) errors.push(where+': links must be an array');
      else for(const l of c.links){
        if(!l || typeof l.label!=='string' || typeof l.href!=='string' || !/^https:\/\//.test(l.href))
          errors.push(where+': each link needs {label, href} with an https:// href');
      }
    }
  }
  return errors;
}
