import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import Button from '../ui/Button';

export default function CategoriesTab() {
  const { categories, products, saveCategory, deleteCategory } = useCatalog();
  const { toast } = useUI();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn, msg) => {
    setBusy(true);
    try { await fn(); toast(msg); } catch (e) { toast(e.message || 'Something went wrong'); } finally { setBusy(false); }
  };

  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    run(async () => { await saveCategory({ name: name.trim(), sortOrder: categories.length + 1 }); setName(''); }, 'Category added');
  };
  const rename = () => {
    if (!editing?.name.trim()) return;
    run(async () => { await saveCategory({ ...editing, name: editing.name.trim() }); setEditing(null); }, 'Category updated');
  };
  const remove = (c) => {
    const n = products.filter((p) => p.categoryId === c.id).length;
    if (!window.confirm(`Delete "${c.name}"?${n ? ` ${n} product(s) will become uncategorized.` : ''}`)) return;
    run(() => deleteCategory(c.id), 'Category deleted');
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={add} className="mb-6 flex gap-2">
        <input className="field" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={busy} className="flex min-h-12 items-center gap-2 bg-white px-5 text-xs uppercase tracking-widest text-ink disabled:opacity-50"><Plus className="h-4 w-4" /> Add</button>
      </form>
      <ul className="divide-y divide-line border border-line bg-surface">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-3 p-3">
            {editing?.id === c.id ? (
              <>
                <input className="field" autoFocus value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && rename()} />
                <Button onClick={rename} className="!px-4">Save</Button>
                <Button variant="ghost" onClick={() => setEditing(null)} className="!px-4">Cancel</Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{c.name} <span className="text-muted">({products.filter((p) => p.categoryId === c.id).length})</span></span>
                <button type="button" onClick={() => setEditing(c)} aria-label={`Rename ${c.name}`} className="flex h-10 w-10 items-center justify-center hover:text-accent"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(c)} aria-label={`Delete ${c.name}`} className="flex h-10 w-10 items-center justify-center text-red-400"><Trash2 className="h-4 w-4" /></button>
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && <li className="p-6 text-center text-sm text-muted">No categories yet.</li>}
      </ul>
    </div>
  );
}

