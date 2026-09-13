/** Short listing-card teaser from longer catalogue copy. */
export function cardBlurb(text: string, max = 120): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const sentence = clean.match(/^(.+?[.!?])(?:\s|$)/)?.[1] ?? clean;
  if (sentence.length <= max) return sentence;

  const clipped = clean.slice(0, max - 1);
  const breakAt = Math.max(clipped.lastIndexOf(" "), clipped.lastIndexOf(","));
  return `${(breakAt > 40 ? clipped.slice(0, breakAt) : clipped).trimEnd()}…`;
}
