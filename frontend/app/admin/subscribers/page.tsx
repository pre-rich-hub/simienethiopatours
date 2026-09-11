"use client";

import { useEffect, useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminNotice, AdminPageHeader, AdminLoading, AdminEmpty, AdminCard,
  AdminListTable, AdminTableRow, AdminTd,
} from "@/components/admin/ui";

type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export default function AdminSubscribersPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function load() {
    adminRequestClient<Subscriber[]>("/api/v1/admin/subscribers")
      .then((d) => { if (d) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number, email: string) {
    if (!window.confirm(`Remove subscriber "${email}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/subscribers/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((s) => s.id !== id));
      setNotice({ type: "success", msg: "Subscriber removed." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="Subscribers" />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      <AdminCard flush>
        {items.length === 0 ? (
          <AdminEmpty>
            <p className="mb-2">No subscribers yet.</p>
            <p className="m-0 text-[13px]">Subscribers will appear here when visitors sign up through your site.</p>
          </AdminEmpty>
        ) : (
          <AdminListTable headers={["Email", "Subscribed", ""]}>
            {items.map((s) => (
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
