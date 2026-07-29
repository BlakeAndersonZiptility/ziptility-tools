/* Utility Health Report Card: localStorage read/write, guarded.

   No account, ever (R14 neutrality). Everything here is best-effort: if
   storage is blocked (private browsing, a sandboxed preview iframe,
   quota) the tool must still work, it just cannot resume next time. A
   thrown exception in here must never break the reader's flow, which is
   why every call is wrapped and every failure degrades to "nothing
   saved" rather than surfacing anywhere. */

const KEY = 'zip-reportcard-v1';

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.grades !== 'object' || parsed.grades === null) {
      return null;
    }
    return {
      grades: parsed.grades,
      idx: typeof parsed.idx === 'number' ? parsed.idx : 0
    };
  } catch (e) {
    return null;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      grades: state.grades || {},
      idx: typeof state.idx === 'number' ? state.idx : 0
    }));
  } catch (e) {
    /* storage unavailable: degrade quietly, nothing to resume next time */
  }
}
