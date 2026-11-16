import { useState } from 'react';
import { Check, ImagePlus, Loader2, Plus, X } from 'lucide-react';
import { resolveColorImage, slugify } from '../../utils/format';
import { uploadImage } from '../../services/api';
import ImageUploader from './ImageUploader';
import Button from '../ui/Button';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRESET_COLORS = [
  { name: 'Black', hex: '#0d0d0d' },
  { name: 'White', hex: '#eeeeee' },
  { name: 'Red', hex: '#c81e1e' },
  { name: 'Burgundy', hex: '#5e111a' },
  { name: 'Purple', hex: '#2a1170' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Navy', hex: '#172554' },
  { name: 'Cream', hex: '#f5f0e6' },
];

export const Field = ({ label, hint, children }) => (
  <div className="block">
    <span className="eyebrow mb-2 block">{label}</span>
    {children}
    {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
  </div>
);

const empty = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  images: [],
  sizes: [],
  colors: [],
  stock: 0,
  isNew: false,
  collectionIds: [],
};

export default function ProductForm({ initial, categories, collections, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    const base = { ...empty, ...initial, price: initial?.price ?? '' };
    // Normalize any existing colors that all pointed to images[0] so each color defaults to its matching image index
    if (base.colors?.length > 1 && base.images?.length > 1) {
      const allSame = base.colors.every((c) => !c.image || c.image === base.images[0]);
      if (allSame) {
        base.colors = base.colors.map((c, idx) => ({
          ...c,
          image: base.images[idx] || base.images[0] || '',
        }));
      }
    }
    return base;
  });
  const [sizeInput, setSizeInput] = useState('');
  const [color, setColor] = useState({ name: '', hex: '#0d0d0d', image: '' });
  const [uploadingColorIdx, setUploadingColorIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k, v) =>
    set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v]);

  const handleImagesChange = (newImages) => {
    setForm((f) => {
      // Auto-assign newly uploaded images to colors that don't have a distinct image yet
      const allSame =
        f.colors.length > 0 &&
        f.colors.every((c) => !c.image || c.image === f.images[0]);
      const updatedColors = f.colors.map((c, idx) => {
        if (!c.image || (allSame && newImages[idx])) {
          return { ...c, image: newImages[idx] || newImages[0] || '' };
        }
        return c;
      });
      return { ...f, images: newImages, colors: updatedColors };
    });
  };

  const addSize = (s) => {
    const v = s.trim().toUpperCase();
    if (v && !form.sizes.includes(v)) set('sizes', [...form.sizes, v]);
    setSizeInput('');
  };

  const addColorObj = (name, hex, customImg) => {
    const cleanName = name.trim();
    if (!cleanName || form.colors.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      return;
    }
    const nextIdx = form.colors.length;
    const assignedImage = customImg || color.image || form.images[nextIdx] || form.images[0] || '';
    set('colors', [
      ...form.colors,
      { name: cleanName, hex, image: assignedImage },
    ]);
    setColor({ name: '', hex: '#0d0d0d', image: '' });
  };

  const addColor = () => addColorObj(color.name, color.hex, color.image);

  const setColorImage = (colorName, imgUrl) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.map((c) => (c.name === colorName ? { ...c, image: imgUrl } : c)),
    }));
  };

  const handleUploadColorSpecificImage = async (colorName, file, idx) => {
    if (!file) return;
    setUploadingColorIdx(idx);
    setError('');
    try {
      const url = await uploadImage(file, 'products');
      setForm((f) => ({
        ...f,
        images: f.images.includes(url) ? f.images : [...f.images, url],
        colors: f.colors.map((c) => (c.name === colorName ? { ...c, image: url } : c)),
      }));
    } catch (err) {
      setError(err.message || 'Could not upload color image.');
    } finally {
      setUploadingColorIdx(null);
    }
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
      const normalizedColors = form.colors.map((c, idx) => ({
        ...c,
        image: resolveColorImage(form, c, idx),
      }));
      await onSave({
        ...form,
        name: form.name.trim(),
        price,
        stock: Math.floor(Number(form.stock) || 0),
        slug: initial?.slug || slugify(form.name),
        categoryId: form.categoryId || null,
        colors: normalizedColors,
      });
    } catch (err) {
      setError(err.message || 'Could not save product.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name">
          <input
            className="field"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </Field>
        <Field label="Price (₦)">
          <input
            type="number"
            min="0"
            step="100"
            className="field"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            required
          />
        </Field>
        <Field label="Category">
          <select
            className="field"
            value={form.categoryId || ''}
            onChange={(e) => set('categoryId', e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stock quantity">
          <input
            type="number"
            min="0"
            className="field"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          rows={4}
          className="field"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </Field>

      <Field
        label="Images"
        hint="First image is the main cover. Upload photos for each color or angle — you can link each color to its matching photo below."
      >
        <ImageUploader multiple value={form.images} onChange={handleImagesChange} />
      </Field>

      <Field label="Sizes" hint="Leave empty for one-size items (e.g. caps, bags).">
        <div className="flex flex-wrap gap-2">
          {COMMON_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle('sizes', s)}
              className={`min-h-9 min-w-10 border px-2 text-xs ${
                form.sizes.includes(s) ? 'border-white bg-white text-ink' : 'border-line text-muted'
              }`}
            >
              {s}
            </button>
          ))}
          {form.sizes
            .filter((s) => !COMMON_SIZES.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle('sizes', s)}
                className="flex min-h-9 items-center gap-1 border border-white bg-white px-2 text-xs text-ink"
              >
                {s}
                <X className="h-3 w-3" />
              </button>
            ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="field !w-40"
            placeholder="Custom e.g. 32"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSize(sizeInput);
              }
            }}
          />
          <Button variant="ghost" onClick={() => addSize(sizeInput)} className="!px-4">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Field>

      <Field
        label="Colors & Linked Color Photos"
        hint="Add each colorway and click the thumbnail that shows that color (or upload a photo directly on the color row) so clicking the color swatch switches the product photo."
      >
        {/* Quick Color Presets */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-widest text-muted">Quick add:</span>
          {PRESET_COLORS.map((preset) => {
            const exists = form.colors.some(
              (c) => c.name.toLowerCase() === preset.name.toLowerCase(),
            );
            return (
              <button
                key={preset.name}
                type="button"
                disabled={exists}
                onClick={() => addColorObj(preset.name, preset.hex)}
                className="inline-flex items-center gap-1.5 border border-line bg-surface px-2.5 py-1 text-xs text-accent transition hover:border-white hover:text-white disabled:opacity-35"
              >
                <span className="h-3 w-3 border border-line" style={{ background: preset.hex }} />
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Added Colors with Image Assignment */}
        {form.colors.length > 0 && (
          <div className="mb-4 space-y-3">
            {form.colors.map((c, idx) => {
              const linkedImg = c.image || form.images[idx] || form.images[0] || '';
              return (
                <div
                  key={c.name}
                  className="flex flex-col gap-3 border border-line bg-ink/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-7 w-7 shrink-0 border border-line"
                      style={{ background: c.hex }}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white">
                        {c.name}
                      </p>
                      <p className="text-[0.65rem] text-muted">
                        {linkedImg ? 'Linked to photo →' : 'Upload or select a photo for this color'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {form.images.map((imgSrc, imgIdx) => {
                      const isSelected = linkedImg === imgSrc;
                      return (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => setColorImage(c.name, imgSrc)}
                          title={`Use photo #${imgIdx + 1} for ${c.name}`}
                          className={`relative h-12 w-10 overflow-hidden border bg-white transition ${
                            isSelected
                              ? 'border-white ring-2 ring-white'
                              : 'border-line opacity-55 hover:opacity-100'
                          }`}
                        >
                          <img src={imgSrc} alt="" className="h-full w-full object-contain" />
                          {isSelected && (
                            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center bg-ink text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Direct upload button for this specific color */}
                    <label
                      title={`Upload new photo for ${c.name}`}
                      className="flex h-12 cursor-pointer items-center gap-1.5 border border-dashed border-line px-2.5 text-[0.65rem] uppercase tracking-wider text-muted hover:border-white hover:text-white"
                    >
                      {uploadingColorIdx === idx ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3.5 w-3.5" />
                      )}
                      <span>Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleUploadColorSpecificImage(c.name, e.target.files[0], idx)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'colors',
                          form.colors.filter((x) => x.name !== c.name),
                        )
                      }
                      aria-label={`Remove ${c.name}`}
                      className="ml-1 flex h-8 w-8 items-center justify-center border border-line text-muted hover:border-red-500 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Color Input */}
        <div className="flex gap-2">
          <input
            type="color"
            aria-label="Color swatch"
            value={color.hex}
            onChange={(e) => setColor({ ...color, hex: e.target.value })}
            className="h-12 w-14 shrink-0 cursor-pointer border border-line bg-surface p-1"
          />
          <input
            className="field"
            placeholder="Custom color name (e.g. Olive)"
            value={color.name}
            onChange={(e) => setColor({ ...color, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addColor();
              }
            }}
          />
          <Button variant="ghost" onClick={addColor} className="!px-4">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Field>

      <Field label="Collections">
        <div className="flex flex-wrap gap-2">
          {collections.length === 0 && (
            <span className="text-xs text-muted">No collections yet.</span>
          )}
          {collections.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle('collectionIds', c.id)}
              className={`min-h-9 border px-3 text-xs ${
                form.collectionIds.includes(c.id)
                  ? 'border-white bg-white text-ink'
                  : 'border-line text-muted'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Field>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.isNew}
          onChange={(e) => set('isNew', e.target.checked)}
          className="h-5 w-5 accent-white"
        />
        <span className="text-sm">Mark as New Arrival</span>
      </label>

      {error && (
        <p className="border border-red-900 bg-red-950/40 p-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="min-h-12 bg-white px-8 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink hover:bg-accent disabled:opacity-50"
        >
          {saving ? 'Saving…' : initial?.id ? 'Save changes' : 'Create product'}
        </button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
