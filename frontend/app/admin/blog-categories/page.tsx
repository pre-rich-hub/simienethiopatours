"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
  adminFormSection, adminFormActions, adminTableActions,
} from "@/components/admin/ui";

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  postCount: number;
};

export default function AdminBlogCategoriesPage() {
  const [items, setItems] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function load() {
    adminRequestClient<BlogCategory[]>("/api/v1/admin/blog-categories")
      .then((d) => { if (d) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null); setName(""); setNotice(null); setShowForm(true);
  }

  function openEdit(c: BlogCategory) {
    setEditing(c); setName(c.name); setNotice(null); setShowForm(true);
  }

  function cancel() { setShowForm(false); setEditing(null); setNotice(null); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const path = editing
        ? `/api/v1/admin/blog-categories/${editing.id}`
        : `/api/v1/admin/blog-categories`;
      const result = await adminMutate(path, {
        method: editing ? "PUT" : "POST",
        json: { name },
      });
      if (result === null) return;
      setNotice({ type: "success", msg: editing ? "Category updated." : "Category created." });
      setShowForm(false); setEditing(null); load();
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Save failed" });
    }
    setSaving(false);
  }

  async function handleDelete(id: number, catName: string) {
    if (!window.confirm(`Delete "${catName}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/blog-categories/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "success", msg: "Category deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Blog categories"
        actions={<AdminButton variant="primary" onClick={openNew}>New category</AdminButton>}
      />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit category" : "New category"}>
            <form onSubmit={handleSubmit}>
              <AdminField label="Name">
                <AdminInput required value={name} onChange={(e) => setName(e.target.value)} />
              </AdminField>
              {editing && (
                <AdminField label="Slug (auto-generated)" className={adminFormSection}>
                  <AdminInput readOnly value={editing.slug} />
                </AdminField>
              )}
              <div className={`${adminFormActions} mt-4`}>
                <AdminButton type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancel}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <AdminCard flush>
        {items.length === 0 ? (
          <AdminEmpty>No blog categories yet.</AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Slug", "Posts", ""]}>
            {items.map((c) => (
              <AdminTableRow key={c.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{c.name}</AdminTd>
                <AdminTd slug>{c.slug}</AdminTd>
                <AdminTd>{c.postCount}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => openEdit(c)}>Edit</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(c.id, c.name)}>Delete</AdminButton>
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
