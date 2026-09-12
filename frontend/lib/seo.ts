/**
 * Shared public-page metadata. Pages pass title / description / path;
 * this helper fills canonical, Open Graph, and Twitter from the site NAP
 * and NEXT_PUBLIC_SITE_URL. Do not invent ratings, prices, or extra claims here.
 *
 * Inner-page `title` is the document title *segment*. Root layout applies
 * `template: "%s | Gondar Simien Tours"`, so do not append the brand yourself.
 */

import type { Metadata } from "next";
import { site } from "@/lib/site";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://gondarsimientours.com"
).replace(/\/$/, "");

export const nap = {
  name: site.name,
  legalOperator: site.legalOperator,
  telephone: site.phone,
  telephoneDisplay: site.phoneDisplay,
  email: site.email,
  address: site.address,
} as const;

export const DEFAULT_OG_IMAGE = {
  url: "/images/imet-gogo.jpg",
  width: 1600,
  height: 1200,
  alt: "The high plateau and dramatic escarpment at Imet Gogo in the Simien Mountains",
} as const;

export type OgImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Pathname beginning with `/`, or `/` for home. */
  path: string;
  /** Open Graph / Twitter title when it should differ from `title`. */
  ogTitle?: string;
  image?: OgImage;
  /** Privacy / terms should pass false. Default true. */
  index?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  image = DEFAULT_OG_IMAGE,
  index = true,
}: PageMetadataInput): Metadata {
  const canonical = path || "/";
  const socialTitle = ogTitle ?? title;
  const ogImage = {
    url: image.url,
    alt: image.alt,
    width: image.width ?? 1600,
    height: image.height ?? 1200,
  };

  return {
    title,
    description,
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: nap.name,
      title: socialTitle,
      description,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** Root layout defaults. Pages override via `pageMetadata`. */
const home = pageMetadata({
  title: `${nap.name} | Your Local Gateway to the Simien Mountains`,
  description:
    "Private, locally guided Simien Mountains treks and Gondar journeys, personally planned by Tesema ‘Tevan’ Mulualem and a Gondar-based team.",
  path: "/",
  ogTitle: "Your Local Gateway to the Simien Mountains",
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...home,
  title: {
    default: home.title as string,
    template: `%s | ${nap.name}`,
  },
};

function postalAddress() {
  const [streetAddress, addressLocality, country] = nap.address
    .split(",")
    .map((part) => part.trim());
  return {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressCountry: country === "Ethiopia" ? "ET" : country,
  };
}

/** Organization / LocalBusiness / TravelAgency from verified NAP only. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: nap.name,
    legalName: nap.legalOperator,
    url: SITE_URL,
    telephone: nap.telephone,
    email: nap.email,
    address: postalAddress(),
    areaServed: ["Gondar", "Simien Mountains National Park", "Northern Ethiopia"],
    sameAs: [site.tripadvisor, site.operatorSite],
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type TourJsonLdInput = {
  name: string;
  description: string;
  path: string;
  image?: string;
  duration?: string;
  route?: string;
};

/** ISO-8601 day duration only when the source starts with a single day count. */
function isoDayDuration(raw: string): string | undefined {
  const match = raw.trim().match(/^(\d+)\s+Days?(?:\b|\/)/i);
  return match ? `P${match[1]}D` : undefined;
}

/** TouristTrip from real itinerary fields only. No prices or invented facts. */
export function tourJsonLd({
  name,
  description,
  path,
  image,
  duration,
  route,
}: TourJsonLdInput) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    url: absoluteUrl(path),
    provider: {
      "@type": "TravelAgency",
      name: nap.name,
      legalName: nap.legalOperator,
      url: SITE_URL,
    },
  };

  if (description) data.description = description;
  if (image) data.image = absoluteUrl(image);

  if (duration) {
    const iso = isoDayDuration(duration);
    if (iso) data.duration = iso;
  }

  const stops = route?.includes("→")
    ? route
        .split(/\s*→\s*/)
        .map((stop) => stop.trim())
        .filter(Boolean)
    : [];
  if (stops.length > 0) {
    data.itinerary = {
      "@type": "ItemList",
      itemListElement: stops.map((stop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "Place", name: stop },
      })),
    };
  }

  return data;
}
