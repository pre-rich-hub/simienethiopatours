import { checkBrowser } from "./p4-browser.mjs";
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
const base = 'http://127.0.0.1:3105';
const api = 'http://127.0.0.1:5105';
const secret = 'p4-isolated-local-test';
const children = [];
const logs = [];
const results = [];
function start(command, args, options = {}) {
  const child = spawn(command, args, { env: { ...process.env, API_URL: api, CATALOGUE_REVALIDATE_SECRET: secret }, stdio: ['ignore', 'pipe', 'pipe'], ...options });
  child.stdout.on('data', b => logs.push(b.toString())); child.stderr.on('data', b => logs.push(b.toString())); children.push(child); return child;
}
async function ready(url) { for (let i = 0; i < 80; i++) { try { if ((await fetch(url)).ok) return; } catch {} await delay(250); } throw new Error(`Server unavailable: ${url}`); }
async function page(path) { const res = await fetch(base + path, { redirect: 'manual', headers: { 'User-Agent': 'Googlebot' } }); return { status: res.status, body: await res.text(), location: res.headers.get('location') }; }
async function check(name, fn) { await fn(); results.push(name); console.log(`PASS ${name}`); }
async function invalidate() { assert.equal((await fetch(base + '/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${secret}` } })).status, 200); }
async function change(body) { await fetch(api + '/__qa', { method: 'POST', body: JSON.stringify(body) }); await invalidate(); }
try {
  start(process.execPath, ['scripts/p4-fixture-server.mjs']); await ready(api + '/api/v1/catalogue');
  start(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3105']); await ready(base + '/en');
  await invalidate();
  await check('CMS tour listing and stable detail', async () => {
    const listing = await page('/en/treks'); assert.equal(listing.status, 200); assert.match(listing.body, /4-Day Simien Classic/);
    const detail = await page('/en/treks/simien-day-trip'); assert.equal(detail.status, 200); assert.match(detail.body, /TouristTrip/); assert.match(detail.body, /Morning/);
  });
  await check('Destination hubs and related journeys', async () => {
    const hub = await page('/en/explore-ethiopia'); assert.equal(hub.status, 200); assert.match(hub.body, /Lake Tana/);
    const gondar = await page('/en/gondar'); assert.equal(gondar.status, 200); assert.doesNotMatch(gondar.body.match(/id="destinations"[\s\S]*?<\/section>/)?.[0] ?? '', /\/gondar\/lalibela/);
    const place = await page('/en/simien-mountains/imet-gogo'); assert.equal(place.status, 200); assert.match(place.body, /Routes that pass through here/);
  });
  await check('Untranslated detail redirects and hreflang', async () => {
    const redirect = await page('/fr/treks/simien-day-trip'); assert.equal(redirect.status, 307); assert.equal(redirect.location, '/en/treks/simien-day-trip');
    const detail = await page('/en/treks/simien-day-trip'); assert.match(detail.body, /hrefLang="en"/); assert.doesNotMatch(detail.body.split("</head>")[0], /hrefLang="(?:es|de|fr)"/);
    const listing = await page('/es/treks'); assert.match(listing.body, /href="\/en\/treks\/simien-day-trip"/);
  });
  await check('Journal article, category, metadata and escaped content', async () => {
    const article = await page('/en/journal/qa-field-story'); assert.equal(article.status, 200); assert.match(article.body, /"@type":"Article"/); assert.match(article.body, /QA fixture author/); assert.doesNotMatch(article.body, /<script>window.qaInjected/);
    assert.equal((await page('/en/journal/category/qa-notes')).status, 200);
    assert.equal((await page('/en/journal/category/missing')).status, 404);
    assert.equal((await page('/en/journal/missing')).status, 404);
    const redirect = await page('/es/journal/qa-field-story'); assert.equal(redirect.status, 307);
  });
  await check('CMS sitemap and actual update dates', async () => {
    const sitemap = await page('/sitemap.xml'); assert.match(sitemap.body, /\/en\/journal\/qa-field-story/); assert.match(sitemap.body, /2026-09-12T00:00:00.000Z/); assert.doesNotMatch(sitemap.body, /\/fr\/treks\/simien-day-trip/);
  });
  await check('Invalidation rejects absent, wrong and non-ASCII credentials', async () => {
    for (const authorization of ['', 'Bearer wrong', 'Bearer éééééééééééééééééééééé']) assert.equal((await fetch(base + '/api/revalidate', { method: 'POST', headers: { Authorization: authorization } })).status, 401);
  });
  await check('Newly published slug appears without rebuilding', async () => {
    await change({ action: 'add' }); const detail = await page('/en/treks/qa-new-tour'); assert.equal(detail.status, 200); assert.match(detail.body, /QA new tour/);
  });
  await check('Edit updates listing, detail metadata and homepage', async () => {
    await change({ action: 'rename', slug: '4-day-simien-classic', title: 'QA updated classic' });
    for (const path of ['/en/treks', '/en/treks/4-day-simien-classic', '/en']) assert.match((await page(path)).body, /QA updated classic/);
  });
  await check('Unpublish removes detail, navigation links and sitemap', async () => {
    await change({ action: 'unpublish', slug: '4-day-simien-classic' }); assert.equal((await page('/en/treks/4-day-simien-classic')).status, 404);
    assert.equal((await fetch(base + '/en/treks/4-day-simien-classic', { headers: { 'User-Agent': 'Mozilla/5.0' } })).status, 404);
    for (const path of ['/en', '/en/treks', '/en/simien-mountains/imet-gogo']) assert.doesNotMatch((await page(path)).body, /href="\/(?:en\/)?treks\/4-day-simien-classic"/);
    assert.doesNotMatch((await page('/sitemap.xml')).body, /\/treks\/4-day-simien-classic/);
  });
  await check('Authoritative empty catalogue does not resurrect bootstrap', async () => {
    await change({ action: 'mode', mode: 'empty' }); assert.equal((await page('/en/treks/simien-day-trip')).status, 404); assert.doesNotMatch((await page('/sitemap.xml')).body, /\/treks\/simien-day-trip/);
  });
  await check('Outage, malformed response and timeout remain bounded', async () => {
    for (const mode of ['outage', 'invalid', 'timeout']) {
      await change({ action: 'mode', mode }); const start = Date.now(); const result = await page('/en/treks'); assert.equal(result.status, 200); assert.ok(Date.now() - start < 2500); assert.doesNotMatch(result.body, /href="\/en\/treks\/simien-day-trip"/);
    }
  });
  await change({ action: 'reset' });
  await check('Service recovery restores published catalogue', async () => { assert.equal((await page('/en/treks/simien-day-trip')).status, 200); });
  if (process.argv.includes('--screenshots')) {
    await mkdir('docs/p4-screenshots', { recursive: true });
    for (const [name, path] of [['home', '/en'], ['destination', '/en/simien-mountains/imet-gogo'], ['tour', '/en/treks/simien-day-trip'], ['journal', '/en/journal/qa-field-story']]) {
      for (const [size, width, height] of [['mobile', 390, 844], ['desktop', 1440, 1000]]) {
        const child = start('/usr/bin/google-chrome', ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', `--window-size=${width},${height}`, `--screenshot=docs/p4-screenshots/${name}-${size}.png`, base + path]);
        await new Promise((resolve, reject) => { child.on('exit', code => code === 0 ? resolve() : reject(new Error('Screenshot failed'))); child.on('error', reject); });
      }
    }
    console.log('Saved eight local fixture screenshots.');
    results.push(...await checkBrowser(start, base));
    console.log('Browser layout, menu, focus and script-safety checks passed.');
  }
  await writeFile('docs/p4-smoke-results.json', JSON.stringify({ fixtureOnly: true, passed: results, count: results.length }, null, 2) + '\n');
} catch (error) { console.error(String(error).slice(0, 1800)); await writeFile('/tmp/p4-smoke-server.log', logs.join('')); process.exitCode = 1; }
finally { for (const child of children) child.kill('SIGTERM'); }
