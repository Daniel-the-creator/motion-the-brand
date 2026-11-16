import { useId, useState } from 'react';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { uploadImage } from '../../services/api';

/** Upload one or many images. `value` is a string (single) or string[] (multiple). */
export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = 'products',
  label = 'Upload image',
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const list = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const urls = [];
      for (const f of Array.from(files)) {
        urls.push(await uploadImage(f, folder));
      }
      onChange(multiple ? [...list, ...urls] : urls[0]);
    } catch (e) {
      setError(e.message || 'Could not upload image.');
    } finally {
      setBusy(false);
    }
  };

  const remove = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(multiple ? list.filter((_, idx) => idx !== i) : '');
  };

  const setAsMain = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    if (!multiple || i === 0) return;
    const next = [...list];
    const [picked] = next.splice(i, 1);
    next.unshift(picked);
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {list.map((src, i) => (
          <div
            key={`${i}-${src?.slice(-24) || i}`}
            className="group relative h-28 w-24 overflow-hidden border border-line bg-white"
          >
            <img src={src} alt="" className="h-full w-full object-contain p-1" />
            <button
              type="button"
              onClick={(e) => remove(e, i)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ink/85 text-white hover:bg-red-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {multiple && i === 0 && (
              <span className=" inset-x-0 absolute bottom-0 bg-ink py-0.5 text-center text-[0.55rem] font-medium uppercase tracking-widest text-white">
                Main (#1)
              </span>
            )}
            {multiple && i > 0 && (
              <button
                type="button"
                onClick={(e) => setAsMain(e, i)}
                title="Set as main image"
                className=" inset-x-0 absolute bottom-0 flex items-center justify-center gap-1 bg-ink/80 py-0.5 text-[0.52rem] uppercase tracking-wider text-accent opacity-0 transition group-hover:opacity-100 hover:bg-ink hover:text-white"
              >
                <Star className="h-2.5 w-2.5" /> Set Main
              </button>
            )}
          </div>
        ))}

        {(multiple || list.length === 0) && (
          <label
            htmlFor={inputId}
            className={`flex h-28 w-24 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-line text-xs text-muted transition hover:border-accent hover:text-white ${
              busy ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span>{busy ? 'Uploading' : label}</span>
          </label>
        )}
      </div>

      {!multiple && list.length > 0 && (
        <label
          htmlFor={inputId}
          className="mt-2 inline-block cursor-pointer text-xs uppercase tracking-widest text-muted underline hover:text-white"
        >
          {busy ? 'Uploading…' : 'Replace image'}
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />
      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
