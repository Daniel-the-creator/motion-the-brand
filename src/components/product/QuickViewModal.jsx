import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Minus, Plus, Ruler, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { checkoutViaWhatsApp } from '../../utils/whatsapp';
import SafeImage from '../ui/SafeImage';
import Button from '../ui/Button';

export default function QuickViewModal() {
  const { quickViewProduct: product, closeQuickView, openSizeGuide } = useUI();
  const { addItem } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!product) return undefined;
    setActiveImg(0);
    setSize(product.sizes?.length === 1 ? product.sizes[0] : null);
    setColor(product.colors?.length === 1 ? product.colors[0].name : null);
    setQuantity(1);
    setShowErrors(false);
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeQuickView();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product, closeQuickView]);

  if (!product) return null;

  const soldOut = product.stock <= 0;
  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const sizeMissing = needsSize && !size;
  const colorMissing = needsColor && !color;
  const images = product.images.length ? product.images : [''];

  const handleAdd = () => {
    if (sizeMissing || colorMissing) {
      setShowErrors(true);
      return;
    }
    addItem(product, { size, color, quantity });
    closeQuickView();
  };

  const handleDirectWhatsApp = () => {
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
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 z-[85] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view ${product.name}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-line bg-surface"
          >
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center border border-line bg-ink/80 text-white transition-colors hover:bg-white hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-12">
              {/* Image Gallery */}
              <div className="relative bg-white md:col-span-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-full w-full"
                    >
                      <SafeImage
                        src={images[activeImg]}
                        alt={product.name}
                        label={product.name}
                        className="h-full w-full object-contain p-4"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {product.isNew && (
                    <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white">
                      Drop 001 / New
                    </span>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 border-t border-line bg-ink p-3">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        className={`h-16 w-14 overflow-hidden border bg-white transition ${
                          i === activeImg ? 'border-white ring-1 ring-white' : 'border-line opacity-60 hover:opacity-100'
                        }`}
                      >
                        <SafeImage src={src} alt="" className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between p-6 md:col-span-6 md:p-8">
                <div>
                  <p className="eyebrow mb-2">MOTION // Quick View</p>
                  <h2 className="display text-3xl md:text-4xl">{product.name}</h2>
                  <p className="mt-2 text-xl text-accent">{formatPrice(product.price)}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

                  {needsColor && (
                    <div className="mt-6">
                      <p className="eyebrow mb-2.5 !text-white">
                        Color {color && <span className="text-muted">— {color}</span>}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {product.colors.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setColor(c.name);
                              const idx = c.image ? product.images.indexOf(c.image) : -1;
                              if (idx >= 0) setActiveImg(idx);
                            }}
                            title={c.name}
                            aria-label={c.name}
                            className={`h-9 w-9 border transition ${
                              color === c.name
                                ? 'border-white ring-1 ring-white ring-offset-2 ring-offset-surface'
                                : 'border-line hover:border-accent'
                            }`}
                            style={{ background: c.hex }}
                          />
                        ))}
                      </div>
                      {showErrors && colorMissing && (
                        <p className="mt-1.5 text-xs text-red-400">Please select a color.</p>
                      )}
                    </div>
                  )}

                  {needsSize && (
                    <div className="mt-6">
                      <div className="mb-2.5 flex items-center justify-between">
                        <p className="eyebrow !text-white">
                          Size {size && <span className="text-muted">— {size}</span>}
                        </p>
                        <button
                          type="button"
                          onClick={openSizeGuide}
                          className="flex items-center gap-1 text-[0.68rem] uppercase tracking-widest text-muted underline hover:text-white"
                        >
                          <Ruler className="h-3 w-3" /> Size guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSize(s)}
                            className={`min-h-10 min-w-11 border px-3 text-xs transition-colors ${
                              size === s ? 'border-white bg-white text-ink font-semibold' : 'border-line hover:border-accent'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      {showErrors && sizeMissing && (
                        <p className="mt-1.5 text-xs text-red-400">Please select a size.</p>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-10 w-10 items-center justify-center hover:bg-card"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm">{quantity}</span>
                      <button
                        type="button"
                        disabled={quantity >= product.stock}
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="flex h-10 w-10 items-center justify-center hover:bg-card disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-muted">
                      {soldOut ? 'Sold out' : `${product.stock} in stock`}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-2.5">
                  <Button onClick={handleAdd} disabled={soldOut} className="w-full">
                    {soldOut ? 'Sold Out' : 'Add to Bag'}
                  </Button>
                  {!soldOut && (
                    <Button variant="outline" onClick={handleDirectWhatsApp} className="w-full">
                      <MessageCircle className="h-4 w-4" /> Instant Order on WhatsApp
                    </Button>
                  )}
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={closeQuickView}
                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 py-2 text-xs uppercase tracking-[0.2em] text-muted hover:text-white"
                  >
                    View full product details <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

