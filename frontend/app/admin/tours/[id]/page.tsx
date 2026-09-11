"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TourForm from "@/components/admin/TourForm";
import { adminRequestClient } from "@/lib/admin/client";
import { AdminCard, AdminEmpty, AdminError, AdminLoading, AdminPageHeader } from "@/components/admin/ui";

type Option = { id: number; name: string };

export default function AdminTourEditPage() {
  const params = useParams();
  const tourId = Number(params.id);
  const [tour, setTour] = useState<Record<string, unknown> | null>(null);
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!tourId) return;
    setLoading(true);
    setError("");
    Promise.all([
      adminRequestClient<Record<string, unknown>>(`/api/v1/admin/tours/${tourId}`),
      adminRequestClient<Option[]>("/api/v1/admin/destinations"),
      adminRequestClient<Option[]>("/api/v1/admin/categories"),
    ])
      .then(([t, d, c]) => {
        if (!t) { setError("Tour not found"); return; }
        setTour(t);
        if (d) setDestinations(d);
        if (c) setCategories(c);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load tour"))
      .finally(() => setLoading(false));
  }, [tourId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <AdminLoading />;
  if (error) return <AdminError onRetry={load}>{error}</AdminError>;
  if (!tour) return <AdminEmpty>Tour not found.</AdminEmpty>;

  return (
    <>
      <AdminPageHeader title="Edit tour" slug={typeof tour.slug === "string" ? `/${tour.slug}` : undefined} />
      <AdminCard>
        <TourForm tourId={tourId} initialData={tour} destinations={destinations} categories={categories} />
      </AdminCard>
    </>
  );
}
