"use client";

import { useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminListTable, AdminTableRow, AdminTd,
  AdminNotice, adminFormSection, adminFileRow, adminFormActions, adminImagePreview, adminThumb, adminTableActions,
} from "@/components/admin/ui";
import { useFilePreview } from "@/components/admin/useFilePreview";

type Destination = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  tourCount: number;
};

export default function AdminDestinationsPage() {
  const { items, setItems, loading, error, reload } = useAdminList<Destination>("/api/v1/admin/destinations");
  const [editing, setEditing] = useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const imagePreview = useFilePreview(file, existingImage);

  function openNew() {
    setEditing(null);
    setName("");
    setDesc("");
    setFile(null);
    setExistingImage("");
    setFormError(null);
    setShowForm(true);
  }

  async function openEdit(d: Destination) {
    setShowForm(true);
    setFormError(null);
    setFile(null);
    try {
      const full = await adminRequestClient<Destination>(`/api/v1/admin/destinations/${d.id}`);
      const row = full ?? d;
      setEditing(row);
      setName(row.name);
      setDesc(row.description || "");
      setExistingImage(row.imageUrl || "");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to load destination");
      setEditing(d);
      setName(d.name);
      setDesc(d.description || "");
      setExistingImage(d.imageUrl || "");
    }
  }

  function cancel() {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const fd = new FormData();
      fd.append("destinationName", name);
      fd.append("destinationDescription", desc);
      if (file) fd.append("destinationImage", file);

      const path = editing
        ? `/api/v1/admin/destinations/${editing.id}`
        : `/api/v1/admin/destinations`;
      const result = await adminMutate(path, {
        method: editing ? "PUT" : "POST",
        formData: fd,
      });
      if (result === null) return;
      adminToast("success", editing ? "Destination updated." : "Destination created.");
      setShowForm(false);
      setEditing(null);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  async function handleDelete(id: number, destName: string) {
    if (!window.confirm(`Delete "${destName}"? This cannot be undone.`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/destinations/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((d) => d.id !== id));
      adminToast("success", "Destination deleted.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Destinations"
        actions={<AdminButton variant="primary" onClick={openNew}>New destination</AdminButton>}
      />

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit destination" : "New destination"}>
            {formError && <AdminNotice variant="error" className="mb-4">{formError}</AdminNotice>}
            <form onSubmit={handleSubmit}>
              <AdminField label="Name" className={adminFormSection}>
                <AdminInput required value={name} onChange={(e) => setName(e.target.value)} />
              </AdminField>
              {editing && (
                <AdminField label="Slug" className={adminFormSection}>
                  <AdminInput readOnly value={editing.slug} />
                </AdminField>
              )}
              <AdminField label="Description" className={adminFormSection}>
                <AdminTextarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              </AdminField>
              <div className={adminFileRow}>
                <AdminField label="Image" hint={existingImage && !file ? `Current image: ${existingImage}` : undefined}>
                  <AdminInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </AdminField>
                {(file || existingImage) && (
                  <img className={adminImagePreview} src={imagePreview} alt="Preview" />
                )}
              </div>
              <div className={adminFormActions}>
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
          <AdminEmpty>No destinations yet. Create your first destination.</AdminEmpty>
        ) : (
          <AdminListTable headers={["Image", "Name", "Slug", "Description", "Tours", ""]}>
            {items.map((d) => (
              <AdminTableRow key={d.id} className="hover:bg-copper/3">
                <AdminTd>
                  {d.imageUrl && <img className={adminThumb} src={d.imageUrl} alt={d.name} />}
                </AdminTd>
                <AdminTd className="font-semibold">{d.name}</AdminTd>
                <AdminTd slug>{d.slug}</AdminTd>
                <AdminTd truncate>{d.description || "—"}</AdminTd>
                <AdminTd>{d.tourCount}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => void openEdit(d)}>Edit</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(d.id, d.name)}>Delete</AdminButton>
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
