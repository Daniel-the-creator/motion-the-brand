import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus, Ruler } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCatalog } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { SITE } from '../config/site';
import { formatPrice } from '../utils/format';
import SafeImage from '../components/ui/SafeImage';
import Button from '../components/ui/Button';
import { EmptyState, Spinner } from '../components/ui/States';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/ui/SectionHeading';

export default function ProductDetails() {
  const { slug } = useParams();
  const { products, categories, loading } = useCatalog();
  const { addItem } = useCart();
  const { openSizeGuide, toast } = useUI();

  const product = products.find((p) => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => { setActiveImg(0); setSize(null); setColor(null); setQuantity(1); setShowErrors(false); }, [slug]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.collectionIds.some((c) => product.collectionIds.includes(c))))
      .slice(0, 4);
  }, [products, product]);

  if (loading) return <div className="pt-32"><Spinner /></div>;
  if (!product) return <div className="pt-32"><EmptyState title="Product not found" message="This piece may have been removed." actionLabel="Back to shop" actionTo="/shop" /></div>;

  const category = categories.find((c) => c.id === product.categoryId);
  const soldOut = product.stock <= 0;
  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const sizeMissing = needsSize && !size;
  const colorMissing = needsColor && !color;
  const lowStock = !soldOut && product.stock <= SITE.lowStockThreshold;
  const images = product.images.length ? product.images : [''];

  const handleAdd = () => {
    if (sizeMissing || colorMissing) { setShowErrors(true); return; }
    addItem(product, { size, color, quantity });
  };

  return (
    <div className="container-x pb-10 pt-28 md:pt-36">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.18em] text-muted">
        <Link to="/shop" className="hover:text-white">Shop</Link>
        {category && <> <span className="mx-2">/</span> <Link to={`/shop?category=${category.slug}`} className="hover:text-white">{category.name}</Link></>}
      </nav>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            {images.length > 1 && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto md:w-20 md:shrink-0 md:flex-col md:overflow-visible">
                {images.map((src, i) => (
                  <button key={i} type="button" onClick={() => setActiveImg(i)} aria-label={`View image ${i + 1}`}
                    className={`aspect-[4/5] w-16 shrink-0 overflow-hidden border bg-white md:w-full ${i === activeImg ? 'border-white ring-1 ring-white' : 'border-line opacity-60 hover:opacity-100'}`}>
                    <SafeImage src={src} alt="" label={product.name} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-white">
              <AnimatePresence mode="wait">
                <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="h-full w-full">
                  <SafeImage src={images[activeImg]} alt={product.name} label={product.name} loading="eager" className="h-full w-full object-contain" />
                </motion.div>
              </AnimatePresence>
              {product.isNew && !soldOut && <span className="absolute left-3 top-3 bg-white px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ink">New Arrival</span>}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <h1 className="display text-4xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-accent">{formatPrice(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>

          {needsColor && (
            <div className="mt-8">
              <p className="eyebrow mb-3 !text-white">Color {color && <span className="text-muted">— {color}</span>}</p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button key={c.name} type="button" onClick={() => { setColor(c.name); const i = c.image ? product.images.indexOf(c.image) : -1; if (i >= 0) setActiveImg(i); }} aria-label={c.name} aria-pressed={color === c.name} title={c.name}
                    className={`h-11 w-11 border transition ${color === c.name ? 'border-white ring-1 ring-white ring-offset-2 ring-offset-ink' : 'border-line hover:border-accent'}`}
                    style={{ background: c.hex }} />
                ))}
              </div>
              {showErrors && colorMissing && <p className="mt-2 text-xs text-red-400" role="alert">Please select a color.</p>}
            </div>
          )}

          {needsSize && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow !text-white">Size {size && <span className="text-muted">— {size}</span>}</p>
                <button type="button" onClick={openSizeGuide} className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted underline hover:text-white"><Ruler className="h-3.5 w-3.5" /> Size guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s}
                    className={`min-h-11 min-w-12 border px-3 text-sm transition-colors ${size === s ? 'border-white bg-white text-ink' : 'border-line hover:border-accent'}`}>{s}</button>
                ))}
              </div>
              {showErrors && sizeMissing && <p className="mt-2 text-xs text-red-400" role="alert">Please select a size.</p>}
            </div>
          )}

          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="eyebrow mb-3 !text-white">Quantity</p>
              <div className="flex items-center border border-line">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center hover:bg-card"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center" aria-live="polite">{quantity}</span>
                <button type="button" aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="flex h-12 w-12 items-center justify-center hover:bg-card disabled:opacity-30"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
            <p className={`mt-7 text-xs uppercase tracking-[0.18em] ${soldOut ? 'text-red-400' : lowStock ? 'text-accent' : 'text-muted'}`}>
              {soldOut ? 'Sold out' : lowStock ? `Only ${product.stock} left` : 'In stock'}
            </p>
          </div>

          <Button onClick={handleAdd} disabled={soldOut} className="mt-8 w-full">{soldOut ? 'Sold out' : 'Add to bag'}</Button>
          <p className="mt-4 text-xs text-muted">Order through WhatsApp from your bag. We confirm availability and payment details with you directly.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-24 md:pt-32">
          <SectionHeading eyebrow="You may also like" title="Related" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

