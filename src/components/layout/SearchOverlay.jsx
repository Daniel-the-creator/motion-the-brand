import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/format';
import SafeImage from '../ui/SafeImage';

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const { products } = useCatalog();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) { setQ(''); return undefined; }
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e) => e.key === 'Escape' && closeSearch();
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [searchOpen, closeSearch]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)).slice(0, 6);
  }, [q, products]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div role="dialog" aria-modal="true" aria-label="Search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-ink/95 backdrop-blur-md">
          <div className="container-x pt-6 md:pt-10">
            <div className="flex justify-end">
              <button type="button" onClick={closeSearch} aria-label="Close search" className="flex h-11 w-11 items-center justify-center hover:text-accent"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-6 max-w-3xl">
              <label className="flex items-center gap-4 border-b border-line pb-4 focus-within:border-white">
                <Search className="h-6 w-6 shrink-0 text-muted" />
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search MOTION" className="display w-full bg-transparent text-3xl outline-none placeholder:text-line md:text-5xl" />
              </label>

              <div className="mt-8 pb-16">
                {q && results.length === 0 && <p className="text-muted">No products match “{q}”.</p>}
                <ul className="divide-y divide-line">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.slug}`} onClick={closeSearch} className="flex items-center gap-4 py-3 transition-colors hover:bg-surface">
                        <SafeImage src={p.images[0]} alt="" label={p.name} className="h-20 w-16 object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium uppercase">{p.name}</p>
                          <p className="text-sm text-muted">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {q && (
                  <Link to={`/shop?q=${encodeURIComponent(q)}`} onClick={closeSearch} className="mt-6 inline-block border-b border-white/40 pb-1 text-xs uppercase tracking-[0.22em] hover:border-white">
                    View all results in shop
                  </Link>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

