// Browser tests for the formula-sheets bundle against sheets.html (the generated mirror of the
// live page's structure). Run `npm run build:sheets:dev && node scripts/build-sheets-preview.mjs`
// first (test:sheets:browser does). Same harness idioms as browser.test.js.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { SHEETS } from '../src/sheets/lines.js';

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
ok('strip buttons meet the 36px tap floor', await page.evaluate(() => [...document.querySelectorAll('#ziptility-sheets .zs-seg button')].every((b) => b.getBoundingClientRect().height >= 36)));
ok('every sheet got a "Print this sheet" button after its title', await page.evaluate(() => document.querySelectorAll('.zs-sheet-tools .zs-print-one').length === 4));
ok('the offer renders below the fourth sheet now that a form id is configured', await page.evaluate(() => { const o = document.querySelector('.zs-offer'); return !!o && o.previousElementSibling && o.previousElementSibling.id === 'wastewater-collection'; }));
ok('offer: nothing on the page is gated (all 4 sheets and every print button stay usable)', await page.evaluate(() => document.querySelectorAll('section[id] .state-richtext li').length > 0 && document.querySelectorAll('.zs-print-one').length === 4));
ok('offer: the fine print says it is an offer, never a gate', await page.evaluate(() => /never a gate/.test(document.querySelector('.zs-offer-fine').textContent)));
ok('offer: a bad email is refused client-side without posting', await page.evaluate(async () => { let posted = false; const of = window.fetch; window.fetch = () => { posted = true; return Promise.resolve({ ok: true }); }; document.getElementById('zs-email').value = 'nope'; document.querySelector('.zs-offer-form').dispatchEvent(new Event('submit', { cancelable: true })); await new Promise(r => setTimeout(r, 50)); window.fetch = of; return !posted && /does not look right/.test(document.querySelector('.zs-offer-msg').textContent); }));
ok('offer: a good email posts the four fields and the current system to the HubSpot form', await page.evaluate(async () => { let body = null, url = ''; const of = window.fetch; window.fetch = (u, o) => { url = u; body = JSON.parse(o.body); return Promise.resolve({ ok: true }); }; document.getElementById('zs-name').value = 'Test'; document.getElementById('zs-email').value = 'test@example.com'; document.getElementById('zs-util').value = 'Test utility'; document.querySelector('.zs-offer-form').dispatchEvent(new Event('submit', { cancelable: true })); await new Promise(r => setTimeout(r, 80)); window.fetch = of; const names = body.fields.map(f => f.name); return /be491609-9dff-4488-9823-28c4803b1c47$/.test(url) && names.join(',') === 'firstname,email,company,formula_sheet_system' && body.fields[3].value === 'imperial' && /On its way/.test(document.querySelector('.zs-offer-msg').textContent); }));
ok('all formula lines are the US text before any flip', await page.evaluate((n) => document.querySelectorAll('section[id] .state-richtext li').length === n, total));

await page.click('#ziptility-sheets .zs-seg button[data-sys="metric"]');
const after = await page.evaluate(() => [...document.querySelectorAll('section[id] .state-richtext li')].map((li) => li.textContent));
const invariant = new Set(SHEETS.flatMap((s) => s.blocks.flatMap((b) => b.lines)).filter((l) => l.si === l.imp).map((l) => l.imp));
ok('metric: no rewritten line still says gallons, MGD, psi or 8.34', after.filter((t) => !invariant.has(t)).every((t) => !/\b(gallons?|MGD|psi)\b|8\.34/.test(t)));
ok('metric: exactly the rewritten lines changed', after.filter((t) => !invariant.has(t)).length === changed);
ok('metric: the pounds formula reads as kilograms per day', after.some((t) => /Kilograms per day = concentration \(mg\/L\) × flow \(ML\/d\)/.test(t)));
ok('metric button now pressed and remembered', await page.evaluate(() => document.querySelector('#ziptility-sheets .zs-seg button[data-sys="metric"]').getAttribute('aria-pressed') === 'true' && localStorage.getItem('zip-units') === 'metric'));

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
ok('print: the hero is hidden in print media, the offer too', await page.evaluate(() => getComputedStyle(document.getElementById('main')).display === 'none' && getComputedStyle(document.querySelector('.zs-offer')).display === 'none'));
await page.emulateMedia({ media: 'screen' });
await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
ok('afterprint clears the print-one state', await page.evaluate(() => !document.body.classList.contains('zs-print-one') && !document.querySelector('.zs-target')));
const pushed = await page.evaluate(() => window.__pushes || []);
ok('a print pushes tool_complete for formula-sheets with the system as tool_mode', pushed.some((p) => p.event === 'tool_complete' && p.tool_name === 'formula-sheets' && p.tool_mode === 'metric' && p.tool_calc === 'water-distribution'));

await page.click('#ziptility-sheets .zs-seg button[data-sys="imperial"]');
ok('flip back restores every US line', await page.evaluate(() => [...document.querySelectorAll('section[id] .state-richtext li')].some((li) => /8\.34/.test(li.textContent))));
await page.evaluate(() => { try { localStorage.removeItem('zip-units'); } catch (e) {} });

await page.setViewportSize({ width: 375, height: 740 });
ok('375px: strip buttons >= 36px, short note shown, strip under 100px tall', await page.evaluate(() => { const s = document.querySelector('#ziptility-sheets'); const sh = s.querySelector('.zs-short'), lg = s.querySelector('.zs-long'); return [...s.querySelectorAll('button')].every((b) => b.getBoundingClientRect().height >= 36) && getComputedStyle(sh).display !== 'none' && getComputedStyle(lg).display === 'none' && s.getBoundingClientRect().height < 100; }));

ok('no page errors', jsErrors.length === 0);
await browser.close();
console.log(`\n${pass} passed, ${fail} failed; JS errors: ${jsErrors.length ? jsErrors.join('; ') : 'none'}`);
process.exit(fail ? 1 : 0);
