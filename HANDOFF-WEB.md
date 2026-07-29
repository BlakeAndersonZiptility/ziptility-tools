# Handoff to the Webflow build

Everything a page build needs from this repo: the embed to paste, the
attributes to set, and where the server-rendered body copy lives.

Runtime truth is the live embed on the page, never this file (LEDGER
L-005). Versions below are what was live or newly cut on 2026-07-29; to
know what is serving right now, read the page.

**Released and serving from the CDN as of 2026-07-29** (each verified HTTP
200 and driven in a browser from the CDN, not from a dev build):

| Artifact | Status |
|---|---|
| `practice-v1.5.0.js` | released, not yet pointed at by any page (supersedes v1.4.0; adds the contrast fix) |
| `manager-v1.1.0.js` | released, not yet pointed at by any page (supersedes v1.0.0; adds the design-audit fixes) |
| `calculator-v2.7.0.js` | released, not yet pointed at by any page (supersedes v2.6.0; adds the contrast and mobile-gate fixes) |
| `reportcard-v1.0.0.js` | released, not yet pointed at by any page |

Nothing on the live site has moved. Every page still serves the version it
served this morning, because a page only changes when its `src` changes,
and that is Blake's call.

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
<script defer src="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-v1.5.0.js"></script>
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

The hub embed also wants its `src` moved to `practice-v1.5.0.js` to pick up
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
<script defer src="https://blakeandersonziptility.github.io/ziptility-tools/dist/manager-v1.1.0.js"></script>
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

**Both former blockers are cleared** (Blake, 2026-07-29): the red-line set
is **seven** (T5, T7, T8, M3, M8, F1, F2, matching the workbook, superseding
D26's six), and the citations stand as they are.

```html
<div id="ziptility-report-card">
  <noscript>This tool requires JavaScript. Please enable it to use the free report card.</noscript>
</div>
<script defer src="https://blakeandersonziptility.github.io/ziptility-tools/dist/reportcard-v1.0.0.js"></script>
```

Wrapper: class `.zip-reportcard-embed`. This one changes height a lot
between its three screens, so pin the min-height to the LANDING screen and
let the rest grow: start at **desktop ~900 / tablet ~1000 / mobile-portrait
~1400** and re-tune after the first render.

**Three things about this tool that are not obvious from the embed:**

1. **Intake is deliberately blind.** While answering, a rung shows only its
   description: no A-to-F letter, no ordinal word, no rank colour, and in a
   shuffled order that is fixed for the life of that assessment. That is
   what makes the answers worth analysing rather than counting, and it is a
   ruling, not a style choice. Letters and labels return in full on results.
2. **It is ungated and must stay that way** (R14). No email for the score.
   The closing profile block is optional, skipping shows the identical
   report, and CI fails the build if a gate appears.
3. **The printed report is a deliverable, not a byproduct.** Boards print
   these. It carries the logo, the title and the date, and page breaks are
   set so a dimension never splits across pages.

**One thing still owed before the survey data is worth anything:** the
HubSpot form does not exist yet. `HUBSPOT-FORM-SPEC.md` has the exact
fields. Until its GUID goes into `src/reportcard/config.js`, the tool works
completely and sends nothing.

---

## 4. What changed under the existing pages

**`/tools/calculator`** should move to **`calculator-v2.7.0.js`**, which
carries two changes.

*Deep links.* Every link the practice tests emit
(`/tools/calculator#chlorine-dose` and 27 others) was dead: cards carried
no id, and the grid renders one category at a time so the target card was
not in the document at all. Both fixed, all 28 verified to land. Until the
embed is repointed, those links keep dropping readers at the top of a page
of 50+ calculators.

*The demo CTA band is gone.* The tool body carried a Ziptility product
paragraph and a "Book a demo" link. That is commercial framing inside an
ungated tool, on the lane where completion is the conversion and where
scoring a demo click as success is lane bleed by name. The global nav
carries the demo button as chrome, which is where it belongs. The free
formula sheet stays, reworded as an offer rather than a pitch, still below
the working calculators so it is never a gate. **The HubSpot form id from
STF-14 is untouched and still fires.**

### A design audit ran on all four bundles (2026-07-29)

Every bundle FAILED the Look Bar's 7 floor on first pass, and not on taste.
The fixes are in the versions above. Two things worth carrying forward:

**Raw tomato `#ff442f` is not readable as text.** Measured 3.37:1 against
white in both directions, under the 4.5:1 floor, and canon already said so.
Both bundles had made the mistake independently, on Calculate buttons, the
CTA, link text, the practice hub's primary button and its eyebrows. Text
and text-bearing fills now use tomato-press `#c02100`, or midnight on
tomato where a prior ruling pins the fill. Raw tomato stays correct for
borders, icons and rules, which only owe 3:1.

**A DS token being canon does not make a PAIR of tokens accessible.**
Measured on their own DS tint backgrounds, `--danger` is 4.41:1,
`--success` 3.15:1 and `--warning` 3.07:1. The `-fg` variants pass and are
what shipped. Anything binding a semantic colour to its own tint should
measure rather than assume.

### No tool renders a brand mark ON SCREEN. One does in print.

Checked at runtime across all four bundles, not by grep: **on screen**,
zero images, zero logo elements, zero logo background-images, zero brand
SVGs, zero demo links. On the live page the Webflow global header and
footer wrap the tool and carry the brand; a logo inside the bundle would be
the brand twice on one screen.

**The report card is the one exception, and only in print** (Blake ruling
2026-07-29). A printed report goes into a board packet with no page chrome
around it, so it carries the navy horizontal mark with the report title and
date. It is `display:none` on screen and `display:flex` under print, and
`check-neutral-lane.mjs` enforces exactly that: print-scoped brand
identifiers are exempt from the no-logo rule, and a separate check requires
any such class to be hidden in the screen cascade, so the exemption cannot
be used to sneak a visible logo in.

The calculator's stylesheet did still carry dead `.brand` / `.brand .word`
/ `.brand .zip-logo` rules for markup v2 has never rendered, under a
comment reading "OFFICIAL LOGO SLOT: replace .word with Ziptility Brand
Logo.svg". Nothing rendered from it, but it read as an instruction to add
one back. Removed in v2.6.0.

Both properties now run in CI (`scripts/check-neutral-lane.mjs`) on all
four bundles, because both had drifted back in once already.

**`/tools/practice`** wants **`practice-v1.5.0.js`** for the
blank-description fix, whether or not the six pages ship at the same time.
Five of its six cards render an empty description in production today.

### A provenance note on what is serving right now

`calculator-v2.4.1.js`, the version production serves until that repoint,
has **no tag and no GitHub Release**. It was built and committed by hand in
`dc75a6f` and `f5f6bff`, bypassing the release workflow, so it carries no
workflow SHA banner either. Nothing is wrong with the bytes; they are what
has been serving since 2026-07-25 and they hold the live HubSpot form GUID.
It is only that "which commit produced production" is a `git log` search
rather than a tag.

Deliberately not backfilled: pushing a `v2.4.1` tag now would trigger the
release workflow, which would correctly refuse ("versions are immutable")
and leave a red failed run that reads like a problem when it is not.
`v2.5.0` was cut through the workflow properly, so the gap closes on its
own the moment the embed is repointed.

---

## 5. Registration each new page still owes

Standard W7 mechanics, unchanged by anything here: `INDEX.md` row in tree
position, url-build-contract row, sitemap membership, self-canonical, lane
member list, status rollup, and a LEDGER row if a site-wide ruling rides
along. Tools pages carry **WebPage + BreadcrumbList only** (D13): no
FAQPage, no SoftwareApplication, no Offer, no ratings.

Production publish is Blake's typed word. Staging is autonomous.
