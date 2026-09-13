# Accessibility checklist (P10-T5)

Automated and manual a11y evidence for **Gondar Simien Tours**. Live axe CI is not wired; this documents what `p4-browser` already asserts plus the manual pass for remaining WCAG items.

## Automated (local)

```bash
npm run qa:p4 -- --screenshots
```

Script: [`scripts/p4-browser.mjs`](../scripts/p4-browser.mjs)

| Check | Evidence |
| --- | --- |
| Mobile menu open / close | Asserts `#mobile-menu` `open` true then false |
| Focus restoration after mobile dialog close | Asserts `document.activeElement` retains `aria-controls="mobile-menu"` |
| Desktop mega menu open | Asserts `#journeys-menu-menu` `aria-hidden="false"` |
| Representative pages render without overflow | Home, trek, destination, journal at 390px and 1440px |
| No uncaught browser exceptions | `Runtime.exceptionThrown` list must be empty |

Screenshots (when `--screenshots`): `docs/p4-screenshots/desktop-cms-menu.png`. Results: `docs/p4-smoke-results.json`.

## Manual / lab (record in qa.md)

| Check | How |
| --- | --- |
| Axe on home, trek, plan, gallery | Chrome Lighthouse Accessibility or axe DevTools; compare to [`docs/p0-t3-baseline.md`](../docs/p0-t3-baseline.md) |
| Keyboard-only navigation | Tab through header → main → plan form; Enter/Space on trek day `<details>` |
| Focus restoration for chat | Open assistant sheet, Escape → focus returns to FAB (when assistant enabled) |
| Form labels / errors / status | `/en/plan` required fields stay labelled; submit status announced |
| Color contrast / reduced motion | Spot-check copper text; `prefers-reduced-motion` does not break layout |
| Heading order / landmarks / dialog | Single `h1` per page (asserted indirectly via p4 heading check); mobile menu uses dialog semantics |

## Status

- **Menus / focus restore:** covered by `p4-browser.mjs` (automated).
- **Broader axe / contrast / chat focus:** baseline + this checklist; continuous improvement against Lighthouse a11y notes in `p0-t3-baseline.md`.
