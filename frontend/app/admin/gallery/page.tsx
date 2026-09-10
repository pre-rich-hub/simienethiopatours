"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminSelect, AdminNotice } from "@/components/admin/ui";
import { useFilePreview } from "@/components/admin/useFilePreview";

type GalleryItem = {
  id: number;
  imageUrl: string;
  title: string | null;
  location: string | null;
  category: string | null;
  alt: string | null;
  story: string | null;
  href: string | null;
  link: string | null;
  tourId: number | null;
  tour: { id: number; name: string } | null;
};

type Tour = { id: number; name: string };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  // form
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [alt, setAlt] = useState("");
  const [story, setStory] = useState("");
  const [href, setHref] = useState("");
  const [link, setLink] = useState("");
  const [tourId, setTourId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const imagePreview = useFilePreview(file, imageUrl);

  function load() {
    Promise.all([
      adminRequestClient<GalleryItem[]>("/api/v1/admin/gallery"),
      adminRequestClient<Tour[]>("/api/v1/admin/tours"),
    ]).then(([g, t]) => {
      if (g) setItems(g);
      if (t) setTours(t.map((x) => ({ id: x.id, name: x.name })));
    }).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setImageUrl(""); setTitle(""); setLocation(""); setCategory("");
    setAlt(""); setStory(""); setHref(""); setLink(""); setTourId(""); setFile(null);
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(g: GalleryItem) {
    setEditing(g);
    setImageUrl(g.imageUrl || ""); setTitle(g.title || ""); setLocation(g.location || "");
    setCategory(g.category || ""); setAlt(g.alt || ""); setStory(g.story || "");
    setHref(g.href || ""); setLink(g.link || "");
    setTourId(g.tourId ? String(g.tourId) : ""); setFile(null);
    setNotice(null);
    setShowForm(true);
  }

  function cancel() { setShowForm(false); setEditing(null); setNotice(null); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const fd = new FormData();
      fd.append("imageUrl", imageUrl);
      if (title) fd.append("title", title);
      if (location) fd.append("location", location);
      if (category) fd.append("category", category);
      if (alt) fd.append("alt", alt);
      if (story) fd.append("story", story);
      if (href) fd.append("href", href);
      if (link) fd.append("link", link);
      if (tourId) fd.append("tourId", tourId);
      if (file) fd.append("galleryImage", file);

      const path = editing
        ? `/api/v1/admin/gallery/${editing.id}`
        : `/api/v1/admin/gallery`;
      const result = await adminMutate(path, {
        method: editing ? "PUT" : "POST",
        formData: fd,
      });
      if (result === null) return;
      setNotice({ type: "success", msg: editing ? "Gallery item updated." : "Gallery item created." });
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Save failed" });
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this gallery image? This cannot be undone.")) return;
    try {
      const result = await adminMutate(`/api/v1/admin/gallery/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((g) => g.id !== id));
      setNotice({ type: "success", msg: "Gallery image deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Gallery</h1>
        <div className="admin-page-header__actions">
          <AdminButton variant="primary" onClick={openNew}>New image</AdminButton>
        </div>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="admin-inline-form">
          <AdminCard title={editing ? "Edit image" : "New image"}>
            <form onSubmit={handleSubmit}>
              <div className="admin-file-row">
                <AdminField label="Image URL or file">
                  <AdminInput
                    placeholder="https://... or /assets/images/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <input type="file" accept="image/*" className="admin-input" style={{ marginTop: 8 }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </AdminField>
                {(file || imageUrl) && (
                  <img className="admin-image-preview" src={imagePreview} alt="Preview" />
                )}
              </div>

              <div className="admin-form-grid" style={{ marginTop: 16 }}>
                <AdminField label="Title">
                  <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
                </AdminField>
                <AdminField label="Location">
                  <AdminInput value={location} onChange={(e) => setLocation(e.target.value)} />
                </AdminField>
                <AdminField label="Category">
                  <AdminInput value={category} onChange={(e) => setCategory(e.target.value)} />
                </AdminField>
                <AdminField label="Alt text">
                  <AdminInput value={alt} onChange={(e) => setAlt(e.target.value)} />
                </AdminField>
                <AdminField label="Link (href)">
                  <AdminInput value={href} onChange={(e) => setHref(e.target.value)} />
                </AdminField>
                <AdminField label="Link label">
                  <AdminInput value={link} onChange={(e) => setLink(e.target.value)} />
                </AdminField>
                <AdminField label="Tour">
                  <AdminSelect value={tourId} onChange={(e) => setTourId(e.target.value)} placeholder="No tour">
                    {tours.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </AdminSelect>
                </AdminField>
              </div>

              <AdminField label="Story" className="admin-form-section">
                <AdminTextarea value={story} onChange={(e) => setStory(e.target.value)} />
              </AdminField>

              <div className="admin-form-actions" style={{ marginTop: 16 }}>
                <AdminButton type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancel}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <div className="admin-card admin-card--flush">
        {items.length === 0 ? (
          <div className="admin-empty">No gallery images yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Link</th>
                  <th>Tour</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((g) => (
                  <tr key={g.id}>
                    <td>
                      {g.imageUrl && <img className="admin-thumb" src={g.imageUrl} alt={g.alt || g.title || ""} />}
                    </td>
                    <td>{g.title || "—"}</td>
                    <td>{g.category || "—"}</td>
                    <td>{g.location || "—"}</td>
                    <td className="admin-table__truncate">{g.href || "—"}</td>
                    <td>{g.tour?.name || "—"}</td>
                    <td>
                      <div className="admin-table__actions">
                        <AdminButton variant="secondary" size="small" onClick={() => openEdit(g)}>Edit</AdminButton>
                        <AdminButton variant="danger" size="small" onClick={() => handleDelete(g.id)}>Delete</AdminButton>
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
