"use client";

import { useState } from "react";
import { adminMutate } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminButton, AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminCard,
  AdminSearch, AdminListTable, AdminTableRow, AdminTd,
} from "@/components/admin/ui";

type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export default function AdminSubscribersPage() {
  const { items, setItems, loading, error, reload } = useAdminList<Subscriber>("/api/v1/admin/subscribers");
  const [search, setSearch] = useState("");

  const filtered = items.filter((s) => !search || s.email.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id: number, email: string) {
    if (!window.confirm(`Remove subscriber "${email}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/subscribers/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((s) => s.id !== id));
      adminToast("success", "Subscriber removed.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="Subscribers" />

      <AdminSearch value={search} onChange={setSearch} placeholder="Search by email..." />

      <AdminCard flush>
        {error ? (
          <AdminError onRetry={() => void reload()}>{error}</AdminError>
        ) : filtered.length === 0 ? (
          <AdminEmpty>
            {items.length === 0 ? (
              <>
                <p className="mb-2">No subscribers yet.</p>
                <p className="m-0 text-[13px]">Subscribers will appear here when visitors sign up through your site.</p>
              </>
            ) : (
              "No subscribers match your search."
            )}
          </AdminEmpty>
        ) : (
          <AdminListTable headers={["Email", "Subscribed", ""]}>
            {filtered.map((s) => (
              <AdminTableRow key={s.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{s.email}</AdminTd>
                <AdminTd>{new Date(s.createdAt).toLocaleDateString()}</AdminTd>
                <AdminTd>
                  <AdminButton variant="danger" size="small" onClick={() => handleDelete(s.id, s.email)}>
                    Remove
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
