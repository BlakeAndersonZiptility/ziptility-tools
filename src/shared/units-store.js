/* The one unit-system preference every Ziptility tool bundle reads
   (WW-01, Blake ruling 2026-09-10: shape (a), one global persisted store,
   imperial canonical, metric displayed at the edge).

   Values: 'imperial' | 'metric'. Anything else, including a missing key,
   is imperial. Persisted under ONE key so the calculator, the formula
   sheets and the practice tests agree on the same device. Every storage
   touch is wrapped: a sandboxed iframe throws on localStorage and the
   tool must keep working with the default.

   No DOM here. Bundles subscribe and repaint themselves. */
const KEY = 'zip-units';
const SYSTEMS = ['imperial', 'metric'];
let current = null;
const subs = new Set();

function normalize(s){ return s === 'metric' ? 'metric' : 'imperial'; }

export function getSystem(){
  if(current) return current;
  let stored = null;
  try{ stored = window.localStorage.getItem(KEY); }catch(e){ stored = null; }
  current = normalize(stored);
  return current;
}

export function setSystem(next){
  next = normalize(next);
  if(next === getSystem()) return current;
  current = next;
  try{ window.localStorage.setItem(KEY, next); }catch(e){}
  subs.forEach(fn => { try{ fn(next); }catch(e){} });
  return current;
}

export function subscribe(fn){ subs.add(fn); return () => subs.delete(fn); }

export function isMetric(){ return getSystem() === 'metric'; }

/* Test seam only: forget the cached value so a fresh read hits storage. */
export function _reset(){ current = null; subs.clear(); }

export { KEY as STORAGE_KEY, SYSTEMS };
