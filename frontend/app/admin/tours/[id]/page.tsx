"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TourForm from "@/components/admin/TourForm";
import { adminRequestClient } from "@/lib/admin/client";

type Option = { id: number; name: string };

export default function AdminTourEditPage() {
  const params = useParams();
  const tourId = Number(params.id);
  const [tour, setTour] = useState<Record<string, unknown> | null>(null);
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tourId) return;
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

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-empty">{error}</div>;
  if (!tour) return <div className="admin-empty">Tour not found.</div>;

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-tour-header">
          <h1>Edit tour</h1>
          {typeof tour.slug === "string" && <span className="admin-tour-header__slug">/{tour.slug}</span>}
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card__body">
          <TourForm tourId={tourId} initialData={tour} destinations={destinations} categories={categories} />
        </div>
      </div>
    </>
  );
}
