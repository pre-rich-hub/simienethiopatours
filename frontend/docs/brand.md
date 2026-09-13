# Brand mark

Delivered lockups live in [`public/images/`](../public/images/). Chrome reads the circular seal from [`lib/site.ts`](../lib/site.ts) (`site.brand.badge`).

**Current brand asset (2026-09-13):** the production mark is the PNG circular badge — there is no vector/SVG export yet. When a vector file arrives, point `site.brand.badge` at that SVG; no other chrome change is required.

## Primary mark

Use **`gondar-simien-tours-logo-badge.png`** (circular seal; current production brand asset) for header, footer, menu, favicon, and Organization JSON-LD.

| Surface | Treatment |
| --- | --- |
| Light header, scrolled header, mobile menu | Highland green (`--highland`) |
| Transparent home header, footer | Gold (`#e3bd91`) |
| Favicon (`app/icon.png`) | Seal on transparent |
| Apple icon (`app/apple-icon.png`) | Seal on cream |
| Open Graph | Landscape photo (`imet-gogo.jpg`), not the mark |

The seal is a monochrome mask. Do not place the full-color PNG on dark photography, and do not invent extra brand colors.

## Sizes and clear space

- Header: 64px (52px when compact or on small screens)
- Footer: 128px
- Keep clear space around the circle at least a quarter of the mark width. Do not overlap type, icons, or photos onto the seal.

## Other files

- `gondar-simien-tours-logo.png` — open lockup (castle, peaks, wordmark, no circle). Keep for print or a future wide lockup; unused in chrome.
- `gondar-simien-tours-logo-green.png` — identical to the open lockup.

The wordmark in the supplied art is used as delivered. Do not redraw or respell it in CSS.
