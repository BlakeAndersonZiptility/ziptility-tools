/* Manager toolbox registry - the three manager-facing calculators, a
   SEPARATE bundle from the operator calculator (src/registry.js), per
   ziptility/web/field-guide/manager-track/tool-specs.md ("Repo shape:
   build the three as a separate bundle in the same idiom, not as new
   categories inside ziptility-tools").
   Same contract as the operator registry (id, cat, domains, title,
   formula, note, fields, solve, interpret?, links?, toggle?, keywords?,
   seeAlso?), reusing src/units.js for the one shared unit group (length,
   ft/mi) instead of duplicating conversion logic. validate() is modeled
   line-for-line on src/registry.js's validate(), scoped to this
   registry's own CAT_ORDER. */
import repairOrReplace from './tools/repair-or-replace.js';
import costOfTurnover from './tools/cost-of-turnover.js';
import energyCost from './tools/energy-cost.js';
import { UNITS } from '../units.js';

export const CAT_ORDER = ['Asset Management', 'Workforce', 'Energy'];

export const calculators = [...repairOrReplace, ...costOfTurnover, ...energyCost];

const DOMAINS = ['water', 'wastewater'];

export function validate() {
  const errors = [], ids = new Set();
  const allIds = new Set(calculators.map(c => c.id));
  for (const c of calculators) {
    const where = 'manager tool "' + (c.id || '(missing id)') + '"';
    if (!c.id || !/^[a-z0-9-]+$/.test(c.id)) errors.push(where + ': id must be kebab-case');
    if (ids.has(c.id)) errors.push(where + ': duplicate id'); ids.add(c.id);
    if (!CAT_ORDER.includes(c.cat)) errors.push(where + ': unknown cat "' + c.cat + '"');
    if (!Array.isArray(c.domains) || c.domains.length === 0 || c.domains.some(d => !DOMAINS.includes(d))) errors.push(where + ': domains must be a non-empty subset of ' + DOMAINS.join('/'));
    if (typeof c.title !== 'string' || !c.title) errors.push(where + ': missing title');
    if (typeof c.formula !== 'string' || typeof c.note !== 'string') errors.push(where + ': missing formula/note');
    if (!Array.isArray(c.fields) || c.fields.length === 0) errors.push(where + ': fields must be a non-empty array');
    else for (const f of c.fields) {
      if (!f.k || typeof f.label !== 'string') errors.push(where + ': field missing k/label');
      if (f.unit && !UNITS[f.unit]) errors.push(where + ': field "' + f.k + '" has unknown unit group "' + f.unit + '"');
      if (f.unit && f.def && !UNITS[f.unit][f.def]) errors.push(where + ': field "' + f.k + '" default unit "' + f.def + '" not in group');
      if (f.advanced != null && typeof f.advanced !== 'boolean') errors.push(where + ': field "' + f.k + '" advanced must be boolean');
    }
    if (typeof c.solve !== 'function') errors.push(where + ': missing solve()');
    if (c.interpret != null && typeof c.interpret !== 'function') errors.push(where + ': interpret must be a function');
    if (c.links != null) {
      if (!Array.isArray(c.links)) errors.push(where + ': links must be an array');
      else for (const l of c.links) {
        if (!l || typeof l.label !== 'string' || typeof l.href !== 'string' || !/^https:\/\//.test(l.href))
          errors.push(where + ': each link needs {label, href} with an https:// href');
      }
    }
    if (c.toggle != null) {
      const t = c.toggle;
      if (!t || typeof t.k !== 'string' || !t.k || !Array.isArray(t.options) || t.options.length < 2
        || t.options.some(o => !o || typeof o.v !== 'string' || typeof o.label !== 'string')
        || !t.options.some(o => o.v === t.def))
        errors.push(where + ': toggle needs {k, def, options:[{v,label}, ...]} with def among option values');
      else {
        if (Array.isArray(c.fields) && c.fields.some(f => f && f.k === t.k)) errors.push(where + ': toggle.k collides with a field key');
        if (Array.isArray(c.fields)) for (const f of c.fields)
          if (f && f.show != null && !t.options.some(o => o.v === f.show)) errors.push(where + ': field "' + f.k + '" show value is not a toggle option');
      }
    } else if (Array.isArray(c.fields) && c.fields.some(f => f && f.show != null))
      errors.push(where + ': fields use show but the card has no toggle');
    if (c.keywords != null && (!Array.isArray(c.keywords) || c.keywords.some(k => typeof k !== 'string' || !k)))
      errors.push(where + ': keywords must be an array of non-empty strings');
    if (c.seeAlso != null) {
      if (!Array.isArray(c.seeAlso)) errors.push(where + ': seeAlso must be an array of calculator ids');
      else for (const id of c.seeAlso) {
        if (id === c.id) errors.push(where + ': seeAlso must not reference itself');
        else if (!allIds.has(id)) errors.push(where + ': seeAlso references unknown id "' + id + '"');
      }
    }
  }
  return errors;
}
