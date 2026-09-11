"use client";

import { useCallback, useEffect, useState } from "react";
import TourForm from "@/components/admin/TourForm";
import { adminRequestClient } from "@/lib/admin/client";
import { AdminCard, AdminError, AdminLoading, AdminPageHeader } from "@/components/admin/ui";

type Option = { id: number; name: string };

export default function AdminTourNewPage() {
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      adminRequestClient<Option[]>("/api/v1/admin/destinations"),
      adminRequestClient<Option[]>("/api/v1/admin/categories"),
    ])
      .then(([d, c]) => {
        if (d) setDestinations(d);
        if (c) setCategories(c);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load options."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <AdminLoading />;
  if (error) {
    return (
      <>
        <AdminPageHeader title="New tour" />
        <AdminError onRetry={load}>{error}</AdminError>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="New tour" />
      <AdminCard>
        <TourForm destinations={destinations} categories={categories} />
      </AdminCard>
    </>
  );
}
