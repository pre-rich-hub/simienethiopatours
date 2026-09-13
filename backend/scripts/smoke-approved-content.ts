import assert from "node:assert/strict";
import { journeyPackages } from "@/lib/journey-packages";
import { simienPlaces } from "@/lib/simien-destinations";
import { gondarPlaces } from "@/lib/gondar-destinations";

const origin = process.argv[2] ?? "http://127.0.0.1:3100";
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
const pages = [
  ...journeyPackages.map((j: any) => ({
    path: "/en/treks/" + j.slug,
    copy: [j.name, j.duration, j.route, j.difficulty, ...j.overview, ...j.highlights, ...j.included, ...j.excluded,
      ...(j.days ?? []).flatMap((d: any) => d.paragraphs),
      ...(j.segments ?? []).map((s: any) => s.body),
      ...(j.itineraryNotes ?? []), ...(j.itineraryIntro ? [j.itineraryIntro] : [])],
  })),
  ...simienPlaces.map((p: any) => ({ path: "/en/simien-mountains/" + p.slug, copy: [p.location, ...p.about, ...p.highlights, ...p.thingsToDo] })),
  ...gondarPlaces.map((p: any) => ({ path: "/en/gondar/" + p.slug, copy: [p.location, ...p.about, ...p.highlights, ...p.thingsToDo] })),
];
for (const page of pages) {
  const response = await fetch(new URL(page.path, origin));
  assert.equal(response.status, 200, page.path);
  const html = await response.text();
  // Check real rendered HTML, not serialized React data or JSON-LD.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const text of page.copy) assert.ok(markup.includes(escapeHtml(text)), page.path + ": missing copy: " + text);
  assert.ok(!markup.includes("Exact details are confirmed in your written proposal"), page.path);
}
console.log(`Approved content smoke passed: ${pages.length} pages, all supplied content sections rendered.`);
