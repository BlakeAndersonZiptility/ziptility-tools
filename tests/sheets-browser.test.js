// Browser tests for the formula-sheets bundle against sheets.html (the generated mirror of the
// live page's structure). Run `npm run build:sheets:dev && node scripts/build-sheets-preview.mjs`
// first (test:sheets:browser does). Same harness idioms as browser.test.js.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { SHEETS } from '../src/sheets/lines.js';
import { SHEETS_PDF } from '../src/shared/sheets-pdf.js';

const PREVIEW = 'file://' + fileURLToPath(new URL('../sheets.html', import.meta.url));
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log('FAIL: ' + name); } };
const total = SHEETS.reduce((n, s) => n + s.blocks.reduce((m, b) => m + b.lines.length, 0), 0);
const changed = SHEETS.flatMap((s) => s.blocks.flatMap((b) => b.lines)).filter((l) => l.si !== l.imp).length;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const jsErrors = []; page.on('pageerror', (e) => jsErrors.push(e.message));
const pushes = [];
await page.addInitScript(() => { window.dataLayer = []; const orig = window.dataLayer.push.bind(window.dataLayer); window.dataLayer.push = (x) => { window.__pushes = (window.__pushes || []).concat([x]); return orig(x); }; });
await page.evaluate(() => { try { localStorage.removeItem('zip-units'); } catch (e) {} }).catch(() => {});
await page.goto(PREVIEW, { waitUntil: 'load' });
await page.waitForSelector('#ziptility-sheets .zs-seg');

ok('strip renders in the hero mount, US customary pressed', await page.evaluate(() => {
  const b = [...document.querySelectorAll('#ziptility-sheets .zs-seg button')];
  return b.length === 2 && b[0].getAttribute('aria-pressed') === 'true' && b[1].getAttribute('aria-pressed') === 'false';
}));
ok('desktop: strip buttons are the compact 38px, the calculator strip\'s desktop height', await page.evaluate(() => [...document.querySelectorAll('#ziptility-sheets .zs-seg button')].every((b) => b.getBoundingClientRect().height >= 38)));
ok('every sheet got a "Print this sheet" button after its title', await page.evaluate(() => document.querySelectorAll('.zs-sheet-tools .zs-print-one').length === 4));
ok('the PDF link sits in the strip, US customary file while US customary is pressed, opens in a new tab', await page.evaluate((u) => { const a = document.querySelector('#ziptility-sheets .zs-dl'); return !!a && a.href === u && a.target === '_blank' && /US customary/.test(a.textContent); }, SHEETS_PDF.imperial));
ok('nothing on the page is gated: no form, no email field, all 4 sheets and every print button usable', await page.evaluate(() => !document.querySelector('form, input[type=email], .zs-offer') && document.querySelectorAll('section[id] .state-richtext li').length > 0 && document.querySelectorAll('.zs-print-one').length === 4));
ok('print buttons carry distinct accessible names', await page.evaluate(() => new Set([...document.querySelectorAll('.zs-print-one')].map(b => b.getAttribute('aria-label'))).size === 4));
ok('all formula lines are the US text before any flip', await page.evaluate((n) => document.querySelectorAll('section[id] .state-richtext li').length === n, total));

await page.click('#ziptility-sheets .zs-seg button[data-sys="metric"]');
const after = await page.evaluate(() => [...document.querySelectorAll('section[id] .state-richtext li')].map((li) => li.textContent));
const invariant = new Set(SHEETS.flatMap((s) => s.blocks.flatMap((b) => b.lines)).filter((l) => l.si === l.imp).map((l) => l.imp));
ok('metric: no rewritten line still says gallons, MGD, psi or 8.34', after.filter((t) => !invariant.has(t)).every((t) => !/\b(gallons?|MGD|psi)\b|8\.34/.test(t)));
ok('metric: exactly the rewritten lines changed', after.filter((t) => !invariant.has(t)).length === changed);
ok('metric: the pounds formula reads as kilograms per day', after.some((t) => /Kilograms per day = concentration \(mg\/L\) × flow \(ML\/d\)/.test(t)));
ok('metric: the "Pounds, dosage, and loading" heading reads Kilograms, and no heading still says Pounds', await page.evaluate(() => { const hs = [...document.querySelectorAll('section[id] h2')].map(h => h.textContent); return hs.some(h => /^Kilograms, dosage/.test(h)) && !hs.some(h => /Pounds/.test(h)); }));
ok('metric: no grains per gallon on the metric sheet', after.every((t) => !/grain per gallon/.test(t)));
ok('metric button now pressed and remembered', await page.evaluate(() => document.querySelector('#ziptility-sheets .zs-seg button[data-sys="metric"]').getAttribute('aria-pressed') === 'true' && localStorage.getItem('zip-units') === 'metric'));
ok('metric: the PDF link now points at the metric file', await page.evaluate((u) => { const a = document.querySelector('#ziptility-sheets .zs-dl'); return a.href === u && /metric/.test(a.textContent); }, SHEETS_PDF.metric));

await page.reload({ waitUntil: 'load' }); await page.waitForSelector('#ziptility-sheets .zs-seg');
ok('metric survives a reload (first paint is SI)', await page.evaluate(() => [...document.querySelectorAll('section[id] .state-richtext li')].every((li) => !/8\.34/.test(li.textContent))));

// Print: the title carries the system, and a single-sheet print isolates its section.
const baseTitle = await page.title();
await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
ok('beforeprint names the system in the document title', (await page.title()) === 'Ziptility operator formula sheets (metric)');
await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
ok('afterprint restores the title', (await page.title()) === baseTitle);
await page.evaluate(() => { window.print = () => window.dispatchEvent(new Event('beforeprint')); });
await page.click('#water-distribution .zs-print-one');
ok('print-one: body flagged and the chosen sheet targeted', await page.evaluate(() => document.body.classList.contains('zs-print-one') && document.getElementById('water-distribution').classList.contains('zs-target')));
ok('print-one: the title names the sheet', (await page.title()) === 'Ziptility operator formula sheets (metric, Water distribution formula sheet)');
await page.emulateMedia({ media: 'print' });
ok('print-one: other sheets are hidden in print media, the target stays', await page.evaluate(() => getComputedStyle(document.getElementById('water-treatment')).display === 'none' && getComputedStyle(document.getElementById('water-distribution')).display !== 'none'));
ok('print: the hero and the whole strip (PDF link included) are hidden in print media', await page.evaluate(() => getComputedStyle(document.getElementById('main')).display === 'none' && getComputedStyle(document.getElementById('ziptility-sheets')).display === 'none'));
await page.emulateMedia({ media: 'screen' });
await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
ok('afterprint clears the print-one state', await page.evaluate(() => !document.body.classList.contains('zs-print-one') && !document.querySelector('.zs-target')));
const pushed = await page.evaluate(() => window.__pushes || []);
ok('a print pushes tool_complete for formula-sheets with the system as tool_mode', pushed.some((p) => p.event === 'tool_complete' && p.tool_name === 'formula-sheets' && p.tool_mode === 'metric' && p.tool_calc === 'water-distribution'));
await page.evaluate(() => { document.querySelector('#ziptility-sheets .zs-dl').addEventListener('click', (e) => e.preventDefault()); });
await page.click('#ziptility-sheets .zs-dl');
ok('a PDF click pushes tool_complete with calc pdf and the pressed system as tool_mode', (await page.evaluate(() => window.__pushes || [])).some((p) => p.event === 'tool_complete' && p.tool_name === 'formula-sheets' && p.tool_mode === 'metric' && p.tool_calc === 'pdf'));

await page.click('#ziptility-sheets .zs-seg button[data-sys="imperial"]');
ok('flip back restores every US line', await page.evaluate(() => [...document.querySelectorAll('section[id] .state-richtext li')].some((li) => /8\.34/.test(li.textContent))));
await page.evaluate(() => { try { localStorage.removeItem('zip-units'); } catch (e) {} });

await page.setViewportSize({ width: 375, height: 812 });
// The 44px tap-target floor. Measured on staging 2026-09-16 (sheets-v1.0.2 at 375x812): both strip buttons and all
// four "Print this sheet" buttons were 36px. Seven tap targets since 1.1.0 (the PDF link joined the strip), none vacuous.
ok('375x812: every strip button, the PDF link and every "Print this sheet" button measures at least 44px', await page.evaluate(() => { const b = [...document.querySelectorAll('#ziptility-sheets .zs-seg button, #ziptility-sheets .zs-dl, .zs-print-one')]; return b.length === 7 && b.every((x) => { const r = x.getBoundingClientRect(); return r.height >= 44 && r.width >= 44; }); }));
ok('375px: short note shown, long note hidden, strip under 100px tall (the compact masthead rule)', await page.evaluate(() => { const s = document.querySelector('#ziptility-sheets'); const sh = s.querySelector('.zs-short'), lg = s.querySelector('.zs-long'); return getComputedStyle(sh).display !== 'none' && getComputedStyle(lg).display === 'none' && s.getBoundingClientRect().height < 100; }));

ok('no page errors', jsErrors.length === 0);
await browser.close();
console.log(`\n${pass} passed, ${fail} failed; JS errors: ${jsErrors.length ? jsErrors.join('; ') : 'none'}`);
process.exit(fail ? 1 : 0);
