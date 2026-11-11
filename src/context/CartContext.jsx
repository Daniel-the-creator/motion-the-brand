import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'motion_cart_v1';

const keyOf = (productId, size, color) => `${productId}|${size || ''}|${color || ''}`;

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  const addItem = useCallback((product, { size = null, color = null, quantity = 1 } = {}, { openDrawer = true } = {}) => {
    const key = keyOf(product.id, size, color);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      const max = product.stock ?? Infinity;
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, max), maxStock: max } : i));
      }
      return [...prev, {
        key, productId: product.id, slug: product.slug, name: product.name, price: product.price,
        image: product.images?.[0] || '', sizes: product.sizes || [], colors: product.colors || [],
        size, color, quantity: Math.min(quantity, max), maxStock: max,
      }];
    });
    if (openDrawer) setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) => prev.flatMap((i) => {
      if (i.key !== key) return [i];
      if (quantity <= 0) return [];
      return [{ ...i, quantity: Math.min(quantity, i.maxStock ?? Infinity) }];
    }));
  }, []);

  /** Change size/color of a line; merges with an identical line if one exists. */
  const updateVariant = useCallback((key, { size, color }) => {
    setItems((prev) => {
      const line = prev.find((i) => i.key === key);
      if (!line) return prev;
      const next = { ...line, size: size ?? line.size, color: color ?? line.color };
      next.key = keyOf(line.productId, next.size, next.color);
      const rest = prev.filter((i) => i.key !== key);
      const dup = rest.find((i) => i.key === next.key);
      if (dup) {
        return rest.map((i) => (i.key === next.key ? { ...i, quantity: Math.min(i.quantity + line.quantity, i.maxStock ?? Infinity) } : i));
      }
      return prev.map((i) => (i.key === key ? next : i));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem, removeItem, updateQuantity, updateVariant, clearCart,
  }), [items, isOpen, addItem, removeItem, updateQuantity, updateVariant, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

