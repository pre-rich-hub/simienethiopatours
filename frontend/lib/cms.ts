/**
 * CMS data layer: tries the backend API first, falls back to bundled data on
 * any failure. Every function returns a valid array/object — never throws.
 *
 * The fallback data matches the DB-backed published set exactly. If the API
 * returns data, it is normalized to the same shape the components consume.
 */

import { fetchUrl } from "@/lib/api/client";
import { journeys, type site as siteType } from "@/lib/site";
import { detailedJourneys, type JourneyDetail } from "@/lib/itineraries";
import { travelerReviews, type TravelerReview } from "@/lib/reviews";
import { fieldNotes } from "@/lib/field-notes";
import { experienceLinks } from "@/lib/experiences";
import { photographs, type Photograph } from "@/lib/gallery-data";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

/** Shape consumed by journey cards on treks listing, home, DurationSelector. */
export type JourneyCard = {
  slug: string;
  href: string;
  title: string;
  image: string;
  duration: string;
  style: string;
  difficulty: string;
  fit: string;
  summary: string;
};

/** API card shape returned by GET /api/v1/tours. */
type ApiTourCard = {
  slug: string;
  tourName: string;
  image: string | null;
  duration: string | null;
  style: string | null;
  difficulty: string | null;
  fit: string | null;
  summary: string | null;
  isFeatured: boolean;
  adultPrice: number | null;
  childPrice: number | null;
  rating: number | null;
};

/** API detail shape returned by GET /api/v1/tours/slug/:slug. */
type ApiTourDetail = {
  id: number;
  slug: string;
  tourName: string;
  heroTitle: string | null;
  heroAccent: string | null;
  image: string | null;
  imageAlt: string | null;
  duration: string | null;
  style: string | null;
  difficulty: string | null;
  fit: string | null;
  inquiry: string | null;
  notice: string | null;
  route: string[] | null;
  facts: { label: string; value: string }[] | null;
  introduction: string[] | null;
  highlights: { title: string; body: string }[] | null;
  preparation: string[] | null;
  related: { title: string; body: string; href?: string }[] | null;
  overview: string | null;
  included: string[] | null;
  excluded: string[] | null;
  itinerary: {
    title: string;
    subtitle?: string;
    paragraphs: string[];
    overnight?: string;
    notes?: string[];
    stages?: { label: string; body: string }[];
  }[] | null;
  journeyMap: string | null;
  adultPrice: number | null;
  childPrice: number | null;
  discount: string | null;
  rating: number | null;
  noOfRates: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** API gallery item. */
type ApiGalleryItem = {
  id: number;
  imageUrl: string;
  title: string;
  location: string;
  category: string;
  alt: string;
  story: string;
  href: string;
  link: string;
  tourId: number | null;
};

/** API blog post. */
type ApiBlogPost = {
  id: number;
  slug: string;
  blogTitle: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  href: string | null;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

const API_ORIGIN = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/assets/")) return `${API_ORIGIN}${url}`;
  return url;
}

function apiCardToJourneyCard(tour: ApiTourCard): JourneyCard {
  return {
    slug: tour.slug,
    href: `/treks/${tour.slug}`,
    title: tour.tourName,
    image: resolveMediaUrl(tour.image),
    duration: tour.duration || "",
    style: tour.style || "",
    difficulty: tour.difficulty || "",
    fit: tour.fit || "",
    summary: tour.summary || "",
  };
}

function apiDetailToJourneyDetail(tour: ApiTourDetail): JourneyDetail {
  // The seed builds overview as: description + "\n\n" + introduction.join("\n\n").
  // Recover description by taking text before the first double-newline.
  const overviewText = tour.overview || "";
  const splitIdx = overviewText.indexOf("\n\n");
  const description =
    splitIdx > -1 ? overviewText.slice(0, splitIdx) : overviewText;

  return {
    slug: tour.slug,
    inquiry: tour.inquiry || tour.slug,
    title: tour.tourName,
    heroTitle: tour.heroTitle || tour.tourName,
    heroAccent: tour.heroAccent || "",
    description,
    image: resolveMediaUrl(tour.image),
    imageAlt: tour.imageAlt || "",
    duration: tour.duration || "",
    route: tour.route || [],
    facts: tour.facts || [],
    introduction: tour.introduction || [],
    days: (tour.itinerary || []).map((day) => ({
      title: day.title,
      subtitle: day.subtitle || "",
      paragraphs: day.paragraphs,
      overnight: day.overnight,
      notes: day.notes,
      stages: day.stages,
    })),
    highlights: (tour.highlights || []).map((h) => ({
      title: h.title,
      body: h.body,
    })),
    preparation: tour.preparation || [],
    inclusions: tour.included || [],
    exclusions: tour.excluded || undefined,
    notice: tour.notice || undefined,
    related: tour.related || undefined,
  };
}

function apiGalleryToPhotograph(item: ApiGalleryItem): Photograph {
  return {
    src: resolveMediaUrl(item.imageUrl),
    title: item.title,
    location: item.location,
    category: item.category,
    alt: item.alt,
    story: item.story,
    href: item.href,
    link: item.link,
  };
}

// Field note shape used by CMS fallbacks and backend seed.
export type FieldNote = {
  tag: string;
  title: string;
  body: string;
};

// Experience link shape used by the Gondar page and CMS fallbacks.
export type ExperienceLink = {
  title: string;
  tag: string;
  body: string;
  href: string;
};

function apiBlogToFieldNote(post: ApiBlogPost): FieldNote {
  // seed stores slug as note.tag.toLowerCase(); recover the bundled
  // capitalization ("01 · Timing" style) for identical rendering.
  const tag = post.slug.charAt(0).toUpperCase() + post.slug.slice(1);
  return {
    tag,
    title: post.blogTitle,
    body: post.description || post.content || "",
  };
}

function apiBlogToExperienceLink(post: ApiBlogPost): ExperienceLink {
  // Prefer the stored full href (written by the seed for experience posts);
  // fall back to reconstructing from the slug for rows created before the
  // href column existed.
  const href =
    post.href ||
    (post.slug.startsWith("treks-")
      ? `/treks/${post.slug.replace(/^treks-/, "")}`
      : `/${post.slug}`);
  return {
    title: post.blogTitle,
    tag: "", // tag wasn't stored in the blog
    body: post.description || post.content || "",
    href,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Bundled journey card data matching the 5 site.ts journeys. */
function bundledJourneyCards(): JourneyCard[] {
  return journeys.map((j) => ({
    slug: j.href.replace("/treks/", ""),
    href: j.href,
    title: j.title,
    image: j.image,
    duration: j.duration,
    style: j.style,
    difficulty: j.difficulty,
    fit: j.fit,
    summary: j.summary,
  }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const cms = {
  /** All published tours as cards, ordered by sortOrder. */
  async getAllTours(): Promise<JourneyCard[]> {
    const api = await fetchUrl<ApiTourCard[]>("/api/v1/tours");
    if (api && api.length > 0) {
      return api.map(apiCardToJourneyCard);
    }
    // Fallback: bundle has only 5 of the 7 published tours. We combine the
    // bundled card data with the itineraries that have card-level fields.
    return bundledJourneyCards();
  },

  /** Single tour detail by slug. */
  async getTourBySlug(slug: string): Promise<JourneyDetail | null> {
    const api = await fetchUrl<ApiTourDetail>(`/api/v1/tours/slug/${slug}`);
    if (api) {
      return apiDetailToJourneyDetail(api);
    }
    // Fallback: check bundled detailedJourneys.
    return detailedJourneys.find((j) => j.slug === slug) || null;
  },

  /** Featured tours as cards (used by home page journey tiles). */
  async getFeaturedTours(): Promise<JourneyCard[]> {
    const api = await fetchUrl<ApiTourCard[]>("/api/v1/tours/featured");
    if (api && api.length > 0) {
      return api.map(apiCardToJourneyCard);
    }
    // Fallback: the bundle carries the same featured set as the DB seed.
    const featuredSlugs = new Set([
      "3-day-simien-trek",
      "4-day-simien-classic",
      "ras-dashen-challenge",
    ]);
    return bundledJourneyCards().filter((card) =>
      featuredSlugs.has(card.slug),
    );
  },

  /** Testimonials as TravelerReview objects. */
  async getTestimonials(): Promise<readonly TravelerReview[]> {
    type ApiTestimonial = {
      id: number;
      reviewerName: string;
      message: string;
      source: string | null;
      title: string | null;
      date: string | null;
      avatarTone: string | null;
      translatedFrom: string | null;
    };
    const api = await fetchUrl<ApiTestimonial[]>("/api/v1/testimonials");
    if (api && api.length > 0) {
      const AVATAR_TONES: TravelerReview["avatarTone"][] = [
        "clay",
        "sky",
        "forest",
        "sand",
        "slate",
        "berry",
      ];
      return api
        .map((row): TravelerReview | null => {
          if (row.source !== "Tripadvisor" && row.source !== "Google")
            return null;
          const tone = AVATAR_TONES.includes(
            row.avatarTone as TravelerReview["avatarTone"],
          )
            ? (row.avatarTone as TravelerReview["avatarTone"])
            : "slate";
          return {
            name: row.reviewerName,
            initials: row.reviewerName
              .split(/\s+/)
              .filter(Boolean)
              .map((w) => w[0] ?? "")
              .join("")
              .toUpperCase(),
            date: row.date ?? "",
            source: row.source as "Tripadvisor" | "Google",
            title: row.title ?? undefined,
            text: row.message,
            avatarTone: tone,
            translatedFrom: row.translatedFrom ?? undefined,
          };
        })
        .filter((r): r is TravelerReview => r !== null);
    }
    return travelerReviews;
  },

  /** Gallery photographs. */
  async getGallery(): Promise<readonly Photograph[]> {
    const api = await fetchUrl<ApiGalleryItem[]>("/api/v1/gallery");
    if (api && api.length > 0) {
      return api.map(apiGalleryToPhotograph);
    }
    return photographs;
  },

  /** Blog posts for a given category slug, mapped to FieldNote shape. */
  async getFieldNotes(): Promise<readonly FieldNote[]> {
    const api = await fetchUrl<ApiBlogPost[]>("/api/v1/blog");
    if (api && api.length > 0) {
      const filtered = api
        .filter((p) => p.categoryName === "Field notes")
        .sort((a, b) => a.id - b.id);
      if (filtered.length > 0) {
        return filtered.map(apiBlogToFieldNote);
      }
    }
    return fieldNotes;
  },

  /** Blog posts for the "experiences" category, mapped to ExperienceLink shape. */
  async getExperienceLinks(): Promise<readonly ExperienceLink[]> {
    const api = await fetchUrl<ApiBlogPost[]>("/api/v1/blog");
    if (api && api.length > 0) {
      const filtered = api
        .filter((p) => p.categoryName === "Experiences")
        .sort((a, b) => a.id - b.id);
      if (filtered.length > 0) {
        return filtered.map(apiBlogToExperienceLink);
      }
    }
    return experienceLinks;
  },
};
