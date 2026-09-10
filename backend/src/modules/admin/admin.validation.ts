import { z } from "zod";

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
    isFeatured: z.any().optional(),
    tourOverview: looseString,
    tourIncluded: z.any().optional(),
    tourExcluded: z.any().optional(),
    tourItinerary: z.any().optional(),
    tourMap: looseString,
    // Editorial fields (P1 content pipeline)
    heroTitle: looseString,
    heroAccent: looseString,
    image: z.any().optional(), // file or URL string
    imageAlt: looseString,
    duration: looseString,
    style: looseString,
    difficulty: looseString,
    fit: looseString,
    inquiry: looseString,
    notice: looseString,
    route: z.any().optional(),
    facts: z.any().optional(),
    introduction: z.any().optional(),
    highlights: z.any().optional(),
    preparation: z.any().optional(),
    related: z.any().optional(),
    isPublished: z.any().optional(),
    sortOrder: z.any().optional(),
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
    isFeatured: z.any().optional(),
    tourOverview: looseString,
    tourIncluded: z.any().optional(),
    tourExcluded: z.any().optional(),
    tourItinerary: z.any().optional(),
    tourMap: looseString,
    heroTitle: looseString,
    heroAccent: looseString,
    image: z.any().optional(),
    imageAlt: looseString,
    duration: looseString,
    style: looseString,
    difficulty: looseString,
    fit: looseString,
    inquiry: looseString,
    notice: looseString,
    route: z.any().optional(),
    facts: z.any().optional(),
    introduction: z.any().optional(),
    highlights: z.any().optional(),
    preparation: z.any().optional(),
    related: z.any().optional(),
    isPublished: z.any().optional(),
    sortOrder: z.any().optional(),
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
  }),
});

export const destinationUpdateSchema = z.object({
  body: z.object({
    destinationName: z.string().trim().min(1, "Destination name is required").optional(),
    destinationDescription: z.string().optional(),
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
  }),
});

export const blogUpdateSchema = z.object({
  body: z.object({
    blogTitle: z.string().trim().min(1, "Title is required").optional(),
    blogDescription: z.string().optional(),
    content: z.string().optional(),
    href: z.string().trim().max(500).optional(),
    categoryId: z.any().optional(),
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
