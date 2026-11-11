import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { formatPrice } from '../../utils/format';
import { checkoutViaWhatsApp } from '../../utils/whatsapp';
import SafeImage from '../ui/SafeImage';
import Button from '../ui/Button';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, totalQuantity, removeItem, updateQuantity, updateVariant } = useCart();
  const { toast } = useUI();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    // Make sure every item that has options has them chosen before ordering
    const incomplete = items.find((i) => (i.sizes.length && !i.size) || (i.colors.length && !i.color));
    if (incomplete) return toast(`Select size & color for ${incomplete.name}`);
    checkoutViaWhatsApp(items);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-[2px]" />
          <motion.aside key="drawer" role="dialog" aria-modal="true" aria-label="Shopping bag"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <h2 className="display text-2xl">Bag <span className="text-muted">({totalQuantity})</span></h2>
              <button type="button" onClick={closeCart} aria-label="Close bag" className="flex h-11 w-11 items-center justify-center hover:text-accent"><X className="h-5 w-5" /></button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-line" />
                <p className="display text-2xl">Your bag is empty</p>
                <p className="text-sm text-muted">Pieces you add will appear here.</p>
                <Button to="/shop" variant="outline" onClick={closeCart}>Shop now</Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <Link to={`/product/${item.slug}`} onClick={closeCart} className="block h-28 w-22 shrink-0 overflow-hidden bg-card" style={{ width: 88 }}>
                        <SafeImage src={item.image} alt={item.name} label={item.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link to={`/product/${item.slug}`} onClick={closeCart} className="text-sm font-medium uppercase leading-tight">{item.name}</Link>
                          <button type="button" onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`} className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center text-muted hover:text-white"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <p className="mt-1 text-sm text-accent">{formatPrice(item.price)}</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.sizes.length > 0 && (
                            <select aria-label="Size" value={item.size || ''} onChange={(e) => updateVariant(item.key, { size: e.target.value })} className="field !w-auto !px-2 !py-1.5 !text-xs">
                              {!item.size && <option value="">Size</option>}
                              {item.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          )}
                          {item.colors.length > 0 && (
                            <select aria-label="Color" value={item.color || ''} onChange={(e) => updateVariant(item.key, { color: e.target.value })} className="field !w-auto !px-2 !py-1.5 !text-xs">
                              {!item.color && <option value="">Color</option>}
                              {item.colors.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                          )}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.key, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center hover:bg-card"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
                            <button type="button" aria-label="Increase quantity" disabled={item.quantity >= item.maxStock} onClick={() => updateQuantity(item.key, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center hover:bg-card disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 border-t border-line bg-ink px-5 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow">Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                    <span className="display text-2xl">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted">Your order is sent to us on WhatsApp. We confirm availability and share payment details there — no payment is taken on this site.</p>
                  <Button variant="whatsapp" onClick={handleCheckout}><MessageCircle className="h-4 w-4" /> Order via WhatsApp</Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

