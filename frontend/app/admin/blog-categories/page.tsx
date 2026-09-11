"use client";

import { useState, type FormEvent } from "react";
import { adminMutate } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminButton, AdminCard, AdminField, AdminInput,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminListTable, AdminTableRow, AdminTd,
  AdminNotice, adminFormSection, adminFormActions, adminTableActions,
} from "@/components/admin/ui";

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  postCount: number;
};

export default function AdminBlogCategoriesPage() {
  const { items, setItems, loading, error, reload } = useAdminList<BlogCategory>("/api/v1/admin/blog-categories");
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openNew() {
    setEditing(null); setName(""); setFormError(null); setShowForm(true);
  }

  function openEdit(c: BlogCategory) {
    setEditing(c); setName(c.name); setFormError(null); setShowForm(true);
  }

  function cancel() { setShowForm(false); setEditing(null); setFormError(null); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const path = editing
        ? `/api/v1/admin/blog-categories/${editing.id}`
        : `/api/v1/admin/blog-categories`;
      const result = await adminMutate(path, {
        method: editing ? "PUT" : "POST",
        json: { name },
      });
      if (result === null) return;
      adminToast("success", editing ? "Category updated." : "Category created.");
      setShowForm(false); setEditing(null); await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  async function handleDelete(id: number, catName: string) {
    if (!window.confirm(`Delete "${catName}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/blog-categories/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((c) => c.id !== id));
      adminToast("success", "Category deleted.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Blog categories"
        actions={<AdminButton variant="primary" onClick={openNew}>New category</AdminButton>}
      />

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit category" : "New category"}>
            {formError && <AdminNotice variant="error" className="mb-4">{formError}</AdminNotice>}
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
        {error ? (
          <AdminError onRetry={() => void reload()}>{error}</AdminError>
        ) : items.length === 0 ? (
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
