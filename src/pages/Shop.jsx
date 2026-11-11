import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import ProductGrid from '../components/product/ProductGrid';
import { EmptyState, ErrorState, ProductSkeletonGrid } from '../components/ui/States';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: 'u20', label: 'Under ₦20,000', min: 0, max: 20000 },
  { id: '20-40', label: '₦20,000 – ₦40,000', min: 20000, max: 40000 },
  { id: '40-60', label: '₦40,000 – ₦60,000', min: 40000, max: 60000 },
  { id: 'o60', label: 'Over ₦60,000', min: 60000, max: Infinity },
];

export default function Shop() {
  const { products, categories, loading, error, refresh } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('category') || 'all';
  const size = params.get('size') || '';
  const price = params.get('price') || 'all';
  const sort = params.get('sort') || 'newest';
  const q = params.get('q') || '';

  const setParam = (key, value, def = '') => {
    const next = new URLSearchParams(params);
    if (!value || value === def) next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  const allSizes = useMemo(() => {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const set = new Set(products.flatMap((p) => p.sizes));
    return [...set].sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return Number(a) - Number(b);
    });
  }, [products]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === price) || PRICE_RANGES[0];
    const cat = categories.find((c) => c.slug === category);
    const term = q.trim().toLowerCase();
    const list = products.filter((p) =>
      (category === 'all' || (cat && p.categoryId === cat.id)) &&
      (!size || p.sizes.includes(size)) &&
      p.price >= range.min && p.price <= range.max &&
      (!term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)));
    return list.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, categories, category, size, price, sort, q]);

  const activeCount = [category !== 'all', !!size, price !== 'all', !!q].filter(Boolean).length;
  const clearAll = () => setParams(sort !== 'newest' ? { sort } : {}, { replace: true });

  const pill = (active) => `min-h-10 border px-4 text-xs uppercase tracking-[0.15em] transition-colors ${active ? 'border-white bg-white text-ink' : 'border-line text-muted hover:border-accent hover:text-white'}`;

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={pill(category === 'all')} onClick={() => setParam('category', 'all', 'all')}>All</button>
          {categories.map((c) => <button key={c.id} type="button" className={pill(category === c.slug)} onClick={() => setParam('category', c.slug)}>{c.name}</button>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => <button key={s} type="button" className={`${pill(size === s)} !px-0 w-12`} onClick={() => setParam('size', size === s ? '' : s)}>{s}</button>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Price</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((r) => <button key={r.id} type="button" className={pill(price === r.id)} onClick={() => setParam('price', r.id, 'all')}>{r.label}</button>)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-x pb-10 pt-32 md:pt-40">
      <header className="mb-10 md:mb-14">
        <p className="eyebrow mb-3">The catalog</p>
        <h1 className="display text-6xl md:text-9xl">Shop</h1>
      </header>

      <div className="mb-8 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
        <label className="flex flex-1 items-center gap-3 md:max-w-sm">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted" />
        </label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} className="flex min-h-11 items-center gap-2 border border-line px-4 text-xs uppercase tracking-[0.18em] hover:border-accent">
            <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount > 0 && ` (${activeCount})`}
          </button>
          <select value={sort} onChange={(e) => setParam('sort', e.target.value, 'newest')} aria-label="Sort products" className="field !w-auto !py-3 !text-xs !uppercase !tracking-wider">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
            <div className="mb-10 border border-line bg-surface p-5 md:p-8">{filterPanel}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {category !== 'all' && <Chip onRemove={() => setParam('category', '')}>{categories.find((c) => c.slug === category)?.name || category}</Chip>}
          {size && <Chip onRemove={() => setParam('size', '')}>Size {size}</Chip>}
          {price !== 'all' && <Chip onRemove={() => setParam('price', '')}>{PRICE_RANGES.find((r) => r.id === price)?.label}</Chip>}
          {q && <Chip onRemove={() => setParam('q', '')}>“{q}”</Chip>}
          <button type="button" onClick={clearAll} className="ml-2 text-xs uppercase tracking-widest text-muted underline hover:text-white">Clear all</button>
        </div>
      )}

      <p className="mb-6 text-xs uppercase tracking-[0.2em] text-muted">{loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}</p>

      {error ? <ErrorState message={error} onRetry={refresh} />
        : loading ? <ProductSkeletonGrid />
        : filtered.length === 0 ? <EmptyState title="No products found" message="Try adjusting or clearing your filters." actionLabel="Clear filters" onAction={clearAll} />
        : <ProductGrid products={filtered} />}
    </div>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-xs">
      {children}
      <button type="button" onClick={onRemove} aria-label="Remove filter" className="text-muted hover:text-white"><X className="h-3 w-3" /></button>
    </span>
  );
}
