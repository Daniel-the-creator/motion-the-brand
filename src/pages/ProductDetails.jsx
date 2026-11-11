import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Maximize2, MessageCircle, Minus, Plus, Ruler, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCatalog } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { SITE } from '../config/site';
import { formatPrice } from '../utils/format';
import { checkoutViaWhatsApp } from '../utils/whatsapp';
import SafeImage from '../components/ui/SafeImage';
import Button from '../components/ui/Button';
import { EmptyState, Spinner } from '../components/ui/States';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/ui/SectionHeading';

const ACCORDION_ITEMS = [
  {
    id: 'fabric',
    title: 'Fabric & Fit Specifications',
    body: '280gsm heavyweight combed cotton. Engineered with a relaxed boxy silhouette, dropped shoulders, and a high-density ribbed collar that holds its shape wear after wear.',
  },
  {
    id: 'care',
    title: 'Garment Care',
    body: 'Machine wash cold inside-out with like colors. Do not bleach. Hang dry in shade to preserve the screen-print and emblem integrity. Do not iron directly on graphics.',
  },
  {
    id: 'shipping',
    title: 'WhatsApp Ordering & Dispatch',
    body: 'Orders are sent directly to our WhatsApp concierge (0704 567 8882) for instant stock verification, delivery calculation, and direct payment details. Lagos delivery: 1–3 working days; nationwide: 3–7 working days.',
  },
];

export default function ProductDetails() {
  const { slug } = useParams();
  const { products, categories, loading } = useCatalog();
  const { addItem } = useCart();
  const { openSizeGuide } = useUI();

  const product = products.find((p) => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState('fabric');

  useEffect(() => {
    setActiveImg(0);
    setSize(product?.sizes?.length === 1 ? product.sizes[0] : null);
    setColor(product?.colors?.length === 1 ? product.colors[0].name : null);
    setQuantity(1);
    setShowErrors(false);
    setZoomOpen(false);
  }, [slug, product]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.categoryId === product.categoryId ||
            p.collectionIds.some((c) => product.collectionIds.includes(c))),
      )
      .slice(0, 4);
  }, [products, product]);

  if (loading) return <div className="pt-32"><Spinner /></div>;
  if (!product) {
    return (
      <div className="pt-32">
        <EmptyState
          title="Product not found"
          message="This piece may have been removed."
          actionLabel="Back to shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const soldOut = product.stock <= 0;
  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const sizeMissing = needsSize && !size;
  const colorMissing = needsColor && !color;
  const lowStock = !soldOut && product.stock <= SITE.lowStockThreshold;
  const images = product.images.length ? product.images : [''];

  const handleAdd = () => {
    if (sizeMissing || colorMissing) {
      setShowErrors(true);
      return;
    }
    addItem(product, { size, color, quantity });
  };

  const handleInstantWhatsApp = () => {
    if (sizeMissing || colorMissing) {
      setShowErrors(true);
      return;
    }
    checkoutViaWhatsApp([
      {
        name: product.name,
        size,
        color,
        quantity,
        price: product.price,
      },
    ]);
  };

  return (
    <div className="container-x pb-10 pt-28 md:pt-36">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.18em] text-muted">
        <Link to="/shop" className="hover:text-white">Shop</Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/shop?category=${category.slug}`} className="hover:text-white">
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            {images.length > 1 && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto md:w-20 md:shrink-0 md:flex-col md:overflow-visible">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`aspect-[4/5] w-16 shrink-0 overflow-hidden border bg-white md:w-full transition ${
                      i === activeImg ? 'border-white ring-1 ring-white' : 'border-line opacity-60 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={src} alt="" label={product.name} className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            <div className="group relative aspect-[4/5] flex-1 overflow-hidden border border-line bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full"
                >
                  <SafeImage
                    src={images[activeImg]}
                    alt={product.name}
                    label={product.name}
                    loading="eager"
                    onClick={() => setZoomOpen(true)}
                    className="h-full w-full cursor-zoom-in object-contain p-4"
                  />
                </motion.div>
              </AnimatePresence>

              {product.isNew && !soldOut && (
                <span className="absolute left-3 top-3 bg-ink px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white">
                  Drop 001 / New
                </span>
              )}

              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Inspect full screen"
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-ink/85 text-white transition hover:bg-ink"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <div className="flex items-center gap-2">
            <span className="eyebrow">MOTION ARCHIVE</span>
            {product.collectionIds?.includes('col-drop001') && (
              <span className="border border-line px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-accent">
                DROP 001
              </span>
            )}
          </div>
          <h1 className="display mt-2 text-4xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-accent">{formatPrice(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>

          {needsColor && (
            <div className="mt-8">
              <p className="eyebrow mb-3 !text-white">
                Color {color && <span className="text-muted">— {color}</span>}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setColor(c.name);
                      const i = c.image ? product.images.indexOf(c.image) : -1;
                      if (i >= 0) setActiveImg(i);
                    }}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    title={c.name}
                    className={`h-11 w-11 border transition ${
                      color === c.name
                        ? 'border-white ring-1 ring-white ring-offset-2 ring-offset-ink'
                        : 'border-line hover:border-accent'
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
              {showErrors && colorMissing && (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  Please select a color.
                </p>
              )}
            </div>
          )}

          {needsSize && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow !text-white">
                  Size {size && <span className="text-muted">— {size}</span>}
                </p>
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted underline hover:text-white"
                >
                  <Ruler className="h-3.5 w-3.5" /> Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`min-h-11 min-w-12 border px-3 text-sm transition-colors ${
                      size === s ? 'border-white bg-white font-semibold text-ink' : 'border-line hover:border-accent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {showErrors && sizeMissing && (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  Please select a size.
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="eyebrow mb-3 !text-white">Quantity</p>
              <div className="flex items-center border border-line">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-12 items-center justify-center hover:bg-card"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="flex h-12 w-12 items-center justify-center hover:bg-card disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p
              className={`mt-7 text-xs uppercase tracking-[0.18em] ${
                soldOut ? 'text-red-400' : lowStock ? 'text-accent' : 'text-muted'
              }`}
            >
              {soldOut ? 'Sold out' : lowStock ? `Only ${product.stock} left` : 'In stock · Ready to dispatch'}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Button onClick={handleAdd} disabled={soldOut} className="w-full">
              {soldOut ? 'Sold out' : 'Add to bag'}
            </Button>
            {!soldOut && (
              <Button variant="outline" onClick={handleInstantWhatsApp} className="w-full">
                <MessageCircle className="h-4 w-4" /> Instant Order via WhatsApp
              </Button>
            )}
          </div>

          {/* Editorial Accordions */}
          <div className="mt-10 divide-y divide-line border-y border-line">
            {ACCORDION_ITEMS.map((item) => {
              const isOpen = openAcc === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenAcc(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-4 text-left text-xs font-medium uppercase tracking-[0.2em] hover:text-accent"
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-xs leading-relaxed text-muted">{item.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center border border-line bg-ink text-white hover:bg-white hover:text-ink"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              src={images[activeImg]}
              alt={product.name}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[92vw] bg-white object-contain p-4"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {related.length > 0 && (
        <section className="pt-24 md:pt-32">
          <SectionHeading eyebrow="You may also like" title="Related" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
