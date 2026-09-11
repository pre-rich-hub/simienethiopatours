"use client";

import { useEffect, useState } from "react";
import TourForm from "@/components/admin/TourForm";
import { adminRequestClient } from "@/lib/admin/client";
import { AdminCard, AdminLoading, AdminPageHeader } from "@/components/admin/ui";

type Option = { id: number; name: string };

export default function AdminTourNewPage() {
  const [destinations, setDestinations] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminRequestClient<Option[]>("/api/v1/admin/destinations"),
      adminRequestClient<Option[]>("/api/v1/admin/categories"),
    ])
      .then(([d, c]) => {
        if (d) setDestinations(d);
        if (c) setCategories(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="New tour" />
      <AdminCard>
        <TourForm destinations={destinations} categories={categories} />
      </AdminCard>
    </>
  );
}
