import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const UIContext = createContext(null);

/** Global UI state: search overlay, size guide modal, quick view modal, toasts. */
export function UIProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const value = useMemo(() => ({
    searchOpen, openSearch: () => setSearchOpen(true), closeSearch: () => setSearchOpen(false),
    sizeGuideOpen, openSizeGuide: () => setSizeGuideOpen(true), closeSizeGuide: () => setSizeGuideOpen(false),
    quickViewProduct, openQuickView: (product) => setQuickViewProduct(product), closeQuickView: () => setQuickViewProduct(null),
    toast,
  }), [searchOpen, sizeGuideOpen, quickViewProduct, toast]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="border border-line bg-card px-5 py-3 text-xs uppercase tracking-widest text-white shadow-2xl"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
