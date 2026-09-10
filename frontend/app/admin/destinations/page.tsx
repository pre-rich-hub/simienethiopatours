"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminNotice } from "@/components/admin/ui";
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

  // form state
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

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Destinations</h1>
        <div className="admin-page-header__actions">
          <AdminButton variant="primary" onClick={openNew}>New destination</AdminButton>
        </div>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="admin-inline-form">
          <AdminCard title={editing ? "Edit destination" : "New destination"}>
            <form onSubmit={handleSubmit}>
              <AdminField label="Name" className="admin-form-section">
                <AdminInput required value={name} onChange={(e) => setName(e.target.value)} />
              </AdminField>
              <AdminField label="Description" className="admin-form-section">
                <AdminTextarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              </AdminField>
              <div className="admin-file-row">
                <AdminField label="Image">
                  <input type="file" accept="image/*" className="admin-input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </AdminField>
                {(file || existingImage) && (
                  <img
                    className="admin-image-preview"
                    src={imagePreview}
                    alt="Preview"
                  />
                )}
              </div>
              <div className="admin-form-actions">
                <AdminButton type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancel}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <div className="admin-card admin-card--flush">
        {items.length === 0 ? (
          <div className="admin-empty">No destinations yet. Create your first destination.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Tours</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id}>
                    <td>
                      {d.imageUrl && <img className="admin-thumb" src={d.imageUrl} alt={d.name} />}
                    </td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td className="admin-table__slug">{d.slug}</td>
                    <td className="admin-table__truncate">{d.description || "—"}</td>
                    <td>{d.tourCount}</td>
                    <td>
                      <div className="admin-table__actions">
                        <AdminButton variant="secondary" size="small" onClick={() => openEdit(d)}>Edit</AdminButton>
                        <AdminButton variant="danger" size="small" onClick={() => handleDelete(d.id, d.name)}>Delete</AdminButton>
                      </div>
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
