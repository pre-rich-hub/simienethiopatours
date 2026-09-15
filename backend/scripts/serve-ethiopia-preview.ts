/** Loopback-only preview API. No database connection; never used in deployment. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { loadExpansion, buildExpansionPreview } from './lib/ethiopia-expansion.js';
import { loadJourneyExpansion, buildJourneyExpansionPreview } from './lib/journey-expansion.js';
const snapshot=JSON.parse(await readFile(new URL('../../frontend/lib/generated/catalogue.json',import.meta.url),'utf8'));
const destinationCatalogue=buildExpansionPreview(snapshot.catalogue,await loadExpansion());
const catalogue=buildJourneyExpansionPreview(destinationCatalogue,await loadJourneyExpansion());
const port=Number(process.env.ETHIOPIA_PREVIEW_PORT||5106);
createServer((req,res)=>{
 res.setHeader('Content-Type','application/json');
 if(req.method==='GET'&&req.url==='/api/v1/catalogue'){res.end(JSON.stringify({status:'ok',data:catalogue}));return;}
 res.statusCode=503;res.end(JSON.stringify({status:'preview fixture: catalogue only'}));
}).listen(port,'127.0.0.1',()=>console.log(`Ethiopia preview: http://127.0.0.1:${port} (${catalogue.destinations.length} localized destinations)`));
