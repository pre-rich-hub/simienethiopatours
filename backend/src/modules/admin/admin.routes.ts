import { catalogueInvalidation } from "../catalog/catalogue-invalidation.js";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/database.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok, fail } from "../../utils/api-response.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { requireAdminAuth } from "../../middleware/auth.middleware.js";
import {
  uploadFor,
  storedPathForFile,
  urlForFile,
} from "../../middleware/upload.middleware.js";
import {
  parseOptionalJsonArrayString,
  toBoolean,
  toNumber,
} from "../../utils/parsers.js";
import { removeStoredFile } from "../../services/file.service.js";
import { sendEmail } from "../../services/email.service.js";
import { slugify } from "../../utils/slug.js";
import { parseJson } from "../catalog/destination-content.js";
import { serializeDestination } from "../catalog/destination.serializers.js";
import { tourContentSchema } from "../catalog/tour-content.js";
import { destinationContentSchema } from "../catalog/destination-content.js";
import { publicPostSchema } from "../catalog/public-catalogue.schema.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  blogCategorySchema,
  blogCreateSchema,
  blogUpdateSchema,
  blockedDateSchema,
  bookingStatusSchema,
  categorySchema,
  contactReplySchema,
  destinationCreateSchema,
  destinationUpdateSchema,
  galleryCreateSchema,
  galleryUpdateSchema,
  testimonialSchema,
  tourCreateSchema,
  tourUpdateSchema,
  translationUpdateSchema,
} from "./admin.validation.js";

export const adminRouter = Router();

adminRouter.use(requireAdminAuth);
adminRouter.use(catalogueInvalidation);

// ---------------------------------------------------------------------------
// TRANSLATIONS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/translations",
  asyncHandler(async (req, res) => {
    const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;
    const entityType = typeof req.query.entityType === "string" ? req.query.entityType : undefined;
    const rows = await prisma.contentTranslation.findMany({
      where: { ...(locale ? { locale } : {}), ...(entityType ? { entityType } : {}) },
      orderBy: [{ entityType: "asc" }, { entitySlug: "asc" }, { locale: "asc" }],
    });
    return ok(res, rows.map(row => ({ ...row, content: JSON.parse(row.content) })), "Translations fetched successfully");
  }),
);

adminRouter.put(
  "/translations/:entityType/:slug/:locale",
  validate(translationUpdateSchema),
  asyncHandler(async (req, res) => {
    const { entityType, slug, locale } = req.params as { entityType: "tour" | "destination" | "blog"; slug: string; locale: "es" | "de" | "fr" };
    const sourceExists = entityType === "tour"
      ? await prisma.tour.findFirst({ where: { slug }, select: { slug: true } })
      : entityType === "destination"
        ? await prisma.destination.findFirst({ where: { slug }, select: { slug: true } })
        : await prisma.blog.findFirst({ where: { slug }, select: { slug: true } });
    if (!sourceExists) throw new HttpError(404, "Source content not found");
    const content = JSON.stringify(req.body.content);
    const status = req.body.status as string;
    if (status === "published") {
      const schema = entityType === "tour" ? tourContentSchema : entityType === "destination" ? destinationContentSchema : publicPostSchema;
      if (!schema.safeParse(req.body.content).success) throw new HttpError(422, "Published translation is incomplete or invalid");
    }
    const published = status === "published";
    const row = await prisma.contentTranslation.upsert({
      where: { entityType_entitySlug_locale: { entityType, entitySlug: slug, locale } },
      update: { content, status, reviewedAt: status === "reviewed" || published ? new Date() : null, publishedAt: published ? new Date() : null },
      create: { entityType, entitySlug: slug, locale, content, status, reviewedAt: status === "reviewed" || published ? new Date() : null, publishedAt: published ? new Date() : null },
    });
    return ok(res, { ...row, content: req.body.content }, "Translation saved successfully");
  }),
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const idParam = z.coerce.number().int().positive();

function parseCategoryIds(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number).filter(Number.isInteger);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(Number).filter(Number.isInteger);
    } catch {
      return value
        .split(",")
        .map(Number)
        .filter(Number.isInteger);
    }
  }
  return [];
}

function parseItinerary(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") return "[]";
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? JSON.stringify(parsed) : "[]";
  } catch {
    return "[]";
  }
}

function parseJsonField(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
      if (typeof parsed === "object" && parsed !== null) return JSON.stringify(parsed);
    } catch {
      return null;
    }
  }
  return null;
}

async function saveEditorialReview(entityType: "tour" | "destination", entitySlug: string, body: Record<string, unknown>, reviewerId?: number) {
  const status = typeof body.editorialStatus === "string" ? body.editorialStatus : undefined;
  const data = {
    ...(status ? { status } : {}),
    ...(body.reviewSourceNotes !== undefined ? { sourceNotes: String(body.reviewSourceNotes || "") || null } : {}),
    ...(reviewerId ? { reviewerId } : {}),
    ...(body.routeApproved !== undefined ? { routeApproved: toBoolean(body.routeApproved) } : {}),
    ...(body.commercialApproved !== undefined ? { commercialApproved: toBoolean(body.commercialApproved) } : {}),
    ...(body.safetyApproved !== undefined ? { safetyApproved: toBoolean(body.safetyApproved) } : {}),
    ...(body.translationApproved !== undefined ? { translationApproved: toBoolean(body.translationApproved) } : {}),
    ...(status === "reviewed" ? { reviewedAt: new Date() } : {}),
    ...(status === "published" ? { publishedAt: new Date(), reviewedAt: new Date() } : {}),
  };
  if (!Object.keys(data).length) return;
  await prisma.editorialReview.upsert({ where: { entityType_entitySlug: { entityType, entitySlug } }, update: data, create: { entityType, entitySlug, status: status ?? "draft", ...data } });
}

function destinationJson(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "[]";
  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(Array.isArray(parsed) ? parsed : []);
  } catch {
    return "[]";
  }
}

function destinationIds(value: unknown): number[] {
  return parseCategoryIds(value).filter((id) => id > 0);
}

/**
 * The tour model uses destinationId (single FK) and a junction table
 * (TourDestinationJunction) for multi-destination support. Parse both
 * body fields, deduplicate, and fall back to the singular FK.
 */
const tourDestinationSchema = z.coerce
  .number()
  .int()
  .positive("A destination is required");

function parseTourDestinationIds(body: Record<string, unknown>): number[] {
  const destinationIds = [
    ...new Set(
      parseCategoryIds(body.tourDestinations).filter((id) => id > 0),
    ),
  ];
  if (destinationIds.length > 0) return destinationIds;
  return [tourDestinationSchema.parse(body.tourDestination)];
}

async function uniqueTourSlug(
  title: string,
  excludeId?: number,
): Promise<string> {
  const base = slugify(title) || "tour";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.tour.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------

const tourUpload = uploadFor("tour");
const destinationUpload = uploadFor("destination");
const blogUpload = uploadFor("blog");
const galleryUpload = uploadFor("gallery");

// ---------------------------------------------------------------------------
// 1. DASHBOARD
// ---------------------------------------------------------------------------

adminRouter.get(
  "/dashboard/stats",
  asyncHandler(async (_req, res) => {
    const [
      totalTours,
      publishedTours,
      unpublishedTours,
      totalDestinations,
      totalBookings,
      totalContacts,
      totalTestimonials,
      totalSubscribers,
      totalGalleryImages,
      totalBlogPosts,
      recentBookings,
    ] = await Promise.all([
      prisma.tour.count(),
      prisma.tour.count({ where: { isPublished: true } }),
      prisma.tour.count({ where: { isPublished: false } }),
      prisma.destination.count(),
      prisma.booking.count(),
      prisma.contact.count(),
      prisma.testimonial.count(),
      prisma.subscriber.count(),
      prisma.gallery.count(),
      prisma.blog.count(),
      prisma.booking.findMany({
        include: { tour: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return ok(res, {
      totals: {
        tours: totalTours,
        publishedTours,
        unpublishedTours,
        destinations: totalDestinations,
        bookings: totalBookings,
        contacts: totalContacts,
        testimonials: totalTestimonials,
        subscribers: totalSubscribers,
        galleryImages: totalGalleryImages,
        blogPosts: totalBlogPosts,
      },
      recentBookings: recentBookings.map((b) => ({
        id: b.id,
        tourId: b.tourId,
        tour: b.tour ? { id: b.tour.id, name: b.tour.tourName } : null,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        country: b.country,
        chosenDate: b.chosenDate,
        adults: b.adults,
        children: b.children,
        status: b.status ?? "Pending",
        createdAt: b.createdAt,
      })),
    }, "Dashboard stats fetched successfully");
  }),
);

// ---------------------------------------------------------------------------
// 2. TOURS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/tours",
  asyncHandler(async (_req, res) => {
    const tours = await prisma.tour.findMany({
      include: {
        destination: true,
        destinations: { include: { destination: true } },
        gallery: { orderBy: { id: "asc" } },
        categories: { include: { category: true } },
      },
      orderBy: { id: "desc" },
    });

    const mapped = tours.map((t) => ({
      id: t.id,
      name: t.tourName,
      slug: t.slug,
      isPublished: t.isPublished,
      sortOrder: t.sortOrder,
      isFeatured: Boolean(t.isFeatured),
      overview: t.overview,
      adultPrice: t.adultPrice != null ? Number(t.adultPrice) : null,
      childPrice: t.childPrice != null ? Number(t.childPrice) : null,
      discount: t.discount,
      rating: t.rating != null ? Number(t.rating) : null,
      noOfRates: t.noOfRates,
      image: t.image ?? null,
      duration: t.duration ?? null,
      gallery: t.gallery.map((g) => ({
        id: g.id,
        imageUrl: g.imageUrl,
        tourId: g.tourId,
      })),
      categories: t.categories.map((c) => ({
        id: c.category.id,
        name: c.category.categoryName,
        createdAt: c.category.createdAt ?? null,
        tourCount: undefined as number | undefined,
      })),
      destination: t.destination
        ? {
            id: t.destination.id,
            name: t.destination.destinationName,
            description: t.destination.description,
            imageUrl: t.destination.imageUrl,
          }
        : null,
      style: t.style ?? null,
      journeyType: t.journeyType,
      editorialStatus: t.editorialStatus,
      editorialSourceNotes: t.editorialSourceNotes,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return ok(res, mapped, "Tours fetched successfully");
  }),
);

adminRouter.get(
  "/tours/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        destination: true,
        destinations: { include: { destination: true } },
        gallery: { orderBy: { id: "asc" } },
        categories: { include: { category: true } },
      },
    });
    if (!tour) throw new HttpError(404, "Tour not found");

    return ok(res, {
      id: tour.id,
      name: tour.tourName,
      slug: tour.slug,
      isPublished: tour.isPublished,
      sortOrder: tour.sortOrder,
      isFeatured: Boolean(tour.isFeatured),
      overview: tour.overview,
      summary: tour.summary,
      itineraryIntro: tour.itineraryIntro,
      itineraryNotes: tour.itineraryNotes,
      adultPrice: tour.adultPrice != null ? Number(tour.adultPrice) : null,
      childPrice: tour.childPrice != null ? Number(tour.childPrice) : null,
      discount: tour.discount,
      rating: tour.rating != null ? Number(tour.rating) : null,
      noOfRates: tour.noOfRates,
      image: tour.image ?? null,
      heroTitle: tour.heroTitle ?? null,
      heroAccent: tour.heroAccent ?? null,
      imageAlt: tour.imageAlt ?? null,
      duration: tour.duration ?? null,
      style: tour.style ?? null,
      journeyType: tour.journeyType,
      editorialStatus: tour.editorialStatus,
      editorialSourceNotes: tour.editorialSourceNotes,
      editorialReview: await prisma.editorialReview.findUnique({ where: { entityType_entitySlug: { entityType: "tour", entitySlug: tour.slug } } }),
      difficulty: tour.difficulty ?? null,
      fit: tour.fit ?? null,
      inquiry: tour.inquiry ?? null,
      notice: tour.notice ?? null,
      itinerary: tour.itinerary,
      journeyMap: tour.journeyMap,
      route: tour.route,
      facts: tour.facts,
      introduction: tour.introduction,
      highlights: tour.highlights,
      preparation: tour.preparation,
      related: tour.related,
      included: tour.included,
      excluded: tour.excluded,
      gallery: tour.gallery.map((g) => ({
        id: g.id,
        imageUrl: g.imageUrl,
        tourId: g.tourId,
      })),
      categories: tour.categories.map((c) => ({
        id: c.category.id,
        name: c.category.categoryName,
        createdAt: c.category.createdAt ?? null,
      })),
      destination: tour.destination
        ? {
            id: tour.destination.id,
            name: tour.destination.destinationName,
            description: tour.destination.description,
            imageUrl: tour.destination.imageUrl,
          }
        : null,
      destinations: tour.destinations
        .map((d) => d.destination)
        .filter(Boolean)
        .map((d) => ({
          id: d.id,
          name: d.destinationName,
          description: d.description,
          imageUrl: d.imageUrl,
        })),
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
    }, "Tour fetched successfully");
  }),
);

adminRouter.post(
  "/tours",
  tourUpload.single("tourImage"),
  validate(tourCreateSchema),
  asyncHandler(async (req, res) => {
    const imageUrl = req.file
      ? urlForFile(req.file) || storedPathForFile(req.file)
      : typeof req.body.image === "string" && req.body.image.trim()
        ? req.body.image.trim()
        : undefined;

    const tourTitle = String(req.body.tourTitle ?? "").trim();
    if (!tourTitle) throw new HttpError(422, "Tour name is required");
    if (toBoolean(req.body.isPublished) && imageUrl && !String(req.body.imageAlt ?? "").trim()) {
      throw new HttpError(422, "Published tours require image alt text");
    }

    const categoryIds = parseCategoryIds(req.body.tourCategories).filter(
      (id) => id > 0,
    );
    const destinationIds = parseTourDestinationIds(req.body);
    const destinationId = destinationIds[0];
    const slug = await uniqueTourSlug(tourTitle);

    const created = await prisma.tour.create({
      data: {
        destinationId,
        slug,
        tourName: tourTitle,
        adultPrice: toNumber(req.body.adultPrice) ?? 0,
        childPrice: toNumber(req.body.childPrice) ?? 0,
        discount: req.body.tourDiscount
          ? String(req.body.tourDiscount)
          : null,
        rating: toNumber(req.body.tourRating) ?? 0,
        noOfRates: Number(req.body.tourReviews ?? 0),
        isFeatured: toBoolean(req.body.isFeatured),
        overview: String(req.body.tourOverview ?? ""),
        summary: req.body.summary || null,
        itineraryIntro: req.body.itineraryIntro || null,
        itineraryNotes: req.body.itineraryNotes ?? "[]",
        included: parseOptionalJsonArrayString(req.body.tourIncluded),
        excluded: parseOptionalJsonArrayString(req.body.tourExcluded),
        itinerary: parseItinerary(req.body.tourItinerary),
        journeyMap: req.body.tourMap ? String(req.body.tourMap) : null,
        image: imageUrl ?? null,
        heroTitle: req.body.heroTitle ? String(req.body.heroTitle) : null,
        heroAccent: req.body.heroAccent
          ? String(req.body.heroAccent)
          : null,
        imageAlt: req.body.imageAlt ? String(req.body.imageAlt) : null,
        duration: req.body.duration ? String(req.body.duration) : null,
        style: req.body.style ? String(req.body.style) : null,
        difficulty: req.body.difficulty
          ? String(req.body.difficulty)
          : null,
        journeyType: req.body.journeyType ?? "core-trek",
        editorialStatus: req.body.editorialStatus ?? "draft",
        editorialSourceNotes: req.body.editorialSourceNotes ? String(req.body.editorialSourceNotes) : null,
        fit: req.body.fit ? String(req.body.fit) : null,
        inquiry: req.body.inquiry ? String(req.body.inquiry) : null,
        notice: req.body.notice ? String(req.body.notice) : null,
        route: parseJsonField(req.body.route),
        facts: parseJsonField(req.body.facts),
        introduction: parseJsonField(req.body.introduction),
        highlights: parseJsonField(req.body.highlights),
        preparation: parseJsonField(req.body.preparation),
        related: parseJsonField(req.body.related),
        isPublished: toBoolean(req.body.isPublished),
        sortOrder: Number(req.body.sortOrder ?? 0),
        destinations: {
          createMany: {
            data: destinationIds.map((did) => ({ destinationId: did })),
            skipDuplicates: true,
          },
        },
        ...(categoryIds.length
          ? {
              categories: {
                createMany: {
                  data: categoryIds.map((categoryId) => ({ categoryId })),
                  skipDuplicates: true,
                },
              },
            }
          : {}),
      },
      include: {
        destination: true,
        destinations: { include: { destination: true } },
        gallery: { orderBy: { id: "asc" } },
        categories: { include: { category: true } },
      },
    });

    await saveEditorialReview("tour", created.slug, req.body, req.admin?.id);

    return ok(res, {
      id: created.id,
      name: created.tourName,
      slug: created.slug,
      isPublished: created.isPublished,
      sortOrder: created.sortOrder,
    }, "Tour created successfully");
  }),
);

adminRouter.put(
  "/tours/:id",
  tourUpload.single("tourImage"),
  validate(tourUpdateSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);

    const imageUrl = req.file
      ? urlForFile(req.file) || storedPathForFile(req.file)
      : typeof req.body.image === "string" && req.body.image.trim()
        ? req.body.image.trim()
        : undefined;
    if (toBoolean(req.body.isPublished ?? false) && (imageUrl || req.body.image) && !String(req.body.imageAlt ?? "").trim()) {
      throw new HttpError(422, "Published tours require image alt text");
    }

    const tourTitle = req.body.tourTitle
      ? String(req.body.tourTitle).trim()
      : undefined;
    if (tourTitle !== undefined && !tourTitle) {
      throw new HttpError(422, "Tour name cannot be empty");
    }

    const categoryIds = parseCategoryIds(req.body.tourCategories).filter(
      (id) => id > 0,
    );

    // Parse destination IDs only if the body provides them.
    let destinationIds: number[] | undefined;
    if (req.body.tourDestinations || req.body.tourDestination) {
      destinationIds = parseTourDestinationIds(req.body);
    }

    // Existing URLs are immutable here. Renaming a title must not break links.

    const updated = await prisma.$transaction(async (tx) => {
      await tx.tour.update({
        where: { id },
        data: {
          ...(tourTitle ? { tourName: tourTitle } : {}),
          ...(destinationIds
            ? {
                destinationId: destinationIds[0],
                destinations: {
                  deleteMany: {},
                  createMany: {
                    data: destinationIds.map((did) => ({
                      destinationId: did,
                    })),
                    skipDuplicates: true,
                  },
                },
              }
            : {}),
          ...(req.body.adultPrice !== undefined
            ? { adultPrice: toNumber(req.body.adultPrice) ?? 0 }
            : {}),
          ...(req.body.childPrice !== undefined
            ? { childPrice: toNumber(req.body.childPrice) ?? 0 }
            : {}),
          ...(req.body.tourDiscount !== undefined
            ? { discount: req.body.tourDiscount ? String(req.body.tourDiscount) : null }
            : {}),
          ...(req.body.tourRating !== undefined
            ? { rating: toNumber(req.body.tourRating) ?? 0 }
            : {}),
          ...(req.body.tourReviews !== undefined
            ? { noOfRates: Number(req.body.tourReviews ?? 0) }
            : {}),
          ...(req.body.isFeatured !== undefined
            ? { isFeatured: toBoolean(req.body.isFeatured) }
            : {}),
          ...(req.body.isPublished !== undefined
            ? { isPublished: toBoolean(req.body.isPublished) }
            : {}),
          ...(req.body.sortOrder !== undefined
            ? { sortOrder: Number(req.body.sortOrder ?? 0) }
            : {}),
          ...(req.body.tourOverview !== undefined
            ? { overview: String(req.body.tourOverview ?? "") }
            : {}),
          ...(req.body.summary !== undefined ? { summary: req.body.summary || null } : {}),
          ...(req.body.itineraryIntro !== undefined ? { itineraryIntro: req.body.itineraryIntro || null } : {}),
          ...(req.body.itineraryNotes !== undefined ? { itineraryNotes: req.body.itineraryNotes } : {}),
          ...(req.body.tourIncluded !== undefined
            ? { included: parseOptionalJsonArrayString(req.body.tourIncluded) }
            : {}),
          ...(req.body.tourExcluded !== undefined
            ? { excluded: parseOptionalJsonArrayString(req.body.tourExcluded) }
            : {}),
          ...(req.body.tourItinerary !== undefined
            ? { itinerary: parseItinerary(req.body.tourItinerary) }
            : {}),
          ...(req.body.tourMap !== undefined
            ? { journeyMap: req.body.tourMap ? String(req.body.tourMap) : null }
            : {}),
          ...(imageUrl !== undefined ? { image: imageUrl } : req.body.image === "" ? { image: null } : {}),
          ...(req.body.heroTitle !== undefined
            ? { heroTitle: req.body.heroTitle ? String(req.body.heroTitle) : null }
            : {}),
          ...(req.body.heroAccent !== undefined
            ? { heroAccent: req.body.heroAccent ? String(req.body.heroAccent) : null }
            : {}),
          ...(req.body.imageAlt !== undefined
            ? { imageAlt: req.body.imageAlt ? String(req.body.imageAlt) : null }
            : {}),
          ...(req.body.duration !== undefined
            ? { duration: req.body.duration ? String(req.body.duration) : null }
            : {}),
          ...(req.body.style !== undefined
            ? { style: req.body.style ? String(req.body.style) : null }
            : {}),
          ...(req.body.difficulty !== undefined
            ? { difficulty: req.body.difficulty ? String(req.body.difficulty) : null }
            : {}),
          ...(req.body.journeyType !== undefined ? { journeyType: req.body.journeyType } : {}),
          ...(req.body.editorialStatus !== undefined ? { editorialStatus: req.body.editorialStatus } : {}),
          ...(req.body.editorialSourceNotes !== undefined ? { editorialSourceNotes: req.body.editorialSourceNotes ? String(req.body.editorialSourceNotes) : null } : {}),
          ...(req.body.fit !== undefined
            ? { fit: req.body.fit ? String(req.body.fit) : null }
            : {}),
          ...(req.body.inquiry !== undefined
            ? { inquiry: req.body.inquiry ? String(req.body.inquiry) : null }
            : {}),
          ...(req.body.notice !== undefined
            ? { notice: req.body.notice ? String(req.body.notice) : null }
            : {}),
          ...(req.body.route !== undefined
            ? { route: parseJsonField(req.body.route) }
            : {}),
          ...(req.body.facts !== undefined
            ? { facts: parseJsonField(req.body.facts) }
            : {}),
          ...(req.body.introduction !== undefined
            ? { introduction: parseJsonField(req.body.introduction) }
            : {}),
          ...(req.body.highlights !== undefined
            ? { highlights: parseJsonField(req.body.highlights) }
            : {}),
          ...(req.body.preparation !== undefined
            ? { preparation: parseJsonField(req.body.preparation) }
            : {}),
          ...(req.body.related !== undefined
            ? { related: parseJsonField(req.body.related) }
            : {}),
        },
      });

      // Omitted means unchanged; an explicit empty list clears the selection.
      if (req.body.tourCategories !== undefined) {
        await tx.tourCategoryJunction.deleteMany({ where: { tourId: id } });
      if (categoryIds.length) {
        await tx.tourCategoryJunction.createMany({
          data: categoryIds.map((categoryId) => ({ tourId: id, categoryId })),
          skipDuplicates: true,
        });
      }
      }

      // Gallery delete
      const deleteImageIds = parseCategoryIds(req.body.deleteImages);
      if (deleteImageIds.length) {
        await tx.gallery.deleteMany({
          where: { id: { in: deleteImageIds }, tourId: id },
        });
      }

      return tx.tour.findUnique({
        where: { id },
        include: {
          destination: true,
          destinations: { include: { destination: true } },
          gallery: { orderBy: { id: "asc" } },
          categories: { include: { category: true } },
        },
      });
    }, { maxWait: 10000, timeout: 30000 });

    await saveEditorialReview("tour", updated!.slug, req.body, req.admin?.id);

    return ok(res, {
      id: updated!.id,
      name: updated!.tourName,
      slug: updated!.slug,
      isPublished: updated!.isPublished,
      sortOrder: updated!.sortOrder,
    }, "Tour updated successfully");
  }),
);

adminRouter.delete(
  "/tours/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const tour = await prisma.tour.findUnique({
      where: { id },
      select: { image: true },
    });
    const gallery = await prisma.gallery.findMany({ where: { tourId: id } });
    await prisma.$transaction([
      prisma.booking.updateMany({ where: { tourId: id }, data: { tourId: null } }),
      prisma.tourBlockedDate.deleteMany({ where: { tourId: id } }),
      prisma.tourCategoryJunction.deleteMany({ where: { tourId: id } }),
      prisma.tourDestinationJunction.deleteMany({ where: { tourId: id } }),
      prisma.gallery.deleteMany({ where: { tourId: id } }),
      prisma.tour.delete({ where: { id } }),
    ]);
    await Promise.all([
      removeStoredFile(tour?.image),
      ...gallery.map((image) => removeStoredFile(image.imageUrl)),
    ]);
    return ok(res, null, "Tour deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 3. TOUR BLOCKED DATES
// ---------------------------------------------------------------------------

adminRouter.get(
  "/tours/:id/blocked-dates",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const tour = await prisma.tour.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!tour) throw new HttpError(404, "Tour not found");

    const blockedDates = await prisma.tourBlockedDate.findMany({
      where: { tourId: id },
      orderBy: { date: "asc" },
    });

    return ok(res, blockedDates.map((bd) => ({
      id: bd.id,
      date: bd.date.toISOString().slice(0, 10),
      reason: bd.reason,
    })), "Blocked dates fetched successfully");
  }),
);

adminRouter.post(
  "/tours/:id/blocked-dates",
  validate(blockedDateSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const tour = await prisma.tour.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!tour) throw new HttpError(404, "Tour not found");

    // Validate dates parse to real calendar dates (catches e.g. "2026-13-45")
    const parsedDates = req.body.dates.map((date: string) => {
      const d = new Date(`${date}T00:00:00.000Z`);
      if (isNaN(d.getTime())) {
        throw new HttpError(422, `Invalid date: ${date}`);
      }
      return d;
    });

    const created = await prisma.tourBlockedDate.createMany({
      data: parsedDates.map((d: Date) => ({
        tourId: id,
        date: d,
        reason: req.body.reason,
      })),
      skipDuplicates: true,
    });

    return ok(res, { count: created.count }, `${created.count} blocked dates created successfully`);
  }),
);

adminRouter.delete(
  "/tours/:id/blocked-dates/:blockedDateId",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const blockedDateId = idParam.parse(req.params.blockedDateId);

    const blockedDate = await prisma.tourBlockedDate.findFirst({
      where: { id: blockedDateId, tourId: id },
    });
    if (!blockedDate) throw new HttpError(404, "Blocked date not found");

    await prisma.tourBlockedDate.delete({ where: { id: blockedDateId } });
    return ok(res, null, "Blocked date deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 4. DESTINATIONS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/destinations",
  asyncHandler(async (_req, res) => {
    const destinations = await prisma.destination.findMany({
      include: { _count: { select: { tours: true, tourLinks: true } } },
      orderBy: [{ area: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
    });
    return ok(res, destinations.map((d) => serializeDestination(d)), "Destinations fetched successfully");
  }),
);

adminRouter.get(
  "/destinations/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        _count: { select: { tours: true, tourLinks: true } },
        tourLinks: { include: { tour: { select: { slug: true, tourName: true, isPublished: true } } } },
      },
    });
    if (!destination) throw new HttpError(404, "Destination not found");
    return ok(res, { ...serializeDestination(destination, true), editorialStatus: destination.editorialStatus, editorialSourceNotes: destination.editorialSourceNotes, editorialReview: await prisma.editorialReview.findUnique({ where: { entityType_entitySlug: { entityType: "destination", entitySlug: destination.slug } } }) }, "Destination fetched successfully");
  }),
);

adminRouter.post(
  "/destinations",
  destinationUpload.single("destinationImage"),
  validate(destinationCreateSchema),
  asyncHandler(async (req, res) => {
    const imageUrl = req.file ? urlForFile(req.file) || storedPathForFile(req.file) : (req.body.image ? String(req.body.image) : null);
    const name = String(req.body.destinationName ?? "").trim();
    if (toBoolean(req.body.isPublished ?? true) && imageUrl && !String(req.body.imageAlt ?? "").trim()) {
      throw new HttpError(422, "Published destinations require image alt text");
    }
    const slug = slugify(name);
    const ids = destinationIds(req.body.tourIds);
    const destination = await prisma.destination.create({
      data: {
        slug, destinationName: name,
        description: String(req.body.destinationDescription ?? ""),
        area: req.body.area ?? "gondar", type: req.body.type ?? "other",
        location: req.body.location ? String(req.body.location) : null,
        alsoKnownAs: destinationJson(req.body.alsoKnownAs),
        heroTitle: req.body.heroTitle ? String(req.body.heroTitle) : null,
        heroAccent: req.body.heroAccent ? String(req.body.heroAccent) : null,
        overview: destinationJson(req.body.overview),
        highlights: destinationJson(req.body.highlights),
        thingsToDo: destinationJson(req.body.thingsToDo),
        imageUrl, imageAlt: req.body.imageAlt ? String(req.body.imageAlt) : null,
        sourceReferences: destinationJson(req.body.sourceReferences),
        editorialStatus: req.body.editorialStatus ?? "draft",
        editorialSourceNotes: req.body.editorialSourceNotes ? String(req.body.editorialSourceNotes) : null,
        isPublished: toBoolean(req.body.isPublished ?? true),
        sortOrder: Number(req.body.sortOrder ?? 0),
        tourLinks: { createMany: { data: ids.map((tourId) => ({ tourId })), skipDuplicates: true } },
      },
      include: { _count: { select: { tours: true, tourLinks: true } }, tourLinks: { include: { tour: { select: { slug: true, tourName: true, isPublished: true } } } } },
    });
    await saveEditorialReview("destination", destination.slug, req.body, req.admin?.id);
    return ok(res, serializeDestination(destination, true), "Destination created successfully");
  }),
);

adminRouter.put(
  "/destinations/:id",
  destinationUpload.single("destinationImage"),
  validate(destinationUpdateSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const current = await prisma.destination.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, "Destination not found");
    const imageUrl = req.file ? urlForFile(req.file) || storedPathForFile(req.file) : undefined;
    if (toBoolean(req.body.isPublished ?? current.isPublished) && (imageUrl || current.imageUrl) && !String(req.body.imageAlt ?? current.imageAlt ?? "").trim()) {
      throw new HttpError(422, "Published destinations require image alt text");
    }
    const ids = req.body.tourIds !== undefined ? destinationIds(req.body.tourIds) : undefined;
    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.destination.update({
        where: { id },
        data: {
          ...(req.body.destinationName !== undefined ? { destinationName: String(req.body.destinationName).trim() } : {}),
          ...(req.body.destinationDescription !== undefined ? { description: String(req.body.destinationDescription) } : {}),
          ...(req.body.area !== undefined ? { area: req.body.area } : {}),
          ...(req.body.type !== undefined ? { type: req.body.type } : {}),
          ...(req.body.location !== undefined ? { location: req.body.location ? String(req.body.location) : null } : {}),
          ...(req.body.alsoKnownAs !== undefined ? { alsoKnownAs: destinationJson(req.body.alsoKnownAs) } : {}),
          ...(req.body.heroTitle !== undefined ? { heroTitle: req.body.heroTitle ? String(req.body.heroTitle) : null } : {}),
          ...(req.body.heroAccent !== undefined ? { heroAccent: req.body.heroAccent ? String(req.body.heroAccent) : null } : {}),
          ...(req.body.overview !== undefined ? { overview: destinationJson(req.body.overview) } : {}),
          ...(req.body.highlights !== undefined ? { highlights: destinationJson(req.body.highlights) } : {}),
          ...(req.body.thingsToDo !== undefined ? { thingsToDo: destinationJson(req.body.thingsToDo) } : {}),
          ...(imageUrl !== undefined ? { imageUrl } : req.body.image === "" ? { imageUrl: null } : {}),
          ...(req.body.imageAlt !== undefined ? { imageAlt: req.body.imageAlt ? String(req.body.imageAlt) : null } : {}),
          ...(req.body.sourceReferences !== undefined ? { sourceReferences: destinationJson(req.body.sourceReferences) } : {}),
          ...(req.body.editorialStatus !== undefined ? { editorialStatus: req.body.editorialStatus } : {}),
          ...(req.body.editorialSourceNotes !== undefined ? { editorialSourceNotes: req.body.editorialSourceNotes ? String(req.body.editorialSourceNotes) : null } : {}),
          ...(req.body.isPublished !== undefined ? { isPublished: toBoolean(req.body.isPublished) } : {}),
          ...(req.body.sortOrder !== undefined ? { sortOrder: Number(req.body.sortOrder) } : {}),
        },
      });
      if (ids !== undefined) {
        await tx.tourDestinationJunction.deleteMany({ where: { destinationId: id } });
        if (ids.length) await tx.tourDestinationJunction.createMany({ data: ids.map((tourId) => ({ destinationId: id, tourId })), skipDuplicates: true });
      }
      return tx.destination.findUnique({
        where: { id: row.id },
        include: { _count: { select: { tours: true, tourLinks: true } }, tourLinks: { include: { tour: { select: { slug: true, tourName: true, isPublished: true } } } } },
      });
    });
    await saveEditorialReview("destination", updated!.slug, req.body, req.admin?.id);
    return ok(res, { ...serializeDestination(updated!), editorialStatus: updated!.editorialStatus, editorialSourceNotes: updated!.editorialSourceNotes }, "Destination updated successfully");
  }),
);

adminRouter.delete(
  "/destinations/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const links = await prisma.tourDestinationJunction.count({ where: { destinationId: id } });
    if (links > 0) throw new HttpError(409, "Remove related tours before deleting this destination");
    await prisma.destination.delete({ where: { id } });
    return ok(res, null, "Destination deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 5. CATEGORIES (tour categories)
// ---------------------------------------------------------------------------

adminRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.tourCategory.findMany({
      include: { _count: { select: { tours: true } } },
      orderBy: { id: "asc" },
    });

    return ok(res, categories.map((c) => ({
      id: c.id,
      name: c.categoryName,
      slug: c.slug,
      createdAt: c.createdAt ?? null,
      tourCount: c._count.tours,
    })), "Categories fetched successfully");
  }),
);

adminRouter.post(
  "/categories",
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.categoryName);
    const category = await prisma.tourCategory.create({
      data: { categoryName: req.body.categoryName, slug },
      include: { _count: { select: { tours: true } } },
    });

    return ok(res, {
      id: category.id,
      name: category.categoryName,
      slug: category.slug,
      createdAt: category.createdAt ?? null,
      tourCount: category._count.tours,
    }, "Category created successfully");
  }),
);

adminRouter.put(
  "/categories/:id",
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const slug = slugify(req.body.categoryName);
    const category = await prisma.tourCategory.update({
      where: { id },
      data: { categoryName: req.body.categoryName, slug },
      include: { _count: { select: { tours: true } } },
    });

    return ok(res, {
      id: category.id,
      name: category.categoryName,
      slug: category.slug,
      createdAt: category.createdAt ?? null,
      tourCount: category._count.tours,
    }, "Category updated successfully");
  }),
);

adminRouter.delete(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.$transaction([
      prisma.tourCategoryJunction.deleteMany({ where: { categoryId: id } }),
      prisma.tourCategory.delete({ where: { id } }),
    ]);
    return ok(res, null, "Category deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 6. GALLERY
// ---------------------------------------------------------------------------

adminRouter.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    const images = await prisma.gallery.findMany({
      include: { tour: { select: { id: true, tourName: true } } },
      orderBy: { id: "desc" },
    });

    return ok(res, images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      title: img.title,
      location: img.location,
      category: img.category,
      alt: img.alt,
      story: img.story,
      href: img.href,
      link: img.link,
      tourId: img.tourId,
      tour: img.tour
        ? { id: img.tour.id, name: img.tour.tourName }
        : null,
    })), "Gallery images fetched successfully");
  }),
);

adminRouter.post(
  "/gallery",
  galleryUpload.single("galleryImage"),
  validate(galleryCreateSchema),
  asyncHandler(async (req, res) => {
    const imageUrl = req.file
      ? urlForFile(req.file) || storedPathForFile(req.file)
      : req.body.imageUrl;
    if (!imageUrl) throw new HttpError(422, "Gallery image is required");

    const tourId = req.body.tourId ?? null;

    try {
      const image = await prisma.gallery.create({
        data: {
          imageUrl,
          title: req.body.title ?? null,
          location: req.body.location ?? null,
          category: req.body.category ?? null,
          alt: req.body.alt ?? null,
          story: req.body.story ?? null,
          href: req.body.href ?? null,
          link: req.body.link ?? null,
          tourId,
        },
      });

      return ok(res, {
        id: image.id,
        imageUrl: image.imageUrl,
        title: image.title,
        location: image.location,
        category: image.category,
        alt: image.alt,
        story: image.story,
        href: image.href,
        link: image.link,
        tourId: image.tourId,
      }, "Gallery image created successfully");
    } catch (err: any) {
      if (err?.code === "P2002") {
        return fail(
          res,
          "A gallery image with this URL already exists",
          [{ path: "imageUrl", message: "Must be unique" }],
          409,
        );
      }
      throw err;
    }
  }),
);

adminRouter.put(
  "/gallery/:id",
  galleryUpload.single("galleryImage"),
  validate(galleryUpdateSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const imageUrl = req.file
      ? urlForFile(req.file) || storedPathForFile(req.file)
      : req.body.imageUrl;

    const tourId = req.body.tourId !== undefined
      ? req.body.tourId ?? null
      : undefined;

    try {
      const image = await prisma.gallery.update({
        where: { id },
        data: {
          ...(imageUrl !== undefined ? { imageUrl } : {}),
          title: req.body.title !== undefined ? req.body.title ?? null : undefined,
          location: req.body.location !== undefined ? req.body.location ?? null : undefined,
          category: req.body.category !== undefined ? req.body.category ?? null : undefined,
          alt: req.body.alt !== undefined ? req.body.alt ?? null : undefined,
          story: req.body.story !== undefined ? req.body.story ?? null : undefined,
          href: req.body.href !== undefined ? req.body.href ?? null : undefined,
          link: req.body.link !== undefined ? req.body.link ?? null : undefined,
          ...(tourId !== undefined ? { tourId } : {}),
        },
      });

      return ok(res, {
        id: image.id,
        imageUrl: image.imageUrl,
        title: image.title,
        location: image.location,
        category: image.category,
        alt: image.alt,
        story: image.story,
        href: image.href,
        link: image.link,
        tourId: image.tourId,
      }, "Gallery image updated successfully");
    } catch (err: any) {
      if (err?.code === "P2002") {
        return fail(
          res,
          "A gallery image with this URL already exists",
          [{ path: "imageUrl", message: "Must be unique" }],
          409,
        );
      }
      throw err;
    }
  }),
);

adminRouter.delete(
  "/gallery/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const image = await prisma.gallery.delete({ where: { id } });
    await removeStoredFile(image.imageUrl);
    return ok(res, null, "Gallery image deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 7. TESTIMONIALS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { id: "desc" },
    });

    return ok(res, testimonials.map((t) => ({
      id: t.id,
      message: t.message,
      reviewerName: t.reviewerName,
      profession: t.profession,
      source: t.source,
      title: t.title,
      date: t.date,
      avatarTone: t.avatarTone,
      translatedFrom: t.translatedFrom,
    })), "Testimonials fetched successfully");
  }),
);

adminRouter.post(
  "/testimonials",
  validate(testimonialSchema),
  asyncHandler(async (req, res) => {
    const testimonial = await prisma.testimonial.create({
      data: {
        message: req.body.message,
        reviewerName: req.body.reviewerName,
        profession: req.body.profession ?? null,
        source: req.body.source ?? null,
        title: req.body.title ?? null,
        date: req.body.date ?? null,
        avatarTone: req.body.avatarTone ?? null,
        translatedFrom: req.body.translatedFrom ?? null,
      },
    });

    return ok(res, {
      id: testimonial.id,
      message: testimonial.message,
      reviewerName: testimonial.reviewerName,
      profession: testimonial.profession,
      source: testimonial.source,
      title: testimonial.title,
      date: testimonial.date,
      avatarTone: testimonial.avatarTone,
      translatedFrom: testimonial.translatedFrom,
    }, "Testimonial created successfully");
  }),
);

adminRouter.put(
  "/testimonials/:id",
  validate(testimonialSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        message: req.body.message,
        reviewerName: req.body.reviewerName,
        profession: req.body.profession ?? null,
        source: req.body.source ?? null,
        title: req.body.title ?? null,
        date: req.body.date ?? null,
        avatarTone: req.body.avatarTone ?? null,
        translatedFrom: req.body.translatedFrom ?? null,
      },
    });

    return ok(res, {
      id: testimonial.id,
      message: testimonial.message,
      reviewerName: testimonial.reviewerName,
      profession: testimonial.profession,
      source: testimonial.source,
      title: testimonial.title,
      date: testimonial.date,
      avatarTone: testimonial.avatarTone,
      translatedFrom: testimonial.translatedFrom,
    }, "Testimonial updated successfully");
  }),
);

adminRouter.delete(
  "/testimonials/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.testimonial.delete({ where: { id } });
    return ok(res, null, "Testimonial deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 8. BLOG
// Publication requires enough information to render a complete article.
function assertJournalPublish(row: Record<string, unknown>, publishing: boolean) {
  if (!publishing) return;
  const description = row.blogDescription ?? row.description;
  if (![row.blogTitle, description, row.content, row.author].every(v => typeof v === "string" && v.trim())) {
    throw new HttpError(400, "Published articles require title, description, content and author");
  }
  if (row.imageUrl && !(typeof row.imageAlt === "string" && row.imageAlt.trim())) throw new HttpError(400, "Published images require alt text");
}

// ---------------------------------------------------------------------------

adminRouter.get(
  "/blog",
  asyncHandler(async (_req, res) => {
    const posts = await prisma.blog.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
    });

    return ok(res, posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      blogTitle: p.blogTitle,
      description: p.description,
      content: p.content,
      imageUrl: p.imageUrl,
      href: p.href,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? null,
      createdAt: p.createdAt,
      isPublished: p.isPublished, author: p.author, imageAlt: p.imageAlt, publishedAt: p.publishedAt, updatedAt: p.updatedAt,
    })), "Blog posts fetched successfully");
  }),
);

adminRouter.get(
  "/blog/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const post = await prisma.blog.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!post) throw new HttpError(404, "Blog post not found");

    return ok(res, {
      id: post.id,
      slug: post.slug,
      blogTitle: post.blogTitle,
      description: post.description,
      content: post.content,
      imageUrl: post.imageUrl,
      href: post.href,
      categoryId: post.categoryId,
      categoryName: post.category?.name ?? null,
      createdAt: post.createdAt,
      isPublished: post.isPublished, author: post.author, imageAlt: post.imageAlt, publishedAt: post.publishedAt, updatedAt: post.updatedAt,
    }, "Blog post fetched successfully");
  }),
);

adminRouter.post(
  "/blog",
  blogUpload.single("blogImage"),
  validate(blogCreateSchema),
  asyncHandler(async (req, res) => {
    const imageUrl = req.file
      ? urlForFile(req.file) || storedPathForFile(req.file)
      : undefined;
    const blogTitle = String(req.body.blogTitle ?? "");
    const slug = slugify(blogTitle);

    const publishing = toBoolean(req.body.isPublished);
    assertJournalPublish({ ...req.body, imageUrl }, publishing);
    const post = await prisma.blog.create({
      data: {
        slug,
        blogTitle,
        description: String(req.body.blogDescription ?? ""),
        content: req.body.content ? String(req.body.content) : null,
        imageUrl,
        href: req.body.href ? String(req.body.href) : null,
        categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
        createdAt: new Date(),
        isPublished: publishing, author: req.body.author || null, imageAlt: req.body.imageAlt || null,
        publishedAt: publishing ? new Date() : null,
      },
      include: { category: true },
    });

    return ok(res, {
      id: post.id,
      slug: post.slug,
      blogTitle: post.blogTitle,
      description: post.description,
      content: post.content,
      imageUrl: post.imageUrl,
      href: post.href,
      categoryId: post.categoryId,
      categoryName: post.category?.name ?? null,
      createdAt: post.createdAt,
      isPublished: post.isPublished, author: post.author, imageAlt: post.imageAlt, publishedAt: post.publishedAt, updatedAt: post.updatedAt,
    }, "Blog post created successfully");
  }),
);

adminRouter.put(
  "/blog/:id",
  blogUpload.single("blogImage"),
  validate(blogUpdateSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const imageUrl = req.file
      ? urlForFile(req.file) || storedPathForFile(req.file)
      : undefined;
    const blogTitle = req.body.blogTitle
      ? String(req.body.blogTitle)
      : undefined;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new HttpError(404, "Blog post not found");

    const publishing = req.body.isPublished === undefined ? existing.isPublished : toBoolean(req.body.isPublished);
    assertJournalPublish({ ...existing, ...req.body, imageUrl: imageUrl ?? existing.imageUrl }, publishing);
    const post = await prisma.blog.update({
      where: { id },
      data: {
        ...(blogTitle ? { blogTitle } : {}),
        isPublished: publishing,
        ...(req.body.author !== undefined ? { author: req.body.author || null } : {}),
        ...(req.body.imageAlt !== undefined ? { imageAlt: req.body.imageAlt || null } : {}),
        publishedAt: publishing ? existing.publishedAt ?? new Date() : existing.publishedAt,
        ...(req.body.blogDescription !== undefined
          ? { description: String(req.body.blogDescription ?? "") }
          : {}),
        ...(req.body.content !== undefined
          ? { content: req.body.content ? String(req.body.content) : null }
          : {}),
        ...(req.body.href !== undefined
          ? { href: req.body.href ? String(req.body.href) : null }
          : {}),
        ...(req.body.categoryId !== undefined
          ? { categoryId: req.body.categoryId ? Number(req.body.categoryId) : null }
          : {}),
        ...(imageUrl ? { imageUrl } : {}),
      },
      include: { category: true },
    });

    return ok(res, {
      id: post.id,
      slug: post.slug,
      blogTitle: post.blogTitle,
      description: post.description,
      content: post.content,
      imageUrl: post.imageUrl,
      href: post.href,
      categoryId: post.categoryId,
      categoryName: post.category?.name ?? null,
      createdAt: post.createdAt,
      isPublished: post.isPublished, author: post.author, imageAlt: post.imageAlt, publishedAt: post.publishedAt, updatedAt: post.updatedAt,
    }, "Blog post updated successfully");
  }),
);

adminRouter.delete(
  "/blog/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.blog.delete({ where: { id } });
    return ok(res, null, "Blog post deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 9. BLOG CATEGORIES
// ---------------------------------------------------------------------------

adminRouter.get(
  "/blog-categories",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { id: "asc" },
    });

    return ok(res, categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      postCount: cat._count.posts,
    })), "Blog categories fetched successfully");
  }),
);

adminRouter.post(
  "/blog-categories",
  validate(blogCategorySchema),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.name);
    const category = await prisma.blogCategory.create({
      data: { name: req.body.name, slug },
      include: { _count: { select: { posts: true } } },
    });

    return ok(res, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      postCount: category._count.posts,
    }, "Blog category created successfully");
  }),
);

adminRouter.put(
  "/blog-categories/:id",
  validate(blogCategorySchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const category = await prisma.blogCategory.update({
      where: { id },
      data: { name: req.body.name },
      include: { _count: { select: { posts: true } } },
    });

    return ok(res, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      postCount: category._count.posts,
    }, "Blog category updated successfully");
  }),
);

adminRouter.delete(
  "/blog-categories/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.blogCategory.delete({ where: { id } });
    return ok(res, null, "Blog category deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 10. BOOKINGS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/bookings",
  asyncHandler(async (_req, res) => {
    const bookings = await prisma.booking.findMany({
      include: { tour: true },
      orderBy: { createdAt: "desc" },
    });

    return ok(res, bookings.map((b) => ({
      id: b.id,
      tourId: b.tourId,
      tour: b.tour ? { id: b.tour.id, name: b.tour.tourName } : null,
      fullName: b.fullName,
      email: b.email,
      phone: b.phone,
      country: b.country,
      chosenDate: b.chosenDate,
      adults: b.adults,
      children: b.children,
      status: b.status ?? "Pending",
      createdAt: b.createdAt,
    })), "Bookings fetched successfully");
  }),
);

adminRouter.get(
  "/bookings/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { tour: true },
    });
    if (!booking) throw new HttpError(404, "Booking not found");

    return ok(res, {
      id: booking.id,
      tourId: booking.tourId,
      tour: booking.tour
        ? { id: booking.tour.id, name: booking.tour.tourName }
        : null,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      country: booking.country,
      chosenDate: booking.chosenDate,
      adults: booking.adults,
      children: booking.children,
      status: booking.status ?? "Pending",
      createdAt: booking.createdAt,
    }, "Booking fetched successfully");
  }),
);

adminRouter.put(
  "/bookings/:id/status",
  validate(bookingStatusSchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { tour: true },
    });

    return ok(res, {
      id: booking.id,
      tourId: booking.tourId,
      tour: booking.tour
        ? { id: booking.tour.id, name: booking.tour.tourName }
        : null,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      country: booking.country,
      chosenDate: booking.chosenDate,
      adults: booking.adults,
      children: booking.children,
      status: booking.status ?? "Pending",
      createdAt: booking.createdAt,
    }, "Booking status updated successfully");
  }),
);

adminRouter.delete(
  "/bookings/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.booking.delete({ where: { id } });
    return ok(res, null, "Booking deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 11. CONTACTS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/contacts",
  asyncHandler(async (_req, res) => {
    const contacts = await prisma.contact.findMany({
      orderBy: { id: "desc" },
    });

    return ok(res, contacts.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      message: c.message,
      createdAt: c.createdAt,
    })), "Contacts fetched successfully");
  }),
);

adminRouter.get(
  "/contacts/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new HttpError(404, "Contact not found");

    return ok(res, {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      message: contact.message,
      createdAt: contact.createdAt,
    }, "Contact fetched successfully");
  }),
);

adminRouter.post(
  "/contacts/:id/reply",
  validate(contactReplySchema),
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new HttpError(404, "Contact not found");

    if (!env.EMAIL_ENABLED) {
      return fail(
        res,
        "Email is not enabled",
        [{ path: "email", message: "Set EMAIL_ENABLED=true and configure SMTP/Resend to send replies" }],
        503,
      );
    }

    try {
      await sendEmail({
        to: contact.email,
        subject: req.body.subject,
        html: `
          <p>Dear ${contact.name},</p>
          <p>${req.body.message.replace(/\n/g, "<br>")}</p>
          <p>Best regards,<br>Simien Ethiopia Tours Team</p>
        `,
      });
    } catch (err) {
      return fail(
        res,
        "Failed to send email. Check that EMAIL_ENABLED is set and SMTP/Resend is configured.",
        [{ path: "email", message: err instanceof Error ? err.message : "Unknown email error" }],
        503,
      );
    }

    return ok(res, null, "Reply sent successfully");
  }),
);

adminRouter.delete(
  "/contacts/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.contact.delete({ where: { id } });
    return ok(res, null, "Contact deleted successfully");
  }),
);

// ---------------------------------------------------------------------------
// 12. SUBSCRIBERS
// ---------------------------------------------------------------------------

adminRouter.get(
  "/subscribers",
  asyncHandler(async (_req, res) => {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    return ok(res, subscribers.map((s) => ({
      id: s.id,
      email: s.email,
      createdAt: s.createdAt,
    })), "Subscribers fetched successfully");
  }),
);

adminRouter.delete(
  "/subscribers/:id",
  asyncHandler(async (req, res) => {
    const id = idParam.parse(req.params.id);
    await prisma.subscriber.delete({ where: { id } });
    return ok(res, null, "Subscriber deleted successfully");
  }),
);
