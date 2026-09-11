"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminSelect, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
  adminFormSection, adminFormGrid, adminFileRow, adminFormActions, adminImagePreview, adminThumb, adminTableActions,
} from "@/components/admin/ui";
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

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        actions={<AdminButton variant="primary" onClick={openNew}>New image</AdminButton>}
      />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit image" : "New image"}>
            <form onSubmit={handleSubmit}>
              <div className={adminFileRow}>
                <AdminField label="Image URL or file">
                  <AdminInput
                    placeholder="https://... or /assets/images/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <AdminInput type="file" accept="image/*" className="mt-2" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </AdminField>
                {(file || imageUrl) && (
                  <img className={adminImagePreview} src={imagePreview} alt="Preview" />
                )}
              </div>

              <div className={`${adminFormGrid} mt-4`}>
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

              <AdminField label="Story" className={adminFormSection}>
                <AdminTextarea value={story} onChange={(e) => setStory(e.target.value)} />
              </AdminField>

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
          <AdminEmpty>No gallery images yet.</AdminEmpty>
        ) : (
          <AdminListTable headers={["Image", "Title", "Category", "Location", "Link", "Tour", ""]}>
            {items.map((g) => (
              <AdminTableRow key={g.id} className="hover:bg-copper/3">
                <AdminTd>
                  {g.imageUrl && <img className={adminThumb} src={g.imageUrl} alt={g.alt || g.title || ""} />}
                </AdminTd>
                <AdminTd>{g.title || "—"}</AdminTd>
                <AdminTd>{g.category || "—"}</AdminTd>
                <AdminTd>{g.location || "—"}</AdminTd>
                <AdminTd truncate>{g.href || "—"}</AdminTd>
                <AdminTd>{g.tour?.name || "—"}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => openEdit(g)}>Edit</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(g.id)}>Delete</AdminButton>
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
