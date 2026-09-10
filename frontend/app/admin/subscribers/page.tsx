"use client";

import { useEffect, useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminNotice } from "@/components/admin/ui";

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

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Subscribers</h1>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      <div className="admin-card admin-card--flush">
        {items.length === 0 ? (
          <div className="admin-empty">
            <p style={{ margin: "0 0 8px" }}>No subscribers yet.</p>
            <p style={{ margin: 0, fontSize: 13 }}>Subscribers will appear here when visitors sign up through your site.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.email}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <AdminButton variant="danger" size="small" onClick={() => handleDelete(s.id, s.email)}>
                        Remove
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
