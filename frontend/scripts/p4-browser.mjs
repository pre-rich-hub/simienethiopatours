import WebSocket from '../node_modules/next/dist/compiled/ws/index.js';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
export async function checkBrowser(start, base) {
  const profile = await mkdtemp('/tmp/p4-browser-');
  const chrome = start('/usr/bin/google-chrome', ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--remote-debugging-port=9225', `--user-data-dir=${profile}`, 'about:blank']);
  let target;
  for (let i = 0; i < 50; i++) { try { target = await (await fetch('http://127.0.0.1:9225/json/new?about:blank', { method: 'PUT' })).json(); break; } catch {} await delay(100); }
  assert.ok(target?.webSocketDebuggerUrl, 'Chrome debugging endpoint');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => ws.once('open', resolve));
  let id = 0; const pending = new Map(); const errors = [];
  ws.on('message', raw => { const message = JSON.parse(raw); if (message.id) { const entry = pending.get(message.id); pending.delete(message.id); if (message.error) entry.reject(message.error); else entry.resolve(message.result); } if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text); });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
  await send('Page.enable'); await send('Runtime.enable');
  const results = [];
  try {
    for (const width of [390, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: width === 390 ? 844 : 1000, deviceScaleFactor: 1, mobile: width === 390 });
      for (const path of ['/en', '/en/treks/simien-day-trip', '/en/simien-mountains/imet-gogo', '/en/journal/qa-field-story']) {
        await send('Page.navigate', { url: base + path });
        for (let i = 0; i < 40; i++) { await delay(100); if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`)) break; }
        await delay(700);
        const metrics = await evaluate('({ viewport: innerWidth, document: document.documentElement.scrollWidth, injected: Boolean(window.qaInjected), heading: document.querySelector("h1")?.textContent })');
        assert.ok(metrics.document <= metrics.viewport + 1, `${path} overflows at ${width}px: ${JSON.stringify(metrics)}`);
        assert.equal(metrics.injected, false); assert.ok(metrics.heading);
        results.push(`${width}px ${path}: no horizontal overflow or injected script`);
      }
      if (width === 390) {
        await evaluate('document.querySelector("button[aria-controls=mobile-menu]").click()'); await delay(300);
        assert.equal(await evaluate('document.querySelector("#mobile-menu").open'), true);
        await evaluate('document.querySelector("#mobile-menu button").click()'); await delay(300);
        assert.equal(await evaluate('document.querySelector("#mobile-menu").open'), false);
        assert.equal(await evaluate('document.activeElement.getAttribute("aria-controls")'), 'mobile-menu');
        results.push('Mobile dialog opens, closes and restores focus');
      } else {
        await evaluate('document.querySelector("button[aria-controls=journeys-menu-menu]").click()'); await delay(300);
        assert.equal(await evaluate('document.querySelector("#journeys-menu-menu").getAttribute("aria-hidden")'), 'false');
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        await writeFile('docs/p4-screenshots/desktop-cms-menu.png', Buffer.from(screenshot.data, 'base64'));
        results.push('Desktop journey menu opens with CMS records');
      }
    }
    assert.deepEqual(errors, [], 'No uncaught browser errors');
    return results;
  } finally { ws.close(); chrome.kill('SIGTERM'); }
}
