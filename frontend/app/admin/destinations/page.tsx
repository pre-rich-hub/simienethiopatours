"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
  adminFormSection, adminFileRow, adminFormActions, adminImagePreview, adminThumb, adminTableActions,
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
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const imagePreview = useFilePreview(file, existingImage);

  function load() {
    adminRequestClient<Destination[]>("/api/v1/admin/destinations")
      .then((d) => { if (d) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setName("");
    setDesc("");
    setFile(null);
    setExistingImage("");
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(d: Destination) {
    setEditing(d);
    setName(d.name);
    setDesc(d.description || "");
    setFile(null);
    setExistingImage(d.imageUrl || "");
    setNotice(null);
    setShowForm(true);
  }

  function cancel() {
    setShowForm(false);
    setEditing(null);
    setNotice(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
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
      setNotice({ type: "success", msg: editing ? "Destination updated." : "Destination created." });
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Save failed" });
    }
    setSaving(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/destinations/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((d) => d.id !== id));
      setNotice({ type: "success", msg: "Destination deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Destinations"
        actions={<AdminButton variant="primary" onClick={openNew}>New destination</AdminButton>}
      />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit destination" : "New destination"}>
            <form onSubmit={handleSubmit}>
              <AdminField label="Name" className={adminFormSection}>
                <AdminInput required value={name} onChange={(e) => setName(e.target.value)} />
              </AdminField>
              <AdminField label="Description" className={adminFormSection}>
                <AdminTextarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              </AdminField>
              <div className={adminFileRow}>
                <AdminField label="Image">
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
        {items.length === 0 ? (
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
                    <AdminButton variant="secondary" size="small" onClick={() => openEdit(d)}>Edit</AdminButton>
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
