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
import { resolveMediaUrl } from "@/lib/media-url";

type Destination = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  area: string; type: string; location: string | null;
  alsoKnownAs: string[]; heroTitle: string | null; heroAccent: string | null;
  overview: string[]; highlights: string[]; thingsToDo: string[];
  imageUrl: string | null;
  imageAlt: string | null; sourceReferences: string[]; isPublished: boolean; sortOrder: number; editorialStatus?: string; editorialSourceNotes?: string | null;
  tours?: { id: number; slug?: string; name?: string }[];
  tourCount: number;
};
const lines = (items: string[]) => items.join("\n");
const parseLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

export default function AdminDestinationsPage() {
  const { items, setItems, loading, error, reload } = useAdminList<Destination>("/api/v1/admin/destinations");
  const [editing, setEditing] = useState<Destination | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [area, setArea] = useState("gondar");
  const [type, setType] = useState("other");
  const [location, setLocation] = useState("");
  const [aliases, setAliases] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroAccent, setHeroAccent] = useState("");
  const [overview, setOverview] = useState("");
  const [highlights, setHighlights] = useState("");
  const [thingsToDo, setThingsToDo] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [sourceReferences, setSourceReferences] = useState("");
  const [tourIds, setTourIds] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [editorialStatus, setEditorialStatus] = useState("draft");
  const [editorialSourceNotes, setEditorialSourceNotes] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const imagePreview = useFilePreview(file, resolveMediaUrl(existingImage));

  function openNew() {
    setEditing(null);
    setName("");
    setDesc("");
    setArea("gondar"); setType("other"); setLocation(""); setAliases("");
    setHeroTitle(""); setHeroAccent(""); setOverview(""); setHighlights("");
    setThingsToDo(""); setImageAlt(""); setSourceReferences(""); setTourIds("");
    setIsPublished(true); setSortOrder("0");
    setEditorialStatus("draft"); setEditorialSourceNotes("");
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
      setArea(row.area || "gondar"); setType(row.type || "other"); setLocation(row.location || "");
      setAliases(lines(row.alsoKnownAs || [])); setHeroTitle(row.heroTitle || ""); setHeroAccent(row.heroAccent || "");
      setOverview(lines(row.overview || [])); setHighlights(lines(row.highlights || [])); setThingsToDo(lines(row.thingsToDo || []));
      setImageAlt(row.imageAlt || ""); setSourceReferences(lines(row.sourceReferences || []));
      setEditorialStatus(row.editorialStatus || (row.isPublished ? "published" : "draft")); setEditorialSourceNotes(row.editorialSourceNotes || "");
      setTourIds((row.tours || []).map((tour) => String(tour.id)).join(", ")); setIsPublished(row.isPublished !== false); setSortOrder(String(row.sortOrder || 0));
      setExistingImage(row.imageUrl || "");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to load destination");
      setEditing(d);
      setName(d.name);
      setDesc(d.description || "");
      setArea(d.area || "gondar"); setType(d.type || "other"); setLocation(d.location || "");
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
      fd.append("area", area); fd.append("type", type); fd.append("location", location);
      fd.append("alsoKnownAs", JSON.stringify(parseLines(aliases)));
      fd.append("heroTitle", heroTitle); fd.append("heroAccent", heroAccent);
      fd.append("overview", JSON.stringify(parseLines(overview)));
      fd.append("highlights", JSON.stringify(parseLines(highlights)));
      fd.append("thingsToDo", JSON.stringify(parseLines(thingsToDo)));
      fd.append("imageAlt", imageAlt); fd.append("sourceReferences", JSON.stringify(parseLines(sourceReferences)));
      fd.append("tourIds", JSON.stringify(tourIds.split(",").map((id) => Number(id.trim())).filter((id) => Number.isInteger(id) && id > 0)));
      fd.append("isPublished", String(isPublished)); fd.append("sortOrder", sortOrder);
      fd.append("editorialStatus", editorialStatus); fd.append("editorialSourceNotes", editorialSourceNotes);
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
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Area"><select value={area} onChange={(e) => setArea(e.target.value)}><option value="simien">Simien</option><option value="gondar">Gondar</option><option value="northern">Northern</option></select></AdminField>
                <AdminField label="Type"><select value={type} onChange={(e) => setType(e.target.value)}>{["park","gateway","camp","viewpoint","waterfall","heritage","rural","lake","extension","corridor","other"].map((value) => <option key={value} value={value}>{value}</option>)}</select></AdminField>
                <AdminField label="Location"><AdminInput value={location} onChange={(e) => setLocation(e.target.value)} /></AdminField>
                <AdminField label="Aliases (one per line)"><AdminTextarea value={aliases} rows={2} onChange={(e) => setAliases(e.target.value)} /></AdminField>
                <AdminField label="Hero title"><AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} /></AdminField>
                <AdminField label="Hero accent"><AdminInput value={heroAccent} onChange={(e) => setHeroAccent(e.target.value)} /></AdminField>
                <AdminField label="Overview (one paragraph per line)"><AdminTextarea value={overview} rows={4} onChange={(e) => setOverview(e.target.value)} /></AdminField>
                <AdminField label="Highlights (one per line)"><AdminTextarea value={highlights} rows={4} onChange={(e) => setHighlights(e.target.value)} /></AdminField>
                <AdminField label="Things to do (one per line)"><AdminTextarea value={thingsToDo} rows={4} onChange={(e) => setThingsToDo(e.target.value)} /></AdminField>
                <AdminField label="Source URLs (one per line)"><AdminTextarea value={sourceReferences} rows={3} onChange={(e) => setSourceReferences(e.target.value)} /></AdminField>
                <AdminField label="Editorial status"><select value={editorialStatus} onChange={(e) => setEditorialStatus(e.target.value)}><option value="draft">Draft</option><option value="reviewed">Reviewed</option><option value="published">Published</option></select></AdminField>
                <AdminField label="Private source/review notes"><AdminTextarea value={editorialSourceNotes} rows={2} onChange={(e) => setEditorialSourceNotes(e.target.value)} /></AdminField>
                <AdminField label="Related tour IDs (comma-separated)" hint="Use tour IDs from the Tours admin list."><AdminInput value={tourIds} onChange={(e) => setTourIds(e.target.value)} /></AdminField>
                <AdminField label="Sort order"><AdminInput type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} /></AdminField>
              </div>
              <AdminField label="Image alt text"><AdminInput value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} /></AdminField>
              <AdminField label="Visibility"><label><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> Published</label></AdminField>
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
          <AdminListTable headers={["Image", "Name", "Area", "Slug", "Description", "Tours", ""]}>
            {items.map((d) => (
              <AdminTableRow key={d.id} className="hover:bg-copper/3">
                <AdminTd>
                  {d.imageUrl && <img className={adminThumb} src={resolveMediaUrl(d.imageUrl)} alt={d.name} />}
                </AdminTd>
                <AdminTd className="font-semibold">{d.name}</AdminTd>
                <AdminTd>{d.area}</AdminTd>
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
