/**
 * Editorial enrichment for thin destination copy.
 * Only fills gaps — never replaces longer catalogue text. English-first extras
 * apply when locale is en; other locales keep catalogue strings as-is.
 */

type PlaceLike = {
  slug: string;
  name: string;
  about: string[];
  highlights: string[];
  thingsToDo: string[];
  heroTitle: string;
  heroAccent: string;
  location: string;
  image: string;
  imageAlt: string;
  alsoKnownAs: string[];
  path: string;
};

/** Extra about paragraph when the catalogue overview is a single short block. */
const ABOUT_EXTRA_EN: Record<string, string> = {
  "debre-berhan-selassie":
    "Most visits pair the church with other Gondar heritage stops on the same day. Photography rules and quiet behaviour inside the compound should be confirmed with your guide before entry.",
  debark:
    "On day trips and multi-day programmes Debark is usually a working stop rather than a sightseeing destination. Tevan’s team uses the town for park process, brief supplies and the handoff between city transport and mountain logistics.",
  "fasilides-bath":
    "Outside major festivals the compound is a quieter heritage stop on city days. During Timkat it becomes a central ceremonial setting — festival programmes confirm access and timing closer to the date.",
  kuskuam:
    "Kuskuam suits travellers who want royal-era ruins beyond the main Fasil Ghebbi circuit. Paths and viewpoints are explored with a local guide; expect uneven ground and open highland light.",
  "fasil-ghebbi":
    "A guided visit usually links the enclosure with nearby churches or Fasilides’ Bath when time allows. Tell Tevan whether you prefer a focused half-day or a fuller royal-city circuit.",
  inatye:
    "Treat Inatye as part of a longer mountain day rather than a place to overnight. Pace, weather and group fitness decide how much time you spend on the ridge before continuing toward Chenek.",
  ambaras:
    "Ambaras matters most as an exit or pickup point. On the 3-day trek it is where foot travel rejoins the road after Imet Gogo; exact timing follows the group’s pace and current park access.",
};

/** Longer highlight lines when catalogue highlights are slogan-length. */
const HIGHLIGHTS_EN: Record<string, string[]> = {
  "debre-berhan-selassie": [
    "Active historic church on Gondar’s sacred circuit, visited with local interpretation.",
    "Best known for its painted ceiling of winged angel faces — a highlight of Gondarine church art.",
    "Living worship continues alongside heritage tourism; quiet, respectful visits are the rule.",
    "Strong subject for photography where permission allows; your guide confirms what is appropriate.",
  ],
  debark: [
    "Practical gateway between Gondar city days and Simien Mountains National Park.",
    "Park entrance formalities and scout arrangements are completed here before highland entry.",
    "Highland town stop on the road north — logistics first, sightseeing second.",
    "Useful supply and coordination point on day trips and multi-day trekking programmes.",
  ],
  "fasil-ghebbi": [
    "Royal enclosure of castles and compounds at the heart of Gondar’s imperial story.",
    "UNESCO World Heritage architecture from the Gondarine period, explored with a local guide.",
    "Courtyards, towers and stone walls define the city’s royal identity in a single visit.",
    "Natural centrepiece for half-day or full-day Gondar heritage programmes.",
  ],
};

export function enrichDestinationPlace<T extends PlaceLike>(place: T, locale: string): T {
  if (locale !== "en") return place;

  const about = [...place.about];
  const extra = ABOUT_EXTRA_EN[place.slug];
  if (extra && about.length === 1 && (about[0]?.length ?? 0) < 420) {
    about.push(extra);
  }

  const curated = HIGHLIGHTS_EN[place.slug];
  const highlights =
    curated && place.highlights.every((item) => item.length < 70) ? curated : place.highlights;

  return { ...place, about, highlights };
}
