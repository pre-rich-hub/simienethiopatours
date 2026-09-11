"use client";

import { useState } from "react";
import { adminMutate } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminBadge, AdminButton, AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminCard,
  AdminSearch, AdminListTable, AdminTableRow, AdminTd, adminTableActions, adminLinkButtonClass,
} from "@/components/admin/ui";

type Tour = {
  id: number;
  name: string;
  slug: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  duration: string | null;
  style: string | null;
  adultPrice: number | null;
};

export default function AdminToursPage() {
  const { items: tours, setItems: setTours, loading, error, reload } = useAdminList<Tour>("/api/v1/admin/tours");
  const [search, setSearch] = useState("");

  const filtered = tours.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
  });

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/tours/${id}`, { method: "DELETE" });
      if (result === null) return;
      setTours((prev) => prev.filter((t) => t.id !== id));
      adminToast("success", "Tour deleted.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Tours"
        actions={<a href="/admin/tours/new" className={adminLinkButtonClass("primary")}>New tour</a>}
      />

      <AdminSearch value={search} onChange={setSearch} placeholder="Search by name or slug..." />

      <AdminCard flush>
        {error ? (
          <AdminError onRetry={() => void reload()}>{error}</AdminError>
        ) : filtered.length === 0 ? (
          <AdminEmpty>
            {tours.length === 0 ? "No tours yet. Create your first tour." : "No tours match your search."}
          </AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Slug", "Duration", "Style", "Price", "Order", "Status", "Featured", ""]}>
            {filtered.map((tour) => (
              <AdminTableRow key={tour.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">
                  <a href={`/admin/tours/${tour.id}`} className="font-semibold text-ink">{tour.name}</a>
                </AdminTd>
                <AdminTd slug>{tour.slug}</AdminTd>
                <AdminTd>{tour.duration || "—"}</AdminTd>
                <AdminTd>{tour.style || "—"}</AdminTd>
                <AdminTd>{tour.adultPrice != null ? `$${tour.adultPrice}` : "—"}</AdminTd>
                <AdminTd>{tour.sortOrder}</AdminTd>
                <AdminTd>
                  <AdminBadge variant={tour.isPublished ? "green" : "amber"}>
                    {tour.isPublished ? "Published" : "Draft"}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>
                  {tour.isFeatured && <AdminBadge variant="green">Featured</AdminBadge>}
                </AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <a href={`/admin/tours/${tour.id}`} className={adminLinkButtonClass("secondary", "small")}>Edit</a>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(tour.id, tour.name)}>
                      Delete
                    </AdminButton>
                  </div>
                </AdminTd>
              </AdminTableRow>
            ))}
          </AdminListTable>
        )}
      </AdminCard>
    </>
  );
}
