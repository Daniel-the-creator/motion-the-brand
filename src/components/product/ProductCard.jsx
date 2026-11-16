import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Plus, X } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { formatPrice, getBookingState, resolveColorImage } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { toast, openQuickView } = useUI();
  const [picking, setPicking] = useState(false);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const booking = getBookingState(product);
  const soldOut = product.stock <= 0 || Boolean(booking?.expired);
  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const autoSize = product.sizes.length === 1 ? product.sizes[0] : null;
  const autoColor = product.colors.length === 1 ? product.colors[0].name : null;
  const needsPicker = (needsSize && !autoSize) || (needsColor && !autoColor);

  const commit = (s, c) => {
    addItem(product, { size: s, color: c, quantity: 1 }, { openDrawer: false });
    toast(booking ? `${product.name} slot added to bag` : `${product.name} added to bag`);
    setPicking(false);
    setSize(null);
    setColor(null);
  };

  const onQuickAdd = (e) => {
    e.preventDefault();
    if (soldOut) return;
    if (!needsPicker) return commit(autoSize, autoColor);
    setPicking(true);
  };

  const ready = (!needsSize || size || autoSize) && (!needsColor || color || autoColor);
  const mainSrc = previewImg || product.images[0];
  const hasSecondView = !previewImg && Boolean(product.images[1]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden border border-line/60 bg-white transition-colors duration-300 group-hover:border-white/50">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <SafeImage
            src={mainSrc}
            alt={product.name}
            label={product.name}
            className={`absolute inset-0 h-full w-full object-contain p-2 transition duration-700 ease-out group-hover:scale-105 ${
              hasSecondView ? 'group-hover:opacity-0' : ''
            }`}
          />
          {hasSecondView && (
            <SafeImage
              src={product.images[1]}
              alt=""
              label={product.name}
              className="absolute inset-0 h-full w-full scale-105 object-contain p-2 opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Top-left badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {booking && !soldOut && (
            <>
              <span className="bg-emerald-500 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.2em] text-ink">
                Book Now · {booking.remainingSlots} Slots
              </span>
              <span className="border border-line bg-ink/90 px-2 py-0.5 text-[0.52rem] uppercase tracking-[0.18em] text-white">
                Ends {booking.deadlineLabel}
              </span>
            </>
          )}
          {!booking && product.isNew && !soldOut && (
            <span className="bg-ink px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white">
              Drop 001
            </span>
          )}
          {soldOut && (
            <span className="border border-line bg-ink/90 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-muted">
              {booking?.expired ? 'Booking Closed' : 'Sold Out'}
            </span>
          )}
        </div>

        {/* Multi-view indicator */}
        {product.images.length > 1 && (
          <span className="pointer-events-none absolute right-2.5 top-2.5 border border-line/40 bg-ink/80 px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {product.images.length} Views
          </span>
        )}

        {/* Quick View + Quick Add action buttons */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 md:translate-y-2 md:opacity-0 md:transition md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-within:translate-y-0 md:focus-within:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openQuickView(product);
            }}
            aria-label={`Quick view ${product.name}`}
            title="Quick view"
            className="flex h-10 w-10 items-center justify-center bg-ink/85 text-white backdrop-blur transition-colors hover:bg-ink"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onQuickAdd}
            disabled={soldOut}
            aria-label={`Quick add ${product.name}`}
            title="Quick add to bag"
            className="flex h-10 w-10 items-center justify-center bg-ink text-white transition-colors hover:bg-neutral-800 disabled:hidden"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence>
          {picking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col justify-end gap-4 bg-ink/92 p-4 backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => setPicking(false)}
                aria-label="Close"
                className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center text-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {needsColor && !autoColor && (
                <div>
                  <p className="eyebrow mb-2">Color{color ? ` — ${color}` : ''}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c, cIdx) => {
                      const cImg = resolveColorImage(product, c, cIdx);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          title={c.name}
                          aria-label={c.name}
                          onClick={() => {
                            setColor(c.name);
                            if (cImg) setPreviewImg(cImg);
                          }}
                          className={`h-8 w-8 border ${
                            color === c.name ? 'border-white ring-1 ring-white ring-offset-2 ring-offset-ink' : 'border-line'
                          }`}
                          style={{ background: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {needsSize && !autoSize && (
                <div>
                  <p className="eyebrow mb-2">Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`min-h-9 min-w-9 border px-2 text-xs ${
                          size === s ? 'border-white bg-white text-ink font-semibold' : 'border-line text-white hover:border-accent'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                disabled={!ready}
                onClick={() => commit(size || autoSize, color || autoColor)}
                className="min-h-11 bg-white text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink transition-opacity disabled:opacity-40"
              >
                Add to bag
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info + Interactive Color Swatches */}
      <div className="mt-3 space-y-1.5">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <Link
            to={`/product/${product.slug}`}
            className="line-clamp-1 text-xs font-medium uppercase tracking-wide transition-colors hover:text-accent sm:text-sm"
          >
            {product.name}
          </Link>
          <p className="shrink-0 text-xs font-medium text-accent sm:text-sm">{formatPrice(product.price)}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5" aria-label="Available colors">
              {product.colors.map((c, cIdx) => {
                const cImg = resolveColorImage(product, c, cIdx);
                const isSelected = previewImg ? cImg === previewImg : cIdx === 0;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={`Preview ${c.name}`}
                    onMouseEnter={() => cImg && setPreviewImg(cImg)}
                    onClick={() => cImg && setPreviewImg(cImg)}
                    className={`h-3.5 w-3.5 border transition ${
                      isSelected ? 'border-white scale-110 ring-1 ring-white' : 'border-line hover:border-white'
                    }`}
                    style={{ background: c.hex }}
                  />
                );
              })}
            </div>
          )}
          {product.sizes.length > 0 && (
            <p className="hidden text-[0.62rem] tracking-[0.15em] text-muted sm:block">{product.sizes.join(' · ')}</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
