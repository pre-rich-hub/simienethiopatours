"use client";

import { useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminButton, AdminCard, AdminSelect,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminListTable, AdminTableRow, AdminTd,
  adminTableActions,
} from "@/components/admin/ui";

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
  const { items, setItems, loading, error, reload } = useAdminList<Booking>("/api/v1/admin/bookings");
  const [detail, setDetail] = useState<Booking | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function openDetail(id: number) {
    setDetailLoading(true);
    try {
      const row = await adminRequestClient<Booking>(`/api/v1/admin/bookings/${id}`);
      if (row) setDetail(row);
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Failed to load booking");
    }
    setDetailLoading(false);
  }

  async function handleStatus(id: number, status: string, current: string) {
    if (status === current) return;
    if (!window.confirm(`Change booking status to ${status}?`)) return;
    try {
      const result = await adminMutate<Booking>(`/api/v1/admin/bookings/${id}/status`, {
        method: "PUT",
        json: { status },
      });
      if (result === null) return;
      setItems((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      if (detail?.id === id) setDetail((prev) => prev ? { ...prev, status } : prev);
      adminToast("success", `Booking marked as ${status}.`);
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Failed");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      const result = await adminMutate(`/api/v1/admin/bookings/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((b) => b.id !== id));
      if (detail?.id === id) setDetail(null);
      adminToast("success", "Booking deleted.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="Bookings" />

      {detail && (
        <div className="mb-6">
          <AdminCard title={`Booking #${detail.id}`} actions={<AdminButton variant="secondary" size="small" onClick={() => setDetail(null)}>Close</AdminButton>}>
            {detailLoading ? (
              <p className="m-0 text-sm text-stone">Loading…</p>
            ) : (
              <dl className="m-0 grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-stone">Name</dt><dd className="m-0 font-semibold">{detail.fullName}</dd>
                <dt className="text-stone">Email</dt><dd className="m-0">{detail.email}</dd>
                <dt className="text-stone">Phone</dt><dd className="m-0">{detail.phone}</dd>
                <dt className="text-stone">Country</dt><dd className="m-0">{detail.country}</dd>
                <dt className="text-stone">Tour</dt><dd className="m-0">{detail.tour?.name || "—"}</dd>
                <dt className="text-stone">Date</dt><dd className="m-0">{new Date(detail.chosenDate).toLocaleDateString()}</dd>
                <dt className="text-stone">People</dt><dd className="m-0">{detail.adults} adult{detail.adults === 1 ? "" : "s"}{detail.children > 0 ? `, ${detail.children} child${detail.children === 1 ? "" : "ren"}` : ""}</dd>
                <dt className="text-stone">Status</dt><dd className="m-0">{detail.status}</dd>
                <dt className="text-stone">Created</dt><dd className="m-0">{new Date(detail.createdAt).toLocaleString()}</dd>
              </dl>
            )}
          </AdminCard>
        </div>
      )}

      <AdminCard flush>
        {error ? (
          <AdminError onRetry={() => void reload()}>{error}</AdminError>
        ) : items.length === 0 ? (
          <AdminEmpty>
            <p className="mb-2">No bookings yet.</p>
            <p className="m-0 text-[13px]">Bookings will appear here when customers submit the booking form on your site.</p>
          </AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Tour", "Email", "Phone", "Date", "People", "Status", "Created", ""]}>
            {items.map((b) => (
              <AdminTableRow key={b.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{b.fullName}</AdminTd>
                <AdminTd>{b.tour?.name || "—"}</AdminTd>
                <AdminTd>{b.email}</AdminTd>
                <AdminTd>{b.phone}</AdminTd>
                <AdminTd>{new Date(b.chosenDate).toLocaleDateString()}</AdminTd>
                <AdminTd>{b.adults}A{b.children > 0 ? ` + ${b.children}C` : ""}</AdminTd>
                <AdminTd>
                  <AdminSelect value={b.status} onChange={(e) => handleStatus(b.id, e.target.value, b.status)}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </AdminSelect>
                </AdminTd>
                <AdminTd>{new Date(b.createdAt).toLocaleDateString()}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => void openDetail(b.id)}>View</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(b.id)}>
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
