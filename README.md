# Ziptility free tools

Free tools for the people who run small water and wastewater systems. No
login, no signup, nothing gated.

| Bundle | Live at | Tags | Source |
|---|---|---|---|
| Operator calculator | [/tools/calculator](https://www.ziptility.com/tools/calculator) | `v*` | `src/` |
| Practice tests | [/tools/practice](https://www.ziptility.com/tools/practice) + six per-discipline pages | `practice-v*` | `src/practice/` |
| Manager calculators | `/tools/repair-or-replace`, `/tools/cost-of-turnover`, `/tools/energy-cost` | `manager-v*` | `src/manager/` |
| Utility Health Report Card | `/tools/report-card` (unreleased) | `reportcard-v*` | `src/reportcard/` |

Each bundle has its own tag family and its own release workflow, so one
tool's cadence never forces another's.

**Building a page from any of these? Read [HANDOFF-WEB.md](HANDOFF-WEB.md)**:
the embed to paste, the attributes to set, and where each page's
server-rendered body copy lives.

## How it deploys

GitHub Pages serves this repo (`main` branch). The Webflow page contains only a
mount div and one script:

```html
<div id="ziptility-calculator"><noscript>This calculator requires JavaScript.</noscript></div>
<script defer src="https://blakeandersonziptility.github.io/ziptility-tools/dist/calculator-vX.Y.Z.js"></script>
```

The bundle renders the whole tool (markup, styles, behavior) into the mount
div. The Webflow page keeps the global site nav/footer and the SEO copy
(server-rendered). **Versioned artifacts are immutable** — pushing to `main`
never changes what visitors see; only repointing the Webflow `src` does.

## Repo layout

```
src/
  main.js              entry — mounts, injects fonts/styles/shell
  config.js            lead-capture config (HubSpot portal/form)
  constants.js         shared math constants (8.34, 7.48, 2.3067, …)
  units.js             unit table + conversion
  calc-helpers.js      convSolve / converter / countNN
  registry.js          assembles calculators[] + CAT_ORDER, validates schema
  calculators/         one file per category — add calculators here
  ui/                  template.js, render.js, lead.js, styles.css
  domains.js           subject-area labels, shared by the quiz chips and the
                       generated discipline-page tables (two copies drifted)
  practice/            practice-test bundle (manifest, banks loader, quiz engine)
  manager/             the three manager calculators (own registry)
  reportcard/          Utility Health Report Card (23-dimension TMF assessment)
banks-src/             practice question banks, one JSON per test
page-content/          GENERATED server-rendered body for the six discipline
                       pages. Do not hand-edit; run `npm run build:page-content`
scripts/               bank build, page-content build, neutral-lane check
tests/                 solvers, practice (logic/schema/browser), manager,
                       reportcard, page-content, cross-tool-links
webflow/               embed snippets + legacy page snapshot (rollback insurance)
calculator.js          LEGACY v1 monolith — still what the live page loads
                       until the v2 cutover; do not edit
```

## Tests

`npm run test:all` runs every non-browser suite (111 tests). The two
Playwright suites run separately: `npm run test:browser` (calculator) and
`node tests/practice-browser.test.js` (practice).

Two checks exist because the failure they catch is invisible otherwise:

- `test:cross-tool` — practice questions link to calculator ids
  (`/tools/calculator#chlorine-dose`). The bundles ship on separate release
  trains, so a rename on one side breaks the other with nothing noticing.
- `check-neutral-lane.mjs` — the free tools sit in an ungated lane where a
  gate in front of the value is a defect by rule. That is policy, not
  style, so it runs in CI rather than at review.

## Adding a calculator

Append one object to the matching file in `src/calculators/`:

```js
{ id:"my-calc", cat:"Flow & Pressure", domains:["water"],
  title:"My Calculator", formula:"A × B = C", note:"Enter any two values.",
  fields:[{k:"a",label:"A"},{k:"b",label:"B"},{k:"c",label:"C"}],
  solve:(v)=>{ /* return {values, computed, error} */ },
  interpret:(m)=>({level:"info", text:"Plain-English context."}),   // optional
  links:[{label:"Related guide", href:"https://www.ziptility.com/…"}] // optional
}
```

`registry.js` validates every definition in CI (unique kebab-case `id`,
known `cat`, valid `domains`/`fields`/`links`), so mistakes fail the PR,
not the live page. New category = new file + import in `registry.js` +
entry in `CAT_ORDER`. Add a math spot-check to `tests/solvers.test.js`.

## Develop & test

```bash
npm install
npm test               # solver math + schema (node:test)
npm run test:browser   # builds dev bundle + Playwright suite
npm run dev            # watch build + local server → http://localhost:8000
```

`index.html` is the local preview — it mirrors the production embed exactly.
(Circular Std is site-licensed and only loads on ziptility.com, so headings
fall back to Hanken Grotesk locally.)

## Release & rollback runbook

1. Merge to `main` (CI must be green).
2. Cut the release — either way works:
   - **No terminal:** GitHub → Actions tab → "Release" → "Run workflow" →
     enter the new tag (e.g. `v2.1.0`). The workflow creates the tag itself.
   - **From a clone:** `git tag v2.1.0 && git push origin v2.1.0`
   Either path tests, builds `dist/calculator-v2.1.0.js`, commits it, and
   creates a GitHub Release.
3. Wait for the artifact URL to return 200 (GitHub Pages CDN ≈ 10 min):
   `https://blakeandersonziptility.github.io/ziptility-tools/dist/calculator-v2.1.0.js`
4. In Webflow, edit the embed's script `src` to the new filename; publish to
   the **webflow.io staging domain first**, verify, then publish live.
5. **Rollback:** repoint the `src` to the previous version and republish
   (~1 minute). Old artifacts are never deleted or overwritten.

## Gated / in-app embed

Append `?embed=app` to the page URL **or** set `data-embed="app"` on the
mount div: hides the marketing CTA and SEO sections, shows just the tool.

## Lead capture

`src/config.js` — HubSpot portal `4938013` (confirm). Until `hubspotFormId`
is filled with the formula-sheet form GUID, submissions fall back to a
`mailto:` to sales@ziptility.com.
