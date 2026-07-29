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

  wrap.appendChild(el('h1', 'zrc-h1', 'An honest picture of your utility'));

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
  /* THIS PARAGRAPH MUST DESCRIBE WHAT THE TOOL ACTUALLY DOES. It used to
     say "nothing leaves your browser", which stopped being true the day
     the assessment started posting to HubSpot (submit.js). Nobody would
     have caught it from the outside, which is exactly why it gets a note:
     if the submission behaviour changes again, this text changes with it,
     in the same commit. */
  facts.appendChild(factRow(
    'What happens to your answers',
    'There is no account and no signup, and you never have to give us your email to see your ' +
    'score. Your answers save in this browser so you can stop and come back. When you finish, we ' +
    'keep a copy of the grades and the size of your system to build a picture of how small ' +
    'systems are really doing. That copy has no name on it unless you choose to give us your ' +
    'email at the end.'
  ));
  wrap.appendChild(facts);

  const actions = el('div', 'zrc-actions');
  const startBtn = el('button', 'zrc-btn zrc-btn-primary', 'Start the Report Card');
  startBtn.type = 'button';
  startBtn.addEventListener('click', onStart);
  actions.appendChild(startBtn);

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
