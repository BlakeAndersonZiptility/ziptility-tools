/* Utility Health Report Card: landing screen.

   R14 neutrality: no email field, no demo CTA, no pricing, no logo. The
   host page's nav carries the brand; this screen carries only what it
   is, how long it takes, who should be in the room, and the two actions
   (Start, and once there is something saved, Resume). */
import { el, clear } from './util.js';

export function renderLanding(root, { hasSaved, savedCount, total, onStart, onResume }) {
  clear(root);

  const wrap = el('div', 'zrc-landing');

  const eyebrow = el('div', 'zrc-eyebrow');
  eyebrow.appendChild(el('span', 'zrc-eyebrow-dot'));
  eyebrow.appendChild(el('span', null, 'Free. Ungated. Nothing sold.'));
  wrap.appendChild(eyebrow);

  /* D7: an h2 styled as the tool's headline, not an h1. The host Webflow
     page owns the page's one true H1; this tool is embedded content, same
     pattern the practice bundle already uses. */
  wrap.appendChild(el('h2', 'zrc-h1', 'An honest picture of your utility'));

  wrap.appendChild(el(
    'p',
    'zrc-lede',
    'Answer 23 questions about your system and get back a plain read on where you are strong, ' +
    'where you are at risk, and the specific next step for each weak spot.'
  ));

  const facts = el('div', 'zrc-facts');
  facts.appendChild(factRow(
    'How long it takes',
    'About 90 to 120 minutes the first time, if your records are nearby. About 30 to 45 minutes ' +
    'for an annual update once the system is in routine use.'
  ));
  facts.appendChild(factRow(
    'Who should be in the room',
    'At minimum, the licensed operator, the board chair, and the financial clerk, together if you ' +
    'can manage it. Each of them sees a different part of the system. One person answering alone ' +
    'tends to skew the result toward whichever part they know best.'
  ));
  /* THIS PARAGRAPH MUST DESCRIBE WHAT THE TOOL ACTUALLY DOES, and it has
     now been wrong in BOTH directions, which is why the rule is written
     twice. It first said "nothing leaves your browser" after the assessment
     started posting to HubSpot. Then submit.js was built to post but
     HUBSPOT.formId was left deliberately blank, so the tool sends nothing,
     while this text still promised "we keep a copy of the grades". It
     shipped to production on 2026-07-29 saying that.
     THE RULE: this text tracks HUBSPOT.formId in config.js, in the same
     commit. Blank id means say nothing is sent. A real id means describe
     what is kept. Nobody catches this from the outside, because both
     versions read perfectly plausibly. */
  facts.appendChild(factRow(
    'What happens to your answers',
    'There is no account and no signup, and you never have to give us your email to see your ' +
    'score. Your answers save in this browser so you can stop and come back, and nothing is sent ' +
    'anywhere. If that changes, this paragraph changes with it.'
  ));
  wrap.appendChild(facts);

  const actions = el('div', 'zrc-actions');

  const startWrap = el('div', 'zrc-start-wrap');
  const startBtn = el('button', 'zrc-btn zrc-btn-primary', 'Start the Report Card');
  startBtn.type = 'button';
  startBtn.addEventListener('click', onStart);
  startWrap.appendChild(startBtn);
  /* D1: Start now genuinely restarts (main.js's startFresh), which means
     it also wipes whatever the reader had saved. That has to be said
     before the click, not discovered after it. Only shown once there is
     something to lose. */
  if (hasSaved) {
    startWrap.appendChild(el(
      'p',
      'zrc-start-subtext',
      'Starts over from question 1 and clears your saved answers.'
    ));
  }
  actions.appendChild(startWrap);

  if (hasSaved) {
    const resumeBtn = el(
      'button',
      'zrc-btn zrc-btn-secondary',
      'Resume where you left off (' + savedCount + '/' + total + ')'
    );
    resumeBtn.type = 'button';
    resumeBtn.addEventListener('click', onResume);
    actions.appendChild(resumeBtn);
  }
  wrap.appendChild(actions);

  root.appendChild(wrap);
}

function factRow(label, body) {
  const row = el('div', 'zrc-fact');
  row.appendChild(el('h3', 'zrc-fact-label', label));
  row.appendChild(el('p', 'zrc-fact-body', body));
  return row;
}
