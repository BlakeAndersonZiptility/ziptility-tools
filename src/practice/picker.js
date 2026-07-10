/* Ziptility practice tests: picker/hub screen. Picks a test, plus the
   transient states while its bank downloads. Stateless: every function
   here just paints rootEl, no persisted state (quiz-engine.js owns that
   once a test is running). */
import { TESTS } from './manifest.js';

/* One-line, plain-operator descriptions per test id. Not part of TESTS
   (that manifest only carries the fields quiz-engine/bank-loader need),
   kept here beside the only screen that renders them. */
const DESCRIPTIONS = {
  'operator-math-1': 'Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English.'
};

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function renderPicker(rootEl, { onSelect }) {
  clear(rootEl);
  rootEl.appendChild(el('h2', 'zq-hub-section-title', 'Pick your test'));

  const grid = el('div', 'zq-hub-grid');
  TESTS.forEach((t) => {
    const card = el('button', 'zq-hubcard');
    card.type = 'button';
    card.appendChild(el('span', 'zq-eyebrow', t.discipline));
    card.appendChild(el('h3', null, t.title));
    card.appendChild(el('p', null, DESCRIPTIONS[t.id] || ''));
    card.appendChild(el('div', 'zq-meta', t.questionCount + ' questions · practice or timed exam'));
    card.addEventListener('click', () => onSelect(t));
    grid.appendChild(card);
  });
  rootEl.appendChild(grid);
}

export function renderLoading(rootEl) {
  clear(rootEl);
  const box = el('div', 'zq-loading');
  box.appendChild(el('span', 'zq-spinner'));
  box.appendChild(el('span', null, 'Loading questions…'));
  rootEl.appendChild(box);
}

export function renderError(rootEl, { message, onRetry }) {
  clear(rootEl);
  const box = el('div', 'zq-error');
  box.setAttribute('role', 'alert');
  box.appendChild(el('h3', null, 'Could not load this test'));
  box.appendChild(el('p', null, message || 'The question set did not load. Check your connection and try again.'));
  const retry = el('button', 'zq-btn zq-btn-secondary', 'Try again');
  retry.type = 'button';
  retry.addEventListener('click', onRetry);
  box.appendChild(retry);
  rootEl.appendChild(box);
}
