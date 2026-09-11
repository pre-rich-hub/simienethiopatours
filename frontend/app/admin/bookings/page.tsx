"use client";

import { useEffect, useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminSelect, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
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

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="Bookings" />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      <AdminCard flush>
        {items.length === 0 ? (
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
                  <AdminSelect value={b.status} onChange={(e) => handleStatus(b.id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </AdminSelect>
                </AdminTd>
                <AdminTd>{new Date(b.createdAt).toLocaleDateString()}</AdminTd>
                <AdminTd>
                  <AdminButton variant="danger" size="small" onClick={() => handleDelete(b.id)}>
                    Delete
                  </AdminButton>
                </AdminTd>
              </AdminTableRow>
            ))}
          </AdminListTable>
        )}
      </AdminCard>
    </>
  );
}
