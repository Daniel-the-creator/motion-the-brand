import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import ImageUploader from './ImageUploader';
import { Field } from './ProductForm';
import Button from '../ui/Button';

const blank = { name: '', description: '', coverImage: '' };

export default function CollectionsTab() {
  const { collections, products, saveCollection, deleteCollection, saveProduct } = useCatalog();
  const { toast } = useUI();
  const [editing, setEditing] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [saving, setSaving] = useState(false);

  const open = (c) => {
    const col = c || blank;
    setEditing(col);
    setAssigned(c ? products.filter((p) => p.collectionIds.includes(c.id)).map((p) => p.id) : []);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!editing.name.trim()) return toast('Name is required');
    setSaving(true);
    try {
      const col = await saveCollection({ ...editing, name: editing.name.trim(), sortOrder: editing.sortOrder ?? collections.length + 1 });
      // sync product assignments
      const changes = products.filter((p) => {
        const has = p.collectionIds.includes(col.id);
        const want = assigned.includes(p.id);
        return has !== want;
      });
      for (const p of changes) {
        const ids = assigned.includes(p.id) ? [...p.collectionIds, col.id] : p.collectionIds.filter((x) => x !== col.id);
        await saveProduct({ ...p, collectionIds: ids });
      }
      toast('Collection saved');
      setEditing(null);
    } catch (err) { toast(err.message); } finally { setSaving(false); }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete collection "${c.name}"? Products are kept.`)) return;
    try { await deleteCollection(c.id); toast('Collection deleted'); } catch (e) { toast(e.message); }
  };

  if (editing) {
    return (
      <form onSubmit={save} className="max-w-3xl space-y-6">
        <h2 className="display text-3xl">{editing.id ? 'Edit collection' : 'New collection'}</h2>
        <Field label="Name"><input className="field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
        <Field label="Description"><textarea rows={3} className="field" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
        <Field label="Cover image"><ImageUploader folder="collections" value={editing.coverImage} onChange={(v) => setEditing({ ...editing, coverImage: v })} /></Field>
        <Field label={`Assign products (${assigned.length})`}>
          <div className="grid max-h-72 gap-px overflow-y-auto border border-line bg-line sm:grid-cols-2">
            {products.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 bg-surface p-3 text-sm hover:bg-card">
                <input type="checkbox" className="h-4 w-4 accent-white" checked={assigned.includes(p.id)} onChange={() => setAssigned((a) => (a.includes(p.id) ? a.filter((x) => x !== p.id) : [...a, p.id]))} />
                {p.name}
              </label>
            ))}
          </div>
        </Field>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="min-h-12 bg-white px-8 text-[0.72rem] uppercase tracking-[0.22em] text-ink disabled:opacity-50">{saving ? 'Saving…' : 'Save collection'}</button>
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end"><Button onClick={() => open(null)}><Plus className="h-4 w-4" /> New collection</Button></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="border border-line bg-surface">
            <img src={c.coverImage} alt="" className="aspect-video w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium uppercase">{c.name}</p>
                <p className="text-xs text-muted">{products.filter((p) => p.collectionIds.includes(c.id)).length} products</p>
              </div>
              <div className="flex">
                <button type="button" onClick={() => open(c)} aria-label={`Edit ${c.name}`} className="flex h-10 w-10 items-center justify-center hover:text-accent"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(c)} aria-label={`Delete ${c.name}`} className="flex h-10 w-10 items-center justify-center text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {collections.length === 0 && <p className="py-16 text-center text-muted">No collections yet.</p>}
    </div>
  );
}

