/* Utility Health Report Card: send the completed assessment to HubSpot.

   WHY THIS EXISTS
   The answers are meant to be usable as survey data on how small systems
   are actually doing, which is also why intake is blind and the rungs are
   shuffled (rung-order.js). None of that matters if the answers never
   leave the browser.

   WHAT IT IS NOT
   Not a gate. R14: no email for the score. This runs AFTER the reader has
   finished, it is fire-and-forget, the score never waits on it, and a
   failed request is invisible to them. Email is optional and the profile
   block is skippable; skipping still shows the full report.

   SHAPE OF THE PAYLOAD
   Summary fields plus a full JSON blob, deliberately both:
   - The summaries (overall, the three legs, the practical grade, the
     red-line count, and the profile) are what you can group, filter and
     chart in HubSpot directly, without an export.
   - The blob carries all 23 graded dimensions so nothing is lost, and so a
     question nobody has thought to ask yet is still answerable later from
     data already collected.

   If HUBSPOT.formId is blank this no-ops silently: the tool is fully
   usable and simply sends nothing. That is the state it ships in until the
   form exists in HubSpot. The exact field list to create is in
   HUBSPOT-FORM-SPEC.md. */
import { HUBSPOT } from './config.js';
import { score, LEGS } from './scoring.js';

const ENDPOINT = 'https://api.hsforms.com/submissions/v3/integration/submit/';

/* Only fields with a value are sent. HubSpot rejects a submission that
   names a field it does not know, and it treats an empty string as a real
   answer, which would put blanks into the dataset as if somebody had
   chosen them. */
function field(name, value) {
  if (value === undefined || value === null || value === '') return null;
  return { name, value: String(value) };
}

export function buildPayload({ grades, profile, dimensions }) {
  const s = score(grades, dimensions);
  const p = profile || {};

  const legFields = LEGS.map((leg) => {
    const la = s.legAverages.find((l) => l.leg === leg);
    return field('rc_leg_' + leg.toLowerCase(), la && la.grade);
  });

  const fields = [
    field('email', p.email),
    field('rc_overall_grade', s.overall.grade),
    field('rc_practical_grade', s.practical.grade),
    field('rc_practical_capped', s.practical.capped ? 'yes' : 'no'),
    ...legFields,
    field('rc_redline_count', String(s.flags.length)),
    field('rc_redline_ids', s.flags.map((f) => f.id).join(',')),
    field('rc_answered', String(s.answered)),
    field('rc_complete', s.complete ? 'yes' : 'no'),
    field('rc_connections', p.connections),
    field('rc_employees', p.employees),
    field('rc_revenue_band', p.revenue),
    field('rc_system_type', p.systemType),
    /* Every graded dimension, id to letter. Small enough for one field and
       the only way a later question stays answerable. */
    field('rc_grades_json', JSON.stringify(grades))
  ].filter(Boolean);

  return {
    fields,
    context: { pageUri: safePageUri(), pageName: 'Utility Health Report Card' },
    /* No legalConsentOptions: nothing here is a marketing opt-in. The
       reader is handing over an anonymous assessment, and an email only if
       they chose to type one. */
  };
}

function safePageUri() {
  try { return window.location.href; } catch (e) { return ''; }
}

export function submitAssessment({ grades, profile, dimensions }) {
  if (!HUBSPOT.portalId || !HUBSPOT.formId) {
    /* Not wired yet. Resolve rather than reject: a missing form id is a
       configuration state, not a runtime error, and it must not surface
       anywhere near the reader. */
    return Promise.resolve({ sent: false, reason: 'not-configured' });
  }
  let body;
  try {
    body = JSON.stringify(buildPayload({ grades, profile, dimensions }));
  } catch (e) {
    return Promise.resolve({ sent: false, reason: 'payload-error' });
  }
  return fetch(ENDPOINT + HUBSPOT.portalId + '/' + HUBSPOT.formId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }).then((r) => ({ sent: r.ok, status: r.status }));
}
