"use client";

import { useEffect, useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminCard, AdminBadge, AdminSelect, AdminNotice } from "@/components/admin/ui";

type Booking = {
  id: number;
  tourId: number | null;
  tour: { id: number; name: string } | null;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  chosenDate: string;
  adults: number;
  children: number;
  status: string;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function load() {
    adminRequestClient<Booking[]>("/api/v1/admin/bookings")
      .then((d) => { if (d) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleStatus(id: number, status: string) {
    try {
      const result = await adminMutate(`/api/v1/admin/bookings/${id}/status`, {
        method: "PUT",
        json: { status },
      });
      if (result === null) return;
      setItems((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      setNotice({ type: "success", msg: `Booking marked as ${status}.` });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Failed" });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      const result = await adminMutate(`/api/v1/admin/bookings/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((b) => b.id !== id));
      setNotice({ type: "success", msg: "Booking deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Bookings</h1>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      <div className="admin-card admin-card--flush">
        {items.length === 0 ? (
          <div className="admin-empty">
            <p style={{ margin: "0 0 8px" }}>No bookings yet.</p>
            <p style={{ margin: 0, fontSize: 13 }}>Bookings will appear here when customers submit the booking form on your site.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tour</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>People</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.fullName}</td>
                    <td>{b.tour?.name || "—"}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>{new Date(b.chosenDate).toLocaleDateString()}</td>
                    <td>{b.adults}A{b.children > 0 ? ` + ${b.children}C` : ""}</td>
                    <td>
                      <AdminSelect
                        value={b.status}
                        onChange={(e) => handleStatus(b.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </AdminSelect>
                    </td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      <AdminButton variant="danger" size="small" onClick={() => handleDelete(b.id)}>
                        Delete
                      </AdminButton>
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
