/* Utility Health Report Card: localStorage read/write, guarded.

   No account, ever (R14 neutrality). Everything here is best-effort: if
   storage is blocked (private browsing, a sandboxed preview iframe,
   quota) the tool must still work, it just cannot resume next time. A
   thrown exception in here must never break the reader's flow, which is
   why every call is wrapped and every failure degrades to "nothing
   saved" rather than surfacing anywhere.

   Four things persist, and the last two matter as much as the grades:
   - grades    what the reader answered
   - idx       where they stopped
   - orders    the per-dimension rung shuffle. Regenerating it on reload
               would move an already-picked answer out from under someone
               mid-assessment, and a mis-click we caused is indistinguishable
               from a real answer in the data. See rung-order.js.
   - profile   the optional closing block (size, staff, revenue, email) so
               a reader who steps away does not retype it. */

const KEY = 'zip-reportcard-v1';

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed) || !isPlainObject(parsed.grades)) return null;
    return {
      grades: parsed.grades,
      idx: typeof parsed.idx === 'number' ? parsed.idx : 0,
      /* Validated for shape in rung-order.js, not here: this layer only
         decides whether something is worth handing on. */
      orders: isPlainObject(parsed.orders) ? parsed.orders : null,
      profile: isPlainObject(parsed.profile) ? parsed.profile : null,
      submitted: parsed.submitted === true
    };
  } catch (e) {
    return null;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      grades: state.grades || {},
      idx: typeof state.idx === 'number' ? state.idx : 0,
      orders: state.orders || {},
      profile: state.profile || null,
      submitted: state.submitted === true
    }));
  } catch (e) {
    /* storage unavailable: degrade quietly, nothing to resume next time */
  }
}
