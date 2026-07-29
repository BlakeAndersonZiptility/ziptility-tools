/* Build the SERVER-RENDERED body content for the six per-discipline
   practice pages (/tools/practice/<slug>, the Q-12 split).

   WHY THIS EXISTS
   The six pages are gated on a blocking build precondition: each one needs
   "the discipline's topic breakdown as real HTML, plus 5 to 10 worked
   sample questions present in the page source, not only in the JS embed."
   Six pages cloned from the hub template would each carry ~1,200
   characters of near-identical copy and no indexable question content:
   thin and near-duplicate at the same time, which is the one thing the
   split cannot afford, since its whole justification is that each
   discipline deserves its own non-duplicate URL.

   That content has to come from the banks, and the banks live here. So it
   is generated, not hand-written: hand-writing six topic breakdowns means
   six chances to state a count that is wrong the day a bank changes.
   Every number below is COUNTED from the bank at build time.

   OUTPUT
   page-content/<slug>.html   paste-ready static HTML fragment
   page-content/<slug>.json   the same facts as data (counts, sampled ids)
   page-content/SUMMARY.md    one table, for review at a glance

   The fragments are committed so the Webflow build session reads them
   straight out of the public repo. They are page BODY content; the JS
   embed mounts separately and sits on top of them.

   Run: node scripts/build-page-content.mjs
*/
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TESTS } from '../src/practice/manifest.js';
import { DOMAIN_LABELS } from '../src/practice/domains.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const SRC = path.join(ROOT, 'banks-src');
const OUT = path.join(ROOT, 'page-content');

/* How many worked examples per page. The precondition says 5 to 10; 8
   sits mid-range, enough to read as substance rather than a token
   gesture, short of padding the page with material nobody scrolls. */
const SAMPLE_COUNT = 8;

/* Topic slugs are stored kebab-case ("disinfection-ct"). Most read fine
   with a dash-to-space pass; these do not. */
const TOPIC_LABELS = {
  'disinfection-ct': 'Disinfection and CT',
  'qa-qc': 'QA/QC',
  'ppe': 'PPE',
  'cctv-inspection': 'CCTV inspection',
  'i-and-i': 'Infiltration and inflow',
  'sso-response': 'SSO response',
  'bod-cbod': 'BOD and CBOD',
  'tss-mlss': 'TSS and MLSS',
  'f-m-ratio': 'F/M ratio',
  'svi': 'SVI',
  'h2s': 'Hydrogen sulfide',
  'gis-mapping': 'GIS and mapping'
};

/* ---- content holds (Blake ruling 2026-06-12, still binding) ----------
   PFAS is a hard content exclude while the federal rule is in flux, and
   chemistry questions are held pending SME review. Both are enforced here
   as ASSERTIONS rather than filters, deliberately: the banks are already
   supposed to be clean (measured 2026-07-29: zero PFAS rows and zero CHEM
   rows across all six). A filter would quietly paper over a bank that
   later shipped held content. An assertion fails the build and tells
   somebody. SAFE rows are NOT held: the ones present in the banks cleared
   the per-row SME-SIGNOFF gate and already run in the live test, so
   sampling one onto the page exposes nothing new. */
const PFAS_RE = /\bPFAS\b|\bPFOA\b|\bPFOS\b|per-\s*and\s*polyfluoro/i;

function assertHolds(bank) {
  const pfas = bank.questions.filter((q) => PFAS_RE.test(JSON.stringify(q)));
  if (pfas.length) {
    throw new Error(
      'HELD CONTENT: ' + bank.id + ' has ' + pfas.length + ' PFAS question(s) (' +
      pfas.map((q) => q.id).join(', ') + '). PFAS is a hard exclude ' +
      '(Blake ruling 2026-06-12) and must not reach a public page.'
    );
  }
  const chem = bank.questions.filter((q) => q.domain === 'CHEM');
  if (chem.length) {
    throw new Error(
      'HELD CONTENT: ' + bank.id + ' has ' + chem.length + ' CHEM question(s) (' +
      chem.map((q) => q.id).join(', ') + '). Chemistry is held pending SME ' +
      'review (Blake ruling 2026-06-12).'
    );
  }
}

/* ---- helpers --------------------------------------------------------- */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function topicLabel(t) {
  if (TOPIC_LABELS[t]) return TOPIC_LABELS[t];
  const words = String(t).split('-');
  return words[0].charAt(0).toUpperCase() + words[0].slice(1) + (words.length > 1 ? ' ' + words.slice(1).join(' ') : '');
}

function tally(rows, key) {
  const out = {};
  for (const r of rows) out[r[key]] = (out[r[key]] || 0) + 1;
  return out;
}

/* Sort by count desc, then name asc. The name tiebreak is what keeps the
   output byte-stable across runs when two topics have equal counts, so a
   rebuild produces no diff unless the bank actually changed. */
function ranked(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/* ---- sample selection ------------------------------------------------
   Deterministic by construction: no Math.random anywhere, every ordering
   broken down to a total order ending in the question id. Rebuilding on
   an unchanged bank must produce a byte-identical file, or the committed
   fragments churn and reviewing a real change gets harder.

   Shape of the pick: round-robin across domains largest-first, taking
   each domain's biggest not-yet-used topic each pass. That surfaces what
   the discipline is actually mostly about instead of eight questions from
   one corner of it.

   Richness prefers a question that can show its work. formula and
   citation turn out to be near-mutually-exclusive in practice (measured
   2026-07-29: operator-math-1 is 110 formula / 0 citation, regulations-1
   is 0 / 103, and exactly one question in all six banks has both), so
   this scores them independently and never requires both. */
function richness(q) {
  let s = 0;
  if (q.formula) s += 2;
  if (q.citation) s += 2;
  if (q.explanation && q.explanation.length > 120) s += 1;
  return s;
}

function pickSamples(questions, n) {
  const byDomain = {};
  for (const q of questions) (byDomain[q.domain] = byDomain[q.domain] || []).push(q);

  const domainOrder = ranked(tally(questions, 'domain')).map(([d]) => d);
  const usedTopics = new Set();
  const picked = [];
  const takenIds = new Set();

  /* Bounded: each pass takes at most one per domain, so at most
     domainOrder.length picks per pass and the loop always terminates. */
  let guard = 0;
  while (picked.length < n && guard++ < n * 4) {
    let progressed = false;
    for (const d of domainOrder) {
      if (picked.length >= n) break;
      const pool = byDomain[d].filter((q) => !takenIds.has(q.id));
      if (!pool.length) continue;

      const fresh = pool.filter((q) => !usedTopics.has(q.topic));
      const from = fresh.length ? fresh : pool;

      /* Within the chosen pool: biggest topic first, then richest, then
         id. Every level is a total order, so the result is stable. */
      const topicSize = tally(from, 'topic');
      const best = from.slice().sort((a, b) =>
        (topicSize[b.topic] - topicSize[a.topic]) ||
        (richness(b) - richness(a)) ||
        a.id.localeCompare(b.id)
      )[0];

      picked.push(best);
      takenIds.add(best.id);
      usedTopics.add(best.topic);
      progressed = true;
    }
    if (!progressed) break;
  }
  return picked;
}

/* ---- rendering ------------------------------------------------------- */

function renderBreakdown(bank, test) {
  const domains = ranked(tally(bank.questions, 'domain'));
  const topics = ranked(tally(bank.questions, 'topic'));
  const total = bank.questions.length;

  const domRows = domains.map(([d, c]) => {
    const pct = Math.round((100 * c) / total);
    return '      <tr>\n' +
      '        <th scope="row">' + esc(DOMAIN_LABELS[d] || d) + '</th>\n' +
      '        <td>' + c + '</td>\n' +
      '        <td>' + pct + '%</td>\n' +
      '      </tr>';
  }).join('\n');

  /* Topic list is capped: the long tail of one-question topics reads as
     filler and pushes the sample questions below the fold. */
  const shown = topics.slice(0, 12);
  const rest = topics.length - shown.length;
  const topicItems = shown.map(([t, c]) =>
    '      <li><span class="zpt-topic-name">' + esc(topicLabel(t)) + '</span> <span class="zpt-topic-count">' + c + ' questions</span></li>'
  ).join('\n');

  return '' +
'  <section class="zpt-breakdown" aria-labelledby="zpt-breakdown-h">\n' +
'    <h2 id="zpt-breakdown-h">What is on the ' + esc(test.discipline.toLowerCase()) + ' test</h2>\n' +
'    <p>All ' + total + ' questions in this test, grouped the way the exam groups them. ' +
       'Your score comes back broken down these same ways, weakest first.</p>\n' +
'    <table class="zpt-breakdown-table">\n' +
'      <caption>' + esc(test.title) + ': ' + total + ' questions by subject area</caption>\n' +
'      <thead>\n' +
'        <tr><th scope="col">Subject area</th><th scope="col">Questions</th><th scope="col">Share</th></tr>\n' +
'      </thead>\n' +
'      <tbody>\n' + domRows + '\n' +
'      </tbody>\n' +
'    </table>\n' +
'    <h3>Topics covered</h3>\n' +
'    <ul class="zpt-topic-list">\n' + topicItems + '\n' +
'    </ul>\n' +
(rest > 0 ? '    <p class="zpt-topic-more">Plus ' + rest + ' more topics with fewer questions each.</p>\n' : '') +
'  </section>';
}

function renderSamples(bank, test, samples) {
  const items = samples.map((q, i) => {
    const letters = ['A', 'B', 'C', 'D'];
    const choices = q.choices.map((c, ci) => {
      const isRight = ci === q.correctIndex;
      /* The correct answer is marked in TEXT ("Correct answer"), not by
         colour or position alone. Same rule the app follows, and it is
         what makes the fragment useful to a screen reader and to a
         search engine reading the page without CSS. */
      return '        <li' + (isRight ? ' class="zpt-choice zpt-choice-correct"' : ' class="zpt-choice"') + '>\n' +
        '          <span class="zpt-choice-letter">' + letters[ci] + '.</span> ' + esc(c) +
        (isRight ? ' <span class="zpt-choice-flag">Correct answer</span>' : '') + '\n' +
        '        </li>';
    }).join('\n');

    const meta = [];
    if (q.formula) meta.push('      <p class="zpt-formula"><span class="zpt-label">Formula</span> <code>' + esc(q.formula) + '</code></p>');
    if (q.citation) meta.push('      <p class="zpt-citation"><span class="zpt-label">Source</span> ' + esc(q.citation) + '</p>');

    return '' +
'    <li class="zpt-sample">\n' +
'      <h3 class="zpt-sample-q"><span class="zpt-sample-n">Question ' + (i + 1) + '</span> ' + esc(q.text) + '</h3>\n' +
'      <ol class="zpt-choices">\n' + choices + '\n' +
'      </ol>\n' +
'      <p class="zpt-explanation"><span class="zpt-label">Why</span> ' + esc(q.explanation) + '</p>\n' +
(meta.length ? meta.join('\n') + '\n' : '') +
'      <p class="zpt-sample-tags">' + esc(topicLabel(q.topic)) + ' · ' + esc(q.difficulty) + ' · ' + esc(q.cognitive) + '</p>\n' +
'    </li>';
  }).join('\n');

  return '' +
'  <section class="zpt-samples" aria-labelledby="zpt-samples-h">\n' +
'    <h2 id="zpt-samples-h">' + samples.length + ' sample questions, worked out</h2>\n' +
'    <p>Straight from the test, with the answer and the reasoning shown. ' +
     'The full test gives you ' + bank.questions.length + ' of these, drawn fresh each time.</p>\n' +
'    <ol class="zpt-samples-list">\n' + items + '\n' +
'    </ol>\n' +
'  </section>';
}

function renderFragment(bank, test, samples) {
  const stamp = bank.version;
  return '' +
'<!-- GENERATED by scripts/build-page-content.mjs. Do not hand-edit: rerun\n' +
'     the script instead, or the next run silently reverts your change.\n' +
'     Page:  /tools/practice/' + test.slug + '\n' +
'     Bank:  ' + bank.id + ' (content revision ' + stamp + ', ' + bank.questions.length + ' questions)\n' +
'     This is the page BODY. It must be server-rendered HTML in the page\n' +
'     source: it is what satisfies the unique-body build precondition for\n' +
'     the Q-12 split. The practice JS embed mounts separately, on top. -->\n' +
'<div class="zpt-practice-page-content" data-bank="' + esc(bank.id) + '" data-bank-version="' + esc(stamp) + '">\n' +
renderBreakdown(bank, test) + '\n\n' +
renderSamples(bank, test, samples) + '\n' +
'</div>\n';
}

/* ---- main ------------------------------------------------------------ */

function main() {
  mkdirSync(OUT, { recursive: true });

  const known = new Set(readdirSync(SRC).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
  const rows = [];

  for (const test of TESTS) {
    if (!known.has(test.id)) {
      throw new Error('bank source missing for "' + test.id + '" (expected banks-src/' + test.id + '.json)');
    }
    const bank = JSON.parse(readFileSync(path.join(SRC, test.id + '.json'), 'utf8'));

    assertHolds(bank);

    /* The manifest's questionCount is what the page copy quotes. If it has
       drifted from the bank, the page would state a number that is not
       true, which is exactly the failure the generated breakdown exists to
       prevent. */
    if (bank.questions.length !== test.questionCount) {
      throw new Error(
        'count drift: manifest says ' + test.questionCount + ' for ' + test.id +
        ' but the bank holds ' + bank.questions.length + '. Fix the manifest before publishing a page that quotes it.'
      );
    }

    const samples = pickSamples(bank.questions, SAMPLE_COUNT);
    if (samples.length < 5) {
      throw new Error('only ' + samples.length + ' samples for ' + test.id + '; the build precondition requires 5 to 10.');
    }

    const html = renderFragment(bank, test, samples);
    writeFileSync(path.join(OUT, test.slug + '.html'), html);

    const facts = {
      bankId: bank.id,
      slug: test.slug,
      url: '/tools/practice/' + test.slug,
      bankContentVersion: bank.version,
      questionCount: bank.questions.length,
      durationMin: bank.durationMin,
      domains: Object.fromEntries(ranked(tally(bank.questions, 'domain'))),
      topicCount: new Set(bank.questions.map((q) => q.topic)).size,
      difficulty: Object.fromEntries(ranked(tally(bank.questions, 'difficulty'))),
      sampledIds: samples.map((q) => q.id),
      sampledTopics: samples.map((q) => q.topic)
    };
    writeFileSync(path.join(OUT, test.slug + '.json'), JSON.stringify(facts, null, 2) + '\n');

    rows.push({ test, bank, samples, facts });
    console.log(
      'wrote page-content/' + test.slug + '.html  (' + bank.questions.length + ' questions, ' +
      facts.topicCount + ' topics, ' + samples.length + ' samples)'
    );
  }

  const summary = '' +
'# Generated page content: the six practice discipline pages\n\n' +
'GENERATED by `scripts/build-page-content.mjs`. Rerun rather than hand-editing.\n\n' +
'This is the server-rendered body each `/tools/practice/<slug>` page needs to clear\n' +
'its unique-body build precondition. Every count below is counted from the bank at\n' +
'build time, so a page can quote a number without anyone checking it by hand.\n\n' +
'| Page | Bank | Questions | Topics | Samples | Bank revision |\n' +
'|---|---|---|---|---|---|\n' +
rows.map((r) =>
  '| `/tools/practice/' + r.test.slug + '` | ' + r.bank.id + ' | ' + r.facts.questionCount +
  ' | ' + r.facts.topicCount + ' | ' + r.samples.length + ' | ' + r.facts.bankContentVersion + ' |'
).join('\n') + '\n\n' +
'## Holds enforced at build time\n\n' +
'- PFAS: hard content exclude (Blake ruling 2026-06-12). Build fails if any bank carries one.\n' +
'- CHEM: held pending SME review. Build fails if any bank carries one.\n' +
'- SAFE rows are NOT held. The ones in the banks cleared the per-row SME-SIGNOFF gate and\n' +
'  already run in the live test, so sampling one onto a page exposes nothing new.\n\n' +
'## A note on the sample questions\n\n' +
'Sampled questions stay in their banks (Blake ruling, this session). The page shows them\n' +
'openly as worked examples with the answer given, so meeting one again inside the test is\n' +
'study repetition rather than a leak, and no exclude-list has to be carried in the bundle\n' +
'forever.\n';
  writeFileSync(path.join(OUT, 'SUMMARY.md'), summary);
  console.log('wrote page-content/SUMMARY.md');
}

main();
