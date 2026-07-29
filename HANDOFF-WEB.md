# Handoff to the Webflow build

Everything a page build needs from this repo: the embed to paste, the
attributes to set, and where the server-rendered body copy lives.

Runtime truth is the live embed on the page, never this file (LEDGER
L-005). Versions below are what was live or newly cut on 2026-07-29; to
know what is serving right now, read the page.

Deploy is one edit: change the version in the `<script src>` and publish.
Artifacts are immutable, so **merging to main never changes what a visitor
sees**. Rollback is the same edit in reverse and takes about a minute.

---

## 1. The six practice discipline pages (Q-12)

### The embed

Paste `webflow/practice-embed-discipline.html`. It is the hub embed plus
one attribute:

```html
<div id="ziptility-practice" data-test="water-treatment">
  <div aria-hidden="true" style="height:88px;background:#0c1f30;border-bottom:3px solid #ff442f"></div>
  <noscript>This tool requires JavaScript. Please enable it to use the free practice test.</noscript>
</div>
<script defer src="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-v1.4.0.js"></script>
```

**`data-test` is the page's own slug**, the last segment of its URL, so
there is nothing to look up:

| Page URL | `data-test` | Bank | Questions |
|---|---|---|---|
| `/tools/practice/water-treatment` | `water-treatment` | wt-1 | 128 |
| `/tools/practice/water-distribution` | `water-distribution` | wd-1 | 125 |
| `/tools/practice/wastewater-treatment` | `wastewater-treatment` | wwt-1 | 119 |
| `/tools/practice/wastewater-collection` | `wastewater-collection` | wwc-1 | 120 |
| `/tools/practice/operator-math` | `operator-math` | operator-math-1 | 110 |
| `/tools/practice/regulations` | `regulations` | regulations-1 | 103 |

Internal bank ids (`wt-1` etc.) still resolve, so nothing written before
the split breaks. A value matching neither renders a visible error with a
link to the hub; it deliberately does **not** fall back to the picker,
because a typo used to paint the hub's six cards onto a discipline page
silently.

Wrapper: class `.zip-practice-embed`, min-heights **desktop ~820 / tablet
~820 / mobile-landscape ~900 / mobile-portrait ~1200**. Lower than the
hub's because this mounts one card, not six. Re-tune after the first real
render.

### The server-rendered body: THIS IS THE BLOCKING PART

Each page's build precondition is a genuinely unique server-rendered body,
"the discipline's topic breakdown as real HTML, plus 5 to 10 worked sample
questions present in the page source, not only in the JS embed." **The
embed alone does not satisfy it.** The served HTML of the current hub says
"This tool requires JavaScript" and nothing else; six clones of that are
thin and near-duplicate at once.

Generated per page, ready to paste, in `page-content/`:

| Page | Fragment | Body text | Samples |
|---|---|---|---|
| water-treatment | `page-content/water-treatment.html` | 7,161 chars | 8 |
| water-distribution | `page-content/water-distribution.html` | 8,779 chars | 8 |
| wastewater-treatment | `page-content/wastewater-treatment.html` | 8,757 chars | 8 |
| wastewater-collection | `page-content/wastewater-collection.html` | 6,489 chars | 8 |
| regulations | `page-content/regulations.html` | 5,938 chars | 8 |
| operator-math | `page-content/operator-math.html` | 3,917 chars | 8 |

Measured: worst-case cross-page sentence overlap is **4%**, against the
~1,200 characters of near-identical copy the precondition flagged.

Each fragment holds a subject-area table with real counts, the topics
covered, and 8 worked questions with all four choices, the answer marked in
text, the explanation, and the formula or citation. Everything is counted
from the bank at build time, so a page can quote a number without anyone
checking it by hand.

There is a matching `page-content/<slug>.json` per page with the same facts
as data (question count, per-domain counts, topic count, difficulty split)
if the page copy needs to state a number.

**Do not hand-edit the fragments.** Rerun `npm run build:page-content`; CI
diffs them and fails if they are stale.

Place the fragment as page body content, with the embed mounted on top of
it. Style it with the `zpt-` classes it carries.

### The hub, once the six are live

Add `data-child-pages="1"` to the hub's own embed on `/tools/practice`.
The six picker cards become real links to `/tools/practice/<slug>` instead
of launching in place, so the URL built to rank for a discipline is the one
that gets the engagement.

**Leave it off until all six pages are published**, or the hub links to
404s. It is one attribute, added last.

The hub embed also wants its `src` moved to `practice-v1.4.0.js` to pick up
the blank-description fix: five of the six cards currently render an empty
description paragraph in production.

---

## 2. The three manager calculators

Three pages that are live "Coming soon" banners today. One bundle, one tool
pinned per page.

```html
<div id="ziptility-manager-tools" data-tool="repair-or-replace">
  <noscript>This tool requires JavaScript. Please enable it to use the free calculator.</noscript>
</div>
<script defer src="https://blakeandersonziptility.github.io/ziptility-tools/dist/manager-v1.0.0.js"></script>
```

| Page URL | `data-tool` |
|---|---|
| `/tools/repair-or-replace` | `repair-or-replace` |
| `/tools/cost-of-turnover` | `cost-of-turnover` |
| `/tools/energy-cost` | `energy-cost` |

`?tool=<id>` on the URL works the same way. An unknown id fails visibly
rather than guessing.

Wrapper: class `.zip-manager-embed`. Start at **desktop ~1100 / tablet
~1200 / mobile-portrait ~1900** and re-tune after the first render;
repair-or-replace is the tallest of the three.

Lane rules these pages are built to, and which CI enforces: no demo CTA, no
pricing, no logo, and no gate in front of the result. The soft "email or
print this result" appears only below a rendered result. Completion is the
conversion; a demo click on these pages is not a tools KPI.

Each page still needs its own page doc §6/§7 rewritten from placeholder to
tool, and GA4 completion tracking.

---

## 3. The Utility Health Report Card

**Not released. Do not build the page yet.** Two things are open, both for
Blake, both recorded in `src/reportcard/config.js`:

1. **Red-line set, 6 or 7.** The workbook marks seven; the signed ruling
   D26 names six. Default is six.
2. **Citation clearance.** All 23 citation rows still read
   `[VERIFY all primary citations before publication]`. That pass is the
   real launch gate.

The tool itself is built and its scoring is tested against the workbook's
own Methodology sheet. This section updates when those two clear.

---

## 4. What changed under the existing pages

**`/tools/calculator`** should move to the next calculator release. Every
deep link the practice tests emit (`/tools/calculator#chlorine-dose` and 27
others) was dead: cards carried no id, and the grid renders one category at
a time so the target card was not in the document at all. Both are fixed
and all 28 are verified to land on their card. Until the embed is
repointed, those links keep dropping readers at the top of a page of 50+
calculators.

**`/tools/practice`** wants `practice-v1.4.0.js` for the blank-description
fix, whether or not the six pages ship at the same time.

---

## 5. Registration each new page still owes

Standard W7 mechanics, unchanged by anything here: `INDEX.md` row in tree
position, url-build-contract row, sitemap membership, self-canonical, lane
member list, status rollup, and a LEDGER row if a site-wide ruling rides
along. Tools pages carry **WebPage + BreadcrumbList only** (D13): no
FAQPage, no SoftwareApplication, no Offer, no ratings.

Production publish is Blake's typed word. Staging is autonomous.
