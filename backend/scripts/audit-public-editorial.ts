import { detailedJourneys } from "@/lib/itineraries";
import { journeyPackages } from "@/lib/journey-packages";
import { gondarPlaces } from "@/lib/gondar-destinations";
import { simienPlaces } from "@/lib/simien-destinations";
import assert from "node:assert/strict";

assert.equal(journeyPackages.length, 28);
assert.equal(simienPlaces.length, 18);
assert.equal(gondarPlaces.length, 15);
for (const collection of [journeyPackages, simienPlaces, gondarPlaces]) {
  assert.equal(new Set(collection.map((item: { slug: string }) => item.slug)).size, collection.length, "Duplicate URL slug");
}
for (const journey of journeyPackages) {
  for (const field of ["overview", "highlights", "included", "excluded"] as const) {
    assert.ok(journey[field]?.length > 0, `${journey.slug}: missing ${field}`);
  }
  assert.ok(journey.days?.length || journey.segments?.length, `${journey.slug}: missing schedule`);
  assert.notEqual(journey.itineraryMode, "outline", `${journey.slug}: placeholder outline`);
  const mapped = detailedJourneys.find((item: { slug: string }) => item.slug === journey.slug);
  assert.ok(mapped, `${journey.slug}: missing seed/fallback detail`);
  assert.deepEqual(mapped.inclusions, journey.included);
  assert.deepEqual(mapped.exclusions, journey.excluded);
  assert.deepEqual(mapped.days, journey.days ?? [{ title: journey.name, subtitle: journey.duration, paragraphs: [], stages: journey.segments }]);
}
for (const place of [...simienPlaces, ...gondarPlaces]) {
  for (const field of ["about", "highlights", "thingsToDo"] as const) assert.ok(place[field]?.length, `${place.slug}: missing ${field}`);
  assert.ok(place.location);
}
const rasDashen = journeyPackages.find((j: { slug: string }) => j.slug === "ras-dashen-challenge");
assert.ok(rasDashen, "missing ras-dashen-challenge");
assert.ok(rasDashen.itineraryNotes, "missing itinerary notes");
assert.ok(rasDashen.itineraryNotes.join(" ").includes("Ambiko"));
const timkat = journeyPackages.find((j: { slug: string }) => j.slug === "timkat-ras-dashen");
assert.ok(timkat, "missing timkat-ras-dashen");
assert.ok(timkat.days, "missing schedule");
assert.equal(timkat.days[0].dayLabel, "1–3");

const forbiddenPatterns = [
  /exact details are confirmed in your written proposal/i,
  /source (?:detail|itinerar|wording|example|notes?|has|estimates?)/i,
  /closest (?:matching|catalogue)/i,
  /package\s+\d+/i,
  /catalogue (?:block|match)/i,
  /align(?:s|ed)? with/i,
  /research/i,
];

function collectStrings(value: unknown, path: string, output: string[]): void {
  if (typeof value === "string") {
    output.push(`${path}: ${value}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, output));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, `${path}.${key}`, output));
  }
}

const strings: string[] = [];
collectStrings(journeyPackages, "journeyPackages", strings);
collectStrings(detailedJourneys, "detailedJourneys", strings);
collectStrings(simienPlaces, "simienPlaces", strings);
collectStrings(gondarPlaces, "gondarPlaces", strings);

const violations = strings.filter((entry) => forbiddenPatterns.some((pattern) => pattern.test(entry)));

if (violations.length > 0) {
  console.error("Public editorial audit failed. Remove internal research language from:");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log(`Public editorial audit passed (${strings.length} strings checked).`);
}
