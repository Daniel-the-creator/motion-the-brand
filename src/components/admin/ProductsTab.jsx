import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import { formatPrice } from '../../utils/format';
import ProductForm from './ProductForm';
import Button from '../ui/Button';

export default function ProductsTab() {
  const { products, categories, collections, saveProduct, deleteProduct } = useCatalog();
  const { toast } = useUI();
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [q, setQ] = useState('');

  if (editing) {
    return (
      <div className="max-w-3xl">
        <h2 className="display mb-8 text-3xl">{editing === 'new' ? 'New product' : `Edit — ${editing.name}`}</h2>
        <ProductForm
          initial={editing === 'new' ? null : editing}
          categories={categories} collections={collections}
          onCancel={() => setEditing(null)}
          onSave={async (p) => { await saveProduct(p); toast('Product saved'); setEditing(null); }}
        />
      </div>
    );
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try { await deleteProduct(p.id); toast('Product deleted'); } catch (e) { toast(e.message); }
  };
  const quickStock = async (p, stock) => {
    try { await saveProduct({ ...p, stock: Math.max(0, stock) }); } catch (e) { toast(e.message); }
  };

  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <input className="field !w-full sm:!w-72" placeholder="Filter products" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Add product</Button>
      </div>
      {list.length === 0 ? <p className="py-16 text-center text-muted">No products. Add your first one.</p> : (
        <ul className="divide-y divide-line border border-line">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 bg-surface p-3">
              <img src={p.images[0]} alt="" className="h-20 w-16 shrink-0 object-cover" />
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate text-sm font-medium uppercase">{p.name} {p.isNew && <span className="ml-1 bg-white px-1.5 py-0.5 text-[0.55rem] text-ink">NEW</span>}</p>
                <p className="text-sm text-muted">{formatPrice(p.price)} · {categories.find((c) => c.id === p.categoryId)?.name || 'Uncategorized'}</p>
              </div>
              <div className="flex items-center border border-line text-sm">
                <button type="button" aria-label="Decrease stock" onClick={() => quickStock(p, p.stock - 1)} className="h-10 w-9 hover:bg-card">−</button>
                <span className={`w-12 text-center ${p.stock === 0 ? 'text-red-400' : ''}`} title="Stock">{p.stock}</span>
                <button type="button" aria-label="Increase stock" onClick={() => quickStock(p, p.stock + 1)} className="h-10 w-9 hover:bg-card">+</button>
              </div>
              <button type="button" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="flex h-11 w-11 items-center justify-center border border-line hover:border-accent"><Pencil className="h-4 w-4" /></button>
              <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.name}`} className="flex h-11 w-11 items-center justify-center border border-line text-red-400 hover:border-red-900"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

