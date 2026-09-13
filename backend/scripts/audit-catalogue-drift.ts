import assert from "node:assert/strict";
import { approvedTourContents } from "@/lib/tour-content";
import { simienPlaces } from "@/lib/simien-destinations";
import { gondarPlaces } from "@/lib/gondar-destinations";

const unique = (values: string[], label: string) => {
  assert.equal(new Set(values).size, values.length, label + " contains duplicate slugs");
};
const tourSlugs = (approvedTourContents as Array<{ slug: string }>).map((tour) => tour.slug);
const destinationSlugs = ([...simienPlaces, ...gondarPlaces] as Array<{ slug: string }>).map((place) => place.slug);
unique(tourSlugs, "approved tours");
const uniqueDestinationSlugs = new Set(destinationSlugs);
assert.equal(uniqueDestinationSlugs.size, 32, "approved destination URL set drifted");
assert.equal(approvedTourContents.length, 28, "approved tour count drifted");
assert.equal(simienPlaces.length, 18, "Simien destination count drifted");
assert.equal(gondarPlaces.length, 15, "Gondar destination count drifted");
for (const tour of approvedTourContents as Array<any>) {
  assert.ok(tour.tourName && tour.summary && tour.overview, tour.slug + ": missing canonical copy");
  assert.ok(tour.itinerary.length > 0, tour.slug + ": missing itinerary");
}
for (const place of [...simienPlaces, ...gondarPlaces] as Array<any>) {
  assert.ok(place.name && place.location && place.about.length && place.highlights.length && place.thingsToDo.length, place.slug + ": incomplete destination");
}
console.log("Catalogue drift check passed: " + approvedTourContents.length + " tours, " + (simienPlaces.length + gondarPlaces.length) + " destination records.");
