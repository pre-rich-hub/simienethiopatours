/**
 * Shared public-page metadata. Pages pass title / description / path / locale;
 * this helper fills canonical, hreflang, Open Graph, and Twitter from the site NAP
 * and NEXT_PUBLIC_SITE_URL. Do not invent ratings, prices, or extra claims here.
 *
 * Inner-page `title` is the document title *segment*. Root layout applies
 * `template: "%s | Gonder Simien Tours"`, so do not append the brand yourself.
 * Home uses `titleAbsolute` to keep `Brand | tagline`.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { site, verifiedSocialLinks } from "@/lib/site";
import clientPhotos from "@/lib/client-photos.json";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gondersimientours.com"
).replace(/\/$/, "");

export const nap = {
  name: site.name,
  legalOperator: site.legalOperator,
  telephone: site.phone,
  telephoneDisplay: site.phoneDisplay,
  email: site.email,
  address: site.address,
} as const;

/** Matches the Sankaber Cloudinary hero used on home / treks / Simien hubs. */
export const DEFAULT_OG_IMAGE = {
  url: clientPhotos.sankaber.url,
  width: 1600,
  height: 1200,
  alt: clientPhotos.sankaber.alt.en,
} as const;

export type OgImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

const OG_LOCALE: Record<AppLocale, string> = {
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  fr: "fr_FR",
};

const META_PATHS = {
  home: "/",
  about: "/about",
  plan: "/plan",
  treks: "/treks",
  simien: "/simien-mountains",
  gondar: "/gondar",
} as const;

export type MetaPage = keyof typeof META_PATHS;

export function localeFromParam(value: string | undefined): AppLocale {
  return value && hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

export function localePath(path = "/", locale: AppLocale = routing.defaultLocale): string {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${suffix}`;
}

/** Relative locale URLs; `metadataBase` turns them into absolute hreflang hrefs. */
export function languageAlternates(path: string): NonNullable<Metadata["alternates"]>["languages"] {
  const languages: Record<string, string> = {
    "x-default": localePath(path, routing.defaultLocale),
  };
  for (const locale of routing.locales) {
    languages[locale] = localePath(path, locale);
  }
  return languages;
}

/** Absolute locale URLs for sitemap `alternates.languages`. */
export function absoluteLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(localePath(path, routing.defaultLocale)),
  };
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(localePath(path, locale));
  }
  return languages;
}

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Pathname beginning with `/`, or `/` for home. */
  path: string;
  locale?: AppLocale;
  /** Open Graph / Twitter title when it should differ from `title`. */
  ogTitle?: string;
  image?: OgImage | null;
  /** Privacy / terms should pass false. Default true. */
  index?: boolean;
  /** Skip the `%s | Brand` template (home document title). */
  titleAbsolute?: boolean;
  /** Public pages should keep the default. Root/admin metadata passes false. */
  languages?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  locale = routing.defaultLocale,
  ogTitle,
  image = DEFAULT_OG_IMAGE,
  index = true,
  titleAbsolute = false,
  languages = true,
}: PageMetadataInput): Metadata {
  const canonical = localePath(path, locale);
  const socialTitle = ogTitle ?? title;
  const ogImage = image ? {
    url: image.url,
    alt: image.alt,
    width: image.width ?? 1600,
    height: image.height ?? 1200,
  } : null;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages: languageAlternates(path) } : {}),
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALE[code]),
      siteName: nap.name,
      title: socialTitle,
      description,
      url: canonical,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      images: ogImage ? [ogImage.url] : [],
    },
  };
}

export async function messagePageMetadata(
  localeParam: string,
  page: MetaPage,
  extras?: Partial<PageMetadataInput>,
): Promise<Metadata> {
  const locale = localeFromParam(localeParam);
  const t = await getTranslations({ locale, namespace: "meta" });
  const copy = t.raw(page as never) as { title: string; description: string; ogTitle?: string };
  return pageMetadata({
    locale,
    path: extras?.path ?? META_PATHS[page],
    title: copy.title,
    description: copy.description,
    ogTitle: copy.ogTitle,
    titleAbsolute: page === "home",
    image: hubOgImage(page, locale),
    ...extras,
  });
}

/** Open Graph image aligned with each hub’s visible hero (not a generic Wikimedia fallback). */
function hubOgImage(page: MetaPage, locale: AppLocale): OgImage {
  if (page === "gondar") {
    return {
      url: clientPhotos.fasil.url,
      alt: clientPhotos.fasil.alt[locale],
      width: 1600,
      height: 1200,
    };
  }
  if (page === "about") {
    return {
      url: "/images/tevan-portrait.jpg",
      alt: "Tesema ‘Tevan’ Mulualem, Gondar-based founder and guide",
      width: 1200,
      height: 1600,
    };
  }
  return {
    url: clientPhotos.sankaber.url,
    alt: clientPhotos.sankaber.alt[locale],
    width: 1600,
    height: 1200,
  };
}

/** Root layout defaults. Pages override via `pageMetadata`. */
const home = pageMetadata({
  title: `${nap.name} | Your Local Gateway to the Simien Mountains`,
  description:
    "Private, locally guided Simien Mountains treks and Gondar journeys, personally planned by Tesema ‘Tevan’ Mulualem and a Gondar-based team.",
  path: "/",
  ogTitle: "Your Local Gateway to the Simien Mountains",
  titleAbsolute: true,
  languages: false,
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...home,
  title: {
    default: `${nap.name} | Your Local Gateway to the Simien Mountains`,
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
  const socials = verifiedSocialLinks().map((entry) => entry.href);
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: nap.name,
    legalName: nap.legalOperator,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(site.brand.badge),
      width: site.brand.badgeWidth,
      height: site.brand.badgeHeight,
    },
    telephone: nap.telephone,
    email: nap.email,
    address: postalAddress(),
    areaServed: ["Gondar", "Simien Mountains National Park", "Northern Ethiopia"],
    sameAs: [site.tripadvisor, site.operatorSite, ...socials],
  };
}

/** WebSite entity for the public site. No SearchAction — there is no site search. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: nap.name,
    url: SITE_URL,
    publisher: {
      "@type": "TravelAgency",
      name: nap.name,
      legalName: nap.legalOperator,
      url: SITE_URL,
    },
    inLanguage: [...routing.locales],
  };
}

/** ContactPage for the journey planner (locale /contact redirects here). */
export function contactPageJsonLd(locale: AppLocale = routing.defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Plan a journey | ${nap.name}`,
    url: absoluteUrl(localePath("/plan", locale)),
    mainEntity: {
      "@type": "TravelAgency",
      name: nap.name,
      legalName: nap.legalOperator,
      telephone: nap.telephone,
      email: nap.email,
      address: postalAddress(),
      url: SITE_URL,
    },
  };
}

export type HowToStepInput = {
  name: string;
  text: string;
};

export type HowToJsonLdInput = {
  name: string;
  description: string;
  path: string;
  locale?: AppLocale;
  steps: HowToStepInput[];
};

/** HowTo from visible numbered steps only. No tools, supplies, or invented durations. */
export function howToJsonLd({
  name,
  description,
  path,
  locale = routing.defaultLocale,
  steps,
}: HowToJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url: absoluteUrl(localePath(path, locale)),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type TourJsonLdInput = {
  name: string;
  description: string;
  path: string;
  locale?: AppLocale;
  image?: string;
  duration?: string;
  route?: string;
};

export type DestinationJsonLdInput = {
  name: string;
  description: string;
  path: string;
  locale?: AppLocale;
  image?: string;
  /** Free-text location line from the catalogue (e.g. "Near Debark, Simien Mountains"). */
  location?: string;
  alternateName?: string[];
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
  locale = routing.defaultLocale,
  image,
  duration,
  route,
}: TourJsonLdInput) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    url: absoluteUrl(localePath(path, locale)),
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

/** TouristAttraction from published destination fields only. No coordinates or invented facts. */
export function destinationJsonLd({
  name,
  description,
  path,
  locale = routing.defaultLocale,
  image,
  location,
  alternateName,
}: DestinationJsonLdInput) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    url: absoluteUrl(localePath(path, locale)),
  };

  if (description) data.description = description;
  if (image) data.image = absoluteUrl(image);
  if (alternateName && alternateName.length > 0) data.alternateName = alternateName;
  if (location) {
    data.containedInPlace = {
      "@type": "Place",
      name: location,
    };
  }

  return data;
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string; locale?: AppLocale }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localePath(item.path, item.locale ?? routing.defaultLocale)),
    })),
  };
}

/** FAQPage for questions that are also visible on the page. No invented ratings or prices. */
export function faqPageJsonLd(questions: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
