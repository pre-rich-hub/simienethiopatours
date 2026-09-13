import type { Destination } from "@prisma/client";
import { parseJson } from "./destination-content.js";

type DestinationRow = Omit<Destination, "editorialStatus" | "editorialSourceNotes"> & {
  editorialStatus?: string;
  editorialSourceNotes?: string | null;
  tourLinks?: { tourId: number; tour?: { slug: string; tourName: string; isPublished: boolean } }[];
  _count?: { tours?: number; tourLinks?: number };
};

export function serializeDestination(row: DestinationRow, includeTours = false) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.destinationName,
    area: row.area,
    type: row.type,
    location: row.location,
    alsoKnownAs: parseJson<string[]>(row.alsoKnownAs, []),
    heroTitle: row.heroTitle,
    heroAccent: row.heroAccent,
    overview: parseJson<string[]>(row.overview, row.description ? [row.description] : []),
    highlights: parseJson<string[]>(row.highlights, []),
    thingsToDo: parseJson<string[]>(row.thingsToDo, []),
    description: row.description,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    sourceReferences: parseJson<string[]>(row.sourceReferences, []),
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    tourCount: row._count?.tourLinks ?? row._count?.tours ?? row.tourLinks?.length ?? 0,
    ...(includeTours ? {
      tours: (row.tourLinks ?? []).filter((link) => link.tour?.isPublished !== false).map((link) => ({
        id: link.tourId,
        slug: link.tour?.slug,
        name: link.tour?.tourName,
      })),
    } : {}),
  };
}
