import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { slugify } from '../../utils/format';
import ImageUploader from './ImageUploader';
import Button from '../ui/Button';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="eyebrow mb-2 block">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
  </label>
);

const empty = { name: '', description: '', price: '', categoryId: '', images: [], sizes: [], colors: [], stock: 0, isNew: false, collectionIds: [] };

export default function ProductForm({ initial, categories, collections, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...empty, ...initial, price: initial?.price ?? '' }));
  const [sizeInput, setSizeInput] = useState('');
  const [color, setColor] = useState({ name: '', hex: '#0d0d0d' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k, v) => set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v]);

  const addSize = (s) => {
    const v = s.trim().toUpperCase();
    if (v && !form.sizes.includes(v)) set('sizes', [...form.sizes, v]);
    setSizeInput('');
  };
  const addColor = () => {
    if (!color.name.trim() || form.colors.some((c) => c.name.toLowerCase() === color.name.trim().toLowerCase())) return;
    set('colors', [...form.colors, { name: color.name.trim(), hex: color.hex, image: form.images[0] }]);
    setColor({ name: '', hex: '#0d0d0d' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const price = Number(form.price);
    if (!form.name.trim()) return setError('Product name is required.');
    if (!(price >= 0) || form.price === '') return setError('Enter a valid price.');
    if (Number(form.stock) < 0) return setError('Stock cannot be negative.');
    setSaving(true);
    try {
      await onSave({
        ...form, name: form.name.trim(), price, stock: Math.floor(Number(form.stock) || 0),
        slug: initial?.slug || slugify(form.name), categoryId: form.categoryId || null,
      });
    } catch (err) {
      setError(err.message || 'Could not save product.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name"><input className="field" value={form.name} onChange={(e) => set('name', e.target.value)} required /></Field>
        <Field label="Price (₦)"><input type="number" min="0" step="100" className="field" value={form.price} onChange={(e) => set('price', e.target.value)} required /></Field>
        <Field label="Category">
          <select className="field" value={form.categoryId || ''} onChange={(e) => set('categoryId', e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Stock quantity"><input type="number" min="0" className="field" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></Field>
      </div>

      <Field label="Description"><textarea rows={4} className="field" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>

      <Field label="Images" hint="First image is the main one. Upload several for the gallery.">
        <ImageUploader multiple value={form.images} onChange={(v) => set('images', v)} />
      </Field>

      <Field label="Sizes" hint="Leave empty for one-size items (e.g. caps, bags).">
        <div className="flex flex-wrap gap-2">
          {COMMON_SIZES.map((s) => (
            <button key={s} type="button" onClick={() => toggle('sizes', s)} className={`min-h-9 min-w-10 border px-2 text-xs ${form.sizes.includes(s) ? 'border-white bg-white text-ink' : 'border-line text-muted'}`}>{s}</button>
          ))}
          {form.sizes.filter((s) => !COMMON_SIZES.includes(s)).map((s) => (
            <button key={s} type="button" onClick={() => toggle('sizes', s)} className="flex min-h-9 items-center gap-1 border border-white bg-white px-2 text-xs text-ink">{s}<X className="h-3 w-3" /></button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input className="field !w-40" placeholder="Custom e.g. 32" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(sizeInput); } }} />
          <Button variant="ghost" onClick={() => addSize(sizeInput)} className="!px-4"><Plus className="h-4 w-4" /></Button>
        </div>
      </Field>

      <Field label="Colors">
        <div className="mb-2 flex flex-wrap gap-2">
          {form.colors.map((c) => (
            <span key={c.name} className="flex items-center gap-2 border border-line px-2 py-1 text-xs">
              <span className="h-4 w-4 border border-line" style={{ background: c.hex }} />{c.name}
              <button type="button" onClick={() => set('colors', form.colors.filter((x) => x.name !== c.name))} aria-label={`Remove ${c.name}`}><X className="h-3 w-3 text-muted hover:text-white" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="color" aria-label="Color swatch" value={color.hex} onChange={(e) => setColor({ ...color, hex: e.target.value })} className="h-12 w-14 cursor-pointer border border-line bg-surface p-1" />
          <input className="field" placeholder="Color name e.g. Black" value={color.name} onChange={(e) => setColor({ ...color, name: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} />
          <Button variant="ghost" onClick={addColor} className="!px-4"><Plus className="h-4 w-4" /></Button>
        </div>
      </Field>

      <Field label="Collections">
        <div className="flex flex-wrap gap-2">
          {collections.length === 0 && <span className="text-xs text-muted">No collections yet.</span>}
          {collections.map((c) => (
            <button key={c.id} type="button" onClick={() => toggle('collectionIds', c.id)} className={`min-h-9 border px-3 text-xs ${form.collectionIds.includes(c.id) ? 'border-white bg-white text-ink' : 'border-line text-muted'}`}>{c.name}</button>
          ))}
        </div>
      </Field>

      <label className="flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} className="h-5 w-5 accent-white" />
        <span className="text-sm">Mark as New Arrival</span>
      </label>

      {error && <p className="border border-red-900 bg-red-950/40 p-3 text-sm text-red-300" role="alert">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="min-h-12 bg-white px-8 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink hover:bg-accent disabled:opacity-50">{saving ? 'Saving…' : initial?.id ? 'Save changes' : 'Create product'}</button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

