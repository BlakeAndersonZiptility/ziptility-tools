/* GA4 / GTM event emission for the free tools.

   WHY THIS EXISTS
   The tools lane's stated conversion is COMPLETION, not a demo click. That
   was unmeasurable until this file existed: a 2026-07-29 audit of all four
   bundles found ZERO analytics signal of any kind, no dataLayer push, no
   gtag call, no dispatched event. Every tool page therefore had "completion
   is the conversion" written in its doc and no way to count a completion.

   WHY dataLayer AND NOT gtag
   GTM already loads site-wide on ziptility.com, so a dataLayer push is all
   the page needs; the tag config lives in GTM where Blake can change it
   without a bundle release. Calling gtag() directly would hard-code the
   measurement id into a public artifact and bypass GTM entirely.

   WHY NOT A MutationObserver ON THE PAGE INSTEAD
   Because that was the alternative, and it was rejected: watching the mount
   for a result node couples page instrumentation to bundle DOM internals and
   breaks silently on any redesign. The bundle knows when it finished. It
   should say so.

   RULES THIS FILE OBEYS
   - Fire and forget. Analytics never blocks, never throws into the tool, and
     never surfaces anything to the reader. Every call is wrapped.
   - NO PII, ever. No email, no free-text, no company name. Grades, counts,
     bands and tool ids only. The report card's whole design premise is that
     a reader can use it without identifying themselves; an analytics event
     must not quietly undo that.
   - A DEMO CLICK IS NOT A COMPLETION and must never be emitted as one
     (lane rule; the calculator's own 146-views/1-demo-click read is the
     worked example of scoring the wrong thing as success). */

const EVENT_COMPLETE = 'tool_complete';
const EVENT_PROGRESS = 'tool_progress';

function push(payload) {
  try {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch (e) {
    /* Deliberately silent. A blocked or absent dataLayer is not the
       reader's problem and must not reach the console on a tool page. */
  }
}

/* Completion. `tool` is the stable slug the page is pinned to, so the GA4
   report groups by the same id the URL and the embed use. `detail` is
   optional non-identifying context. */
export function trackComplete(tool, detail) {
  if (!tool) return;
  const payload = { event: EVENT_COMPLETE, tool_name: String(tool) };
  if (detail && typeof detail === 'object') {
    Object.keys(detail).forEach((k) => {
      const v = detail[k];
      if (v === undefined || v === null || v === '') return;
      if (typeof v === 'object') return;
      payload['tool_' + k] = typeof v === 'number' ? v : String(v);
    });
  }
  push(payload);
}

/* Progress, for the long one only. A 90-to-120-minute assessment has real
   drop-off, and WHERE people stop is a finding about the instrument, not
   just a funnel number. Emitted at coarse milestones rather than on every
   answer, so 23 answers do not become 23 events per session. */
export function trackProgress(tool, answered, total) {
  if (!tool || !total) return;
  push({
    event: EVENT_PROGRESS,
    tool_name: String(tool),
    tool_answered: Number(answered),
    tool_total: Number(total),
    tool_percent: Math.round((Number(answered) / Number(total)) * 100)
  });
}

/* Milestone gate: true only the first time a given threshold is crossed, so
   the caller can emit progress without tracking state itself. */
export function makeMilestoneGate(thresholds) {
  const seen = {};
  const marks = (thresholds || [25, 50, 75]).slice().sort((a, b) => a - b);
  return function crossed(answered, total) {
    if (!total) return null;
    const pct = (answered / total) * 100;
    for (let i = marks.length - 1; i >= 0; i--) {
      const m = marks[i];
      if (pct >= m && !seen[m]) {
        seen[m] = true;
        return m;
      }
    }
    return null;
  };
}
