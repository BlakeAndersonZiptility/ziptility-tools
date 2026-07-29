/* Per-dimension display order for the five rungs.

   WHY THE RUNGS ARE SHUFFLED (Blake ruling 2026-07-29)
   The point of this tool is an honest read, and the answers are meant to
   be usable as survey data about how small systems are actually doing. A
   fixed worst-to-best ladder invites the reader to shade upward: nobody
   wants to give their own utility an F, and if the best answer is always
   last, picking it is one glance away. Shuffling removes the positional
   cue, so a respondent has to read the five descriptions and choose the
   one that sounds like their utility rather than the one that sounds good.
   Paired with hiding the letters and the ordinal words during intake
   (ui/intake.js), the ladder is invisible while answering and fully
   restored on the results screen.

   WHY THE ORDER IS STORED, NOT REGENERATED
   Two reasons, both about trusting the data:
   1. Completion runs 90 to 120 minutes and the tool supports skip and
      return, so a reader revisits dimensions constantly. An order that
      reshuffled on every render would move the answer they already picked
      out from under them, which reads as a bug and produces mis-clicks.
   2. A mis-click caused by our own reshuffling is indistinguishable, in
      the data, from a real answer.
   So the order is generated ONCE per assessment and persisted beside the
   grades (storage.js).

   Math.random is correct here. This is per-reader runtime randomness, the
   opposite of the build-time determinism the page-content generator
   needs. */
import { GRADES } from './scoring.js';

/* Fisher-Yates on a copy. */
function shuffled(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export function makeOrders(dimensions) {
  const out = {};
  for (const d of dimensions) out[d.id] = shuffled(GRADES);
  return out;
}

/* A stored order is only usable if it is a genuine permutation of the five
   grades. Anything else (a truncated write, a hand-edited localStorage, a
   future rubric change) would drop or duplicate a rung, so it is rejected
   and regenerated rather than half-trusted. */
export function isValidOrder(order) {
  if (!Array.isArray(order) || order.length !== GRADES.length) return false;
  const seen = new Set(order);
  if (seen.size !== GRADES.length) return false;
  return GRADES.every((g) => seen.has(g));
}

/* Fills gaps without disturbing what is already there: a dimension whose
   order is missing or malformed gets a fresh one, every valid existing
   order is left exactly as the reader has been seeing it. */
export function ensureOrders(dimensions, existing) {
  const out = {};
  for (const d of dimensions) {
    const prior = existing && existing[d.id];
    out[d.id] = isValidOrder(prior) ? prior : shuffled(GRADES);
  }
  return out;
}
