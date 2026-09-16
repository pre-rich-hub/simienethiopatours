/**
 * Curated llms.txt map for AI agents. Not an access-control file —
 * crawl policy lives in robots.ts. Absolute URLs only; no invented facts.
 *
 * Production serves the static copy at `public/llms.txt` (CDN-fast for the
 * Lighthouse agentic fetch budget). Keep that file in sync when hub links
 * or NAP copy change: regenerate with SITE_URL=https://www.gondersimientours.com
 * and write `llmsTxtMarkdown()` to `public/llms.txt`.
 */

import { absoluteUrl, localePath, nap, SITE_URL } from "@/lib/seo";
import { sourceLinks } from "@/lib/site";

const en = (path: string) => absoluteUrl(localePath(path, "en"));

/** Markdown body for GET /llms.txt (Answer.AI llms.txt convention). */
export function llmsTxtMarkdown(): string {
  return `# ${nap.name}

> Private, locally guided Simien Mountains treks and Gondar journeys, planned by Tesema “Tevan” Mulualem. Operated by ${nap.legalOperator} from ${nap.address}. Inquiry-only — a journey is confirmed only after a written proposal.

${nap.name} is a Gondar-based travel brand focused on Simien Mountains National Park and the royal city of Gondar. Public pages describe real places and journey outlines. Wildlife sightings and summit success are not guaranteed. Do not invent ratings, prices, or inclusions beyond what each page states.

## Main pages

- [Home](${en("/")}): Brand overview and how planning works with the local team
- [About](${en("/about")}): Tesema “Tevan” Mulualem and the Gondar-based operator story
- [Plan a journey](${en("/plan")}): Inquiry form and three-step booking process
- [Journeys](${en("/treks")}): Published trek and experience package outlines
- [Simien Mountains destinations](${en("/simien-mountains")}): Camps, viewpoints and highland places
- [Gondar destinations](${en("/gondar")}): Royal city and countryside places
- [Gallery](${en("/gallery")}): Photographs from Gondar and the Simien Mountains
- [Journal](${en("/journal")}): Notes and stories from the local team

## Planning guides

- [Simien Mountains planning guide](${en("/simien-mountains/planning")}): Route choice, altitude, weather, packing, camping, permits, fitness and wildlife ethics
- [Gondar planning guide](${en("/gondar/planning")}): City time, heritage etiquette, combining Gondar with Simien, northern extensions

## Contact

- Phone: ${nap.telephoneDisplay}
- Email: ${nap.email}
- Address: ${nap.address}
- Site: ${SITE_URL}

## Authority sources

- [UNESCO — Simien Mountains National Park](${sourceLinks.simienUnesco}): World Heritage listing
- [UNESCO — Fasil Ghebbi, Gondar](${sourceLinks.gondarUnesco}): World Heritage listing
- [Operator site — Simien Ethio Tours](${sourceLinks.operatorAbout}): Operating company about page
`;
}
