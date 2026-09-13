/** Shared non-catalogue CMS resources. Tours, destinations and journal use catalogue.ts. */
import { fetchUrl } from "@/lib/api/client";
import { travelerReviews, type TravelerReview } from "@/lib/reviews";
import { photographs, type Photograph } from "@/lib/gallery-data";
import { resolveMediaUrl } from "@/lib/catalogue";
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

export const cms = {
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
    if (api !== null) {
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
    if (api !== null) {
      return api.map(apiGalleryToPhotograph);
    }
    return photographs;
  },

};
