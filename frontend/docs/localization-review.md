# Phase 5 localization review

The application keeps one message tree per supported locale (`en`, `es`, `de`, `fr`). Run `npm run content:locale-audit` from `frontend` before publishing a change; it fails when a locale is missing or adds message keys.

## UI chrome (implemented)

- Planner experience option labels use stable IDs with `inquiry.experiences.*` message keys; operator email composition maps IDs to English labels.
- Trek preparation/destination section intros use `trek.preparation*` / `trek.destinations*` keys.
- Gondar experience selector chrome and copy use `gondarExperiences.*` keys.
- Gallery and journal UI were localized earlier; legal/contact copy remains in the human review queue.

## Catalogue body copy (still open)

Catalogue records follow the same policy as the public site: English is the source locale, translated records are published only after schema validation, and a detail page redirects to English when its requested translation is unavailable. Use the admin **Translations** screen to edit and review tour, destination, and journal payloads.

Fluent reviewers must still approve ES/DE/FR travel terminology for every published destination and journey (including itinerary, inclusions/exclusions, metadata, and alt text). Automated audits report coverage only — they do not certify human quality.

## Review checklist before indexing a locale

1. `npm run content:locale-audit`
2. Backend `npm run content:localization` against the staging database
3. Desktop + 390px pass for navigation, planner, gallery, journal, and one tour/destination detail per locale
4. Confirm hreflang/canonical only advertise published translation variants
5. Sign off in [`qa.md`](qa.md) with reviewer name and date
