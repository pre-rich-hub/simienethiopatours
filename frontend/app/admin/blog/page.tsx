"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminSelect, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
  adminFormSection, adminFormGrid, adminFileRow, adminFormActions, adminImagePreview, adminThumb, adminTableActions,
} from "@/components/admin/ui";
import { useFilePreview } from "@/components/admin/useFilePreview";

type BlogPost = {
  id: number;
  slug: string;
  blogTitle: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  href: string | null;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
};

type BlogCategory = { id: number; name: string };

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [content, setContent] = useState("");
  const [href, setHref] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const imagePreview = useFilePreview(file, existingImage);

  function load() {
    Promise.all([
      adminRequestClient<BlogPost[]>("/api/v1/admin/blog"),
      adminRequestClient<BlogCategory[]>("/api/v1/admin/blog-categories"),
    ]).then(([b, c]) => {
      if (b) setItems(b);
      if (c) setCategories(c.map((x) => ({ id: x.id, name: x.name })));
    }).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setBlogTitle(""); setBlogDescription(""); setContent(""); setHref(""); setCategoryId("");
    setFile(null); setExistingImage(""); setNotice(null);
    setShowForm(true);
  }

  function openEdit(p: BlogPost) {
    setEditing(p);
    setBlogTitle(p.blogTitle); setBlogDescription(p.description || "");
    setContent(p.content || ""); setHref(p.href || ""); setCategoryId(p.categoryId ? String(p.categoryId) : "");
    setFile(null); setExistingImage(p.imageUrl || ""); setNotice(null);
    setShowForm(true);
  }

  function cancel() { setShowForm(false); setEditing(null); setNotice(null); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const fd = new FormData();
      fd.append("blogTitle", blogTitle);
      fd.append("blogDescription", blogDescription);
      fd.append("content", content);
      if (href) fd.append("href", href);
      if (categoryId) fd.append("categoryId", categoryId);
      if (file) fd.append("blogImage", file);

      const path = editing
        ? `/api/v1/admin/blog/${editing.id}`
        : `/api/v1/admin/blog`;
      const result = await adminMutate(path, {
        method: editing ? "PUT" : "POST",
        formData: fd,
      });
      if (result === null) return;
      setNotice({ type: "success", msg: editing ? "Post updated." : "Post created." });
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Save failed" });
    }
    setSaving(false);
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/blog/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((p) => p.id !== id));
      setNotice({ type: "success", msg: "Post deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Blog posts"
        actions={<AdminButton variant="primary" onClick={openNew}>New post</AdminButton>}
      />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit post" : "New post"}>
            <form onSubmit={handleSubmit}>
              <AdminField label="Title" className={adminFormSection}>
                <AdminInput required value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
              </AdminField>

              {editing && (
                <AdminField label="Slug (auto-generated)">
                  <AdminInput readOnly value={editing.slug} />
                </AdminField>
              )}

              <AdminField label="Description" className={adminFormSection}>
                <AdminTextarea value={blogDescription} onChange={(e) => setBlogDescription(e.target.value)} />
              </AdminField>

              <AdminField label="Href (optional, for experience links)" className={adminFormSection}>
                <AdminInput value={href} placeholder="/treks/gondar-heritage-simien" onChange={(e) => setHref(e.target.value)} />
              </AdminField>

              <AdminField label="Content" className={adminFormSection}>
                <AdminTextarea className="min-h-[200px]" value={content} onChange={(e) => setContent(e.target.value)} />
              </AdminField>

              <div className={adminFormGrid}>
                <AdminField label="Category">
                  <AdminSelect value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder="No category">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </AdminSelect>
                </AdminField>
                <div className={adminFileRow}>
                  <AdminField label="Image">
                    <AdminInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  </AdminField>
                </div>
              </div>

              {(file || existingImage) && (
                <img className={`${adminImagePreview} mt-3`} src={imagePreview} alt="Preview" />
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
          <AdminEmpty>No blog posts yet. Write your first post.</AdminEmpty>
        ) : (
          <AdminListTable headers={["Image", "Title", "Slug", "Category", "Created", ""]}>
            {items.map((p) => (
              <AdminTableRow key={p.id} className="hover:bg-copper/3">
                <AdminTd>
                  {p.imageUrl && <img className={adminThumb} src={p.imageUrl} alt={p.blogTitle} />}
                </AdminTd>
                <AdminTd className="font-semibold">{p.blogTitle}</AdminTd>
                <AdminTd slug>{p.slug}</AdminTd>
                <AdminTd>{p.categoryName || "—"}</AdminTd>
                <AdminTd>{new Date(p.createdAt).toLocaleDateString()}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => openEdit(p)}>Edit</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(p.id, p.blogTitle)}>Delete</AdminButton>
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
