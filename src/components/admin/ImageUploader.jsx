import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../services/api';

/** Upload one or many images. `value` is a string (single) or string[] (multiple). */
export default function ImageUploader({ value, onChange, multiple = false, folder = 'products', label = 'Upload image' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const list = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (files) => {
    setBusy(true); setError('');
    try {
      const urls = [];
      for (const f of Array.from(files)) urls.push(await uploadImage(f, folder));
      onChange(multiple ? [...list, ...urls] : urls[0]);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (i) => onChange(multiple ? list.filter((_, idx) => idx !== i) : '');

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {list.map((src, i) => (
          <div key={i} className="group relative h-28 w-24 overflow-hidden border border-line bg-card">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => remove(i)} aria-label="Remove image" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ink/80 hover:bg-white hover:text-ink"><X className="h-3.5 w-3.5" /></button>
            {multiple && i === 0 && <span className="absolute bottom-0 inset-x-0 bg-white py-0.5 text-center text-[0.55rem] uppercase tracking-widest text-ink">Main</span>}
          </div>
        ))}
        {(multiple || list.length === 0) && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="flex h-28 w-24 flex-col items-center justify-center gap-1 border border-dashed border-line text-xs text-muted hover:border-accent hover:text-white disabled:opacity-50">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            {busy ? 'Uploading' : label}
          </button>
        )}
      </div>
      {!multiple && list.length > 0 && (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="mt-2 text-xs uppercase tracking-widest text-muted underline hover:text-white">{busy ? 'Uploading…' : 'Replace image'}</button>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => e.target.files?.length && handleFiles(e.target.files)} />
      {error && <p className="mt-2 text-xs text-red-400" role="alert">{error}</p>}
    </div>
  );
}

