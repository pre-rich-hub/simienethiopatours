"use client";

import { useEffect, useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminBadge, AdminButton, AdminNotice, Search } from "@/components/admin/ui";

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
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    adminRequestClient<Tour[]>("/api/v1/admin/tours")
      .then((data) => { if (data) setTours(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      setNotice({ type: "success", msg: "Tour deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Tours</h1>
        <div className="admin-page-header__actions">
          <a href="/admin/tours/new" className="admin-button admin-button--primary">
            New tour
          </a>
        </div>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      <div className="admin-search">
        <div className="admin-search-wrap">
          <Search />
          <input
            className="admin-search__input"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card admin-card--flush">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            {tours.length === 0 ? "No tours yet. Create your first tour." : "No tours match your search."}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Duration</th>
                  <th>Style</th>
                  <th>Price</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tour) => (
                  <tr key={tour.id}>
                    <td>
                      <a href={`/admin/tours/${tour.id}`} style={{ color: "var(--ink)", fontWeight: 600 }}>
                        {tour.name}
                      </a>
                    </td>
                    <td className="admin-table__slug">{tour.slug}</td>
                    <td>{tour.duration || "—"}</td>
                    <td>{tour.style || "—"}</td>
                    <td>{tour.adultPrice != null ? `$${tour.adultPrice}` : "—"}</td>
                    <td>{tour.sortOrder}</td>
                    <td>
                      <AdminBadge variant={tour.isPublished ? "green" : "amber"}>
                        {tour.isPublished ? "Published" : "Draft"}
                      </AdminBadge>
                    </td>
                    <td>
                      {tour.isFeatured && <AdminBadge variant="green">Featured</AdminBadge>}
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <a href={`/admin/tours/${tour.id}`} className="admin-button admin-button--secondary admin-button--small">
                          Edit
                        </a>
                        <AdminButton
                          variant="danger"
                          size="small"
                          onClick={() => handleDelete(tour.id, tour.name)}
                        >
                          Delete
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
