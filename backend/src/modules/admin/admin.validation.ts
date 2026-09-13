import { z } from "zod";
import { jsonText, tourArrays, journeyTypes } from "../catalog/tour-content.js";
import { destinationAreas, destinationTypes } from "../catalog/destination-content.js";

// ---------------------------------------------------------------------------
// Tour create / update
// ---------------------------------------------------------------------------

/** Minimal string coercion: accepts numbers, booleans, etc. via String(). */
const looseString = z.string().trim().optional();

export const tourCreateSchema = z.object({
  body: z.object({
    tourTitle: z.string().trim().min(1, "Tour name is required").max(255),
    tourCategories: z.any().optional(),
    tourDestinations: z.any().optional(),
    tourDestination: z.any().optional(),
    adultPrice: z.any().optional(),
    childPrice: z.any().optional(),
    tourDiscount: z.any().optional(),
    tourRating: z.any().optional(),
    tourReviews: z.any().optional(),
    isFeatured: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
    tourOverview: looseString,
    summary: looseString,
    itineraryIntro: looseString,
    itineraryNotes: jsonText(tourArrays.itineraryNotes),
    tourIncluded: jsonText(tourArrays.included),
    tourExcluded: jsonText(tourArrays.excluded),
    tourItinerary: jsonText(tourArrays.itinerary),
    tourMap: looseString,
    // Editorial fields (P1 content pipeline)
    heroTitle: looseString,
    heroAccent: looseString,
    image: z.any().optional(), // file or URL string
    imageAlt: looseString,
    duration: looseString,
    style: looseString,
    difficulty: looseString,
    journeyType: z.enum(journeyTypes).optional(),
    editorialStatus: z.enum(["draft", "reviewed", "published"]).optional(),
    editorialSourceNotes: z.string().optional(),
    reviewSourceNotes: z.string().optional(),
    routeApproved: z.coerce.boolean().optional(), commercialApproved: z.coerce.boolean().optional(),
    safetyApproved: z.coerce.boolean().optional(), translationApproved: z.coerce.boolean().optional(),
    fit: looseString,
    inquiry: looseString,
    notice: looseString,
    route: jsonText(tourArrays.route),
    facts: jsonText(tourArrays.facts),
    introduction: jsonText(tourArrays.introduction),
    highlights: jsonText(tourArrays.highlights),
    preparation: jsonText(tourArrays.preparation),
    related: jsonText(tourArrays.related),
    isPublished: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
  }),
});

export const tourUpdateSchema = z.object({
  body: z.object({
    tourTitle: z.string().trim().min(1, "Tour name is required").max(255).optional(),
    tourCategories: z.any().optional(),
    tourDestinations: z.any().optional(),
    tourDestination: z.any().optional(),
    adultPrice: z.any().optional(),
    childPrice: z.any().optional(),
    tourDiscount: z.any().optional(),
    tourRating: z.any().optional(),
    tourReviews: z.any().optional(),
    isFeatured: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
    tourOverview: looseString,
    summary: looseString,
    itineraryIntro: looseString,
    itineraryNotes: jsonText(tourArrays.itineraryNotes),
    tourIncluded: jsonText(tourArrays.included),
    tourExcluded: jsonText(tourArrays.excluded),
    tourItinerary: jsonText(tourArrays.itinerary),
    tourMap: looseString,
    heroTitle: looseString,
    heroAccent: looseString,
    image: z.any().optional(),
    imageAlt: looseString,
    duration: looseString,
    style: looseString,
    difficulty: looseString,
    journeyType: z.enum(journeyTypes).optional(),
    editorialStatus: z.enum(["draft", "reviewed", "published"]).optional(),
    editorialSourceNotes: z.string().optional(),
    reviewSourceNotes: z.string().optional(),
    routeApproved: z.coerce.boolean().optional(), commercialApproved: z.coerce.boolean().optional(),
    safetyApproved: z.coerce.boolean().optional(), translationApproved: z.coerce.boolean().optional(),
    fit: looseString,
    inquiry: looseString,
    notice: looseString,
    route: jsonText(tourArrays.route),
    facts: jsonText(tourArrays.facts),
    introduction: jsonText(tourArrays.introduction),
    highlights: jsonText(tourArrays.highlights),
    preparation: jsonText(tourArrays.preparation),
    related: jsonText(tourArrays.related),
    isPublished: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
    deleteImages: z.any().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Blocked dates
// ---------------------------------------------------------------------------

export const blockedDateSchema = z.object({
  body: z.object({
    dates: z
      .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .min(1, "At least one date is required"),
    reason: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Destination
// ---------------------------------------------------------------------------

export const destinationCreateSchema = z.object({
  body: z.object({
    destinationName: z.string().trim().min(1, "Destination name is required"),
    destinationDescription: z.string().optional(),
    area: z.enum(destinationAreas).optional(),
    type: z.enum(destinationTypes).optional(),
    location: z.string().optional(),
    alsoKnownAs: z.any().optional(),
    heroTitle: z.string().optional(),
    heroAccent: z.string().optional(),
    overview: z.any().optional(),
    highlights: z.any().optional(),
    thingsToDo: z.any().optional(),
    image: z.any().optional(),
    imageAlt: z.string().optional(),
    sourceReferences: z.any().optional(),
    editorialStatus: z.enum(["draft", "reviewed", "published"]).optional(), editorialSourceNotes: z.string().optional(),
    reviewSourceNotes: z.string().optional(), routeApproved: z.coerce.boolean().optional(), commercialApproved: z.coerce.boolean().optional(), safetyApproved: z.coerce.boolean().optional(), translationApproved: z.coerce.boolean().optional(),
    tourIds: z.any().optional(),
    isPublished: z.any().optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
  }),
});

export const destinationUpdateSchema = z.object({
  body: z.object({
    destinationName: z.string().trim().min(1, "Destination name is required").optional(),
    destinationDescription: z.string().optional(),
    area: z.enum(destinationAreas).optional(),
    type: z.enum(destinationTypes).optional(),
    location: z.string().optional(),
    alsoKnownAs: z.any().optional(),
    heroTitle: z.string().optional(),
    heroAccent: z.string().optional(),
    overview: z.any().optional(),
    highlights: z.any().optional(),
    thingsToDo: z.any().optional(),
    image: z.any().optional(),
    imageAlt: z.string().optional(),
    sourceReferences: z.any().optional(),
    editorialStatus: z.enum(["draft", "reviewed", "published"]).optional(), editorialSourceNotes: z.string().optional(),
    reviewSourceNotes: z.string().optional(), routeApproved: z.coerce.boolean().optional(), commercialApproved: z.coerce.boolean().optional(), safetyApproved: z.coerce.boolean().optional(), translationApproved: z.coerce.boolean().optional(),
    tourIds: z.any().optional(),
    isPublished: z.any().optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Tour category
// ---------------------------------------------------------------------------

export const categorySchema = z.object({
  body: z.object({
    categoryName: z.string().trim().min(1, "Category name is required"),
  }),
});

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const blogCreateSchema = z.object({
  body: z.object({
    blogTitle: z.string().trim().min(1, "Title is required"),
    blogDescription: z.string().optional(),
    content: z.string().optional(),
    href: z.string().trim().max(500).optional(),
    categoryId: z.any().optional(),
    isPublished: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
    author: z.string().trim().max(255).optional(),
    imageAlt: z.string().trim().max(500).optional(),
  }),
});

export const blogUpdateSchema = z.object({
  body: z.object({
    blogTitle: z.string().trim().min(1, "Title is required").optional(),
    blogDescription: z.string().optional(),
    content: z.string().optional(),
    href: z.string().trim().max(500).optional(),
    categoryId: z.any().optional(),
    isPublished: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
    author: z.string().trim().max(255).optional(),
    imageAlt: z.string().trim().max(500).optional(),
  }),
});

// ---------------------------------------------------------------------------
// Blog category
// ---------------------------------------------------------------------------

export const blogCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
  }),
});

export const translationUpdateSchema = z.object({
  params: z.object({
    entityType: z.enum(["tour", "destination", "blog"]),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    locale: z.enum(["es", "de", "fr"]),
  }),
  body: z.object({
    content: z.record(z.string(), z.unknown()),
    status: z.enum(["missing", "draft", "reviewed", "published"]),
  }),
});

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export const galleryCreateSchema = z.object({
  body: z.object({
    title: z.string().trim().max(255).optional(),
    location: z.string().trim().max(255).optional(),
    category: z.string().trim().max(255).optional(),
    alt: z.string().trim().max(500).optional(),
    story: z.string().optional(),
    href: z.string().trim().max(500).optional(),
    link: z.string().trim().max(255).optional(),
    tourId: z.coerce.number().int().positive().nullish(),
    imageUrl: z.string().optional(),
  }),
});

export const galleryUpdateSchema = z.object({
  body: z.object({
    title: z.string().trim().max(255).optional(),
    location: z.string().trim().max(255).optional(),
    category: z.string().trim().max(255).optional(),
    alt: z.string().trim().max(500).optional(),
    story: z.string().optional(),
    href: z.string().trim().max(500).optional(),
    link: z.string().trim().max(255).optional(),
    tourId: z.coerce.number().int().positive().nullish(),
    imageUrl: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Testimonial
// ---------------------------------------------------------------------------

export const testimonialSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1, "Message is required").max(5000),
    reviewerName: z.string().trim().min(1, "Reviewer name is required").max(160),
    profession: z.string().trim().max(160).optional(),
    source: z.string().trim().max(255).optional(),
    title: z.string().trim().max(255).optional(),
    date: z.string().trim().max(100).optional(),
    avatarTone: z.string().trim().max(100).optional(),
    translatedFrom: z.string().trim().max(100).optional(),
  }),
});

// ---------------------------------------------------------------------------
// Booking status
// ---------------------------------------------------------------------------

export const bookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["Pending", "Confirmed", "Cancelled"]),
  }),
});

// ---------------------------------------------------------------------------
// Contact reply
// ---------------------------------------------------------------------------

export const contactReplySchema = z.object({
  body: z.object({
    subject: z.string().trim().min(1, "Subject is required"),
    message: z.string().trim().min(1, "Message is required"),
  }),
});
