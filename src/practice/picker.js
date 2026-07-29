/* Ziptility practice tests: picker/hub screen. Picks a test, plus the
   transient states while its bank downloads. Stateless: every function
   here just paints rootEl, no persisted state (quiz-engine.js owns that
   once a test is running). */
import { TESTS } from './manifest.js';

/* Descriptions come from the manifest (manifest.js), not a local map.
   Until 2026-07-29 they lived here in a DESCRIPTIONS object that only
   defined operator-math-1, so five of the six hub cards rendered an empty
   <p> in production while real description strings sat unread in the
   manifest. One source, validated there. */

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/* childPages: when a per-discipline page exists for every test (the Q-12
   split), each card becomes a real <a> to /tools/practice/<slug> instead
   of launching the bank in place, so the URL built to rank for that
   discipline is the one that gets the engagement. Default OFF, because
   the hub cannot link to pages that do not exist yet: the six pages ship
   first, then the embed sets data-child-pages="1" and the hub becomes the
   umbrella index. Real anchors, not JS navigation, so they are
   crawlable, middle-clickable, and keyboard-correct. */
export function renderPicker(rootEl, { onSelect, childPages = false, hubUrl = '/tools/practice' }) {
  clear(rootEl);
  rootEl.appendChild(el('h2', 'zq-hub-section-title', 'Pick your test'));

  const base = String(hubUrl).replace(/\/+$/, '');
  const grid = el('div', 'zq-hub-grid');
  TESTS.forEach((t) => {
    const card = el(childPages ? 'a' : 'button', 'zq-hubcard');
    if (childPages) card.href = base + '/' + t.slug;
    else card.type = 'button';
    card.appendChild(el('span', 'zq-eyebrow', t.discipline));
    card.appendChild(el('h3', null, t.title));
    card.appendChild(el('p', null, t.description || ''));
    card.appendChild(el('div', 'zq-meta', t.questionCount + ' questions · practice or timed exam'));
    if (!childPages) card.addEventListener('click', () => onSelect(t));
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

/* Two shapes, one box. A failed bank fetch is retryable, so it gets a
   Try again button. An unresolvable data-test is NOT retryable (retrying
   a typo just fails again), so it gets a way out to the hub instead. */
export function renderError(rootEl, { message, onRetry, hubUrl }) {
  clear(rootEl);
  const box = el('div', 'zq-error');
  box.setAttribute('role', 'alert');
  box.appendChild(el('h3', null, 'Could not load this test'));
  box.appendChild(el('p', null, message || 'The question set did not load. Check your connection and try again.'));
  if (onRetry) {
    const retry = el('button', 'zq-btn zq-btn-secondary', 'Try again');
    retry.type = 'button';
    retry.addEventListener('click', onRetry);
    box.appendChild(retry);
  }
  if (hubUrl) {
    const all = el('a', 'zq-btn zq-btn-secondary', 'All practice tests');
    all.href = hubUrl;
    box.appendChild(all);
  }
  rootEl.appendChild(box);
}
