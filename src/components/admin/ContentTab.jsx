import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import ImageUploader from './ImageUploader';
import { Field } from './ProductForm';

/** Generic editor section: saves one content key (hero / promo / about). */
function Section({ title, contentKey, children, initial }) {
  const { saveContent } = useCatalog();
  const { toast } = useUI();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await saveContent(contentKey, data); toast(`${title} saved`); } catch (err) { toast(err.message); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} className="space-y-5 border border-line bg-surface p-5 md:p-8">
      <h2 className="display text-2xl">{title}</h2>
      {children(data, (k, v) => setData((d) => ({ ...d, [k]: v })))}
      <button type="submit" disabled={saving} className="min-h-12 bg-white px-8 text-[0.72rem] uppercase tracking-[0.22em] text-ink disabled:opacity-50">{saving ? 'Saving…' : `Save ${title.toLowerCase()}`}</button>
    </form>
  );
}

const Input = ({ label, value, onChange, rows }) => (
  <Field label={label}>
    {rows ? <textarea rows={rows} className="field" value={value || ''} onChange={(e) => onChange(e.target.value)} /> : <input className="field" value={value || ''} onChange={(e) => onChange(e.target.value)} />}
  </Field>
);

export default function ContentTab() {
  const { content } = useCatalog();
  return (
    <div className="grid max-w-4xl gap-8">
      <Section title="Hero Banner" contentKey="hero" initial={content.hero}>
        {(d, set) => (
          <>
            <Field label="Hero image (wide, landscape works best)"><ImageUploader folder="site" value={d.image} onChange={(v) => set('image', v)} /></Field>
            <Input label="Eyebrow text" value={d.eyebrow} onChange={(v) => set('eyebrow', v)} />
            <Input label="Headline" value={d.headline} onChange={(v) => set('headline', v)} />
            <Input label="Supporting text" value={d.subtext} onChange={(v) => set('subtext', v)} />
          </>
        )}
      </Section>

      <Section title="Promo Banner" contentKey="promo" initial={content.promo}>
        {(d, set) => (
          <>
            <label className="flex items-center gap-3"><input type="checkbox" className="h-5 w-5 accent-white" checked={!!d.enabled} onChange={(e) => set('enabled', e.target.checked)} /> <span className="text-sm">Show banner on homepage</span></label>
            <Field label="Banner image"><ImageUploader folder="site" value={d.image} onChange={(v) => set('image', v)} /></Field>
            <Input label="Small text" value={d.text} onChange={(v) => set('text', v)} />
            <Input label="Title" value={d.title} onChange={(v) => set('title', v)} />
            <Input label="Description" value={d.description} onChange={(v) => set('description', v)} />
            <Input label="Button label" value={d.linkLabel} onChange={(v) => set('linkLabel', v)} />
            <Input label="Button link (e.g. /shop or https://…)" value={d.linkUrl} onChange={(v) => set('linkUrl', v)} />
          </>
        )}
      </Section>

      <Section title="About Page" contentKey="about" initial={content.about}>
        {(d, set) => (
          <>
            <Input label="Headline" value={d.headline} onChange={(v) => set('headline', v)} />
            <Input label="Brand story (blank line = new paragraph)" rows={6} value={d.story} onChange={(v) => set('story', v)} />
            <Input label="Brand philosophy" rows={3} value={d.philosophy} onChange={(v) => set('philosophy', v)} />
            <Input label="What MOTION represents" rows={3} value={d.represents} onChange={(v) => set('represents', v)} />
            <Field label="Campaign images"><ImageUploader multiple folder="site" value={d.images} onChange={(v) => set('images', v)} /></Field>
          </>
        )}
      </Section>
    </div>
  );
}

