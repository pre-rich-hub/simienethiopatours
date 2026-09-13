// Local QA API only. Never imported by the application or deployed as its backend.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
const source = JSON.parse(readFileSync(new URL('../lib/generated/catalogue.json', import.meta.url))).catalogue;
let catalogue;
let mode = 'live';
function reset() {
  catalogue = structuredClone(source);
  catalogue.posts = [{ slug: 'qa-field-story', blogTitle: 'QA field story', description: 'A local test article.', content: 'QA article paragraph.\n\n<script>window.qaInjected = true</script>', author: 'QA fixture author', imageUrl: null, imageAlt: null, category: { slug: 'qa-notes', name: 'QA notes' }, publishedAt: '2026-09-12T00:00:00.000Z', updatedAt: '2026-09-13T00:00:00.000Z', locale: 'en', availableLocales: ['en'], path: '/journal/qa-field-story' }];
  mode = 'live';
}
reset();
createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/__qa') {
    const chunks = []; for await (const c of req) chunks.push(c);
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    if (input.action === 'reset') reset();
    if (input.action === 'mode') mode = input.mode;
    if (input.action === 'rename') catalogue.tours.find(t => t.slug === input.slug).tourName = input.title;
    if (input.action === 'unpublish') {
      catalogue.tours = catalogue.tours.filter(t => t.slug !== input.slug);
      catalogue.destinations.forEach(d => { d.tourSlugs = d.tourSlugs.filter(slug => slug !== input.slug); });
    }
    if (input.action === 'add') catalogue.tours.push({ ...structuredClone(catalogue.tours[0]), slug: 'qa-new-tour', path: '/treks/qa-new-tour', tourName: 'QA new tour' });
    res.end(JSON.stringify({ ok: true })); return;
  }
  if (url.pathname === '/api/v1/catalogue') {
    if (mode === 'outage') { res.statusCode = 503; res.end('{}'); return; }
    if (mode === 'invalid') { res.end('{'); return; }
    if (mode === 'timeout') { setTimeout(() => { res.statusCode = 503; res.end('{}'); }, 1500); return; }
    res.end(JSON.stringify({ status: 'ok', data: mode === 'empty' ? { schemaVersion: 1, tours: [], destinations: [], posts: [] } : catalogue })); return;
  }
  res.end(JSON.stringify({ status: 'ok', data: [] }));
}).listen(5105, '127.0.0.1', () => console.log('P4 local fixture API: http://127.0.0.1:5105'));
