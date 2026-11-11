import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { SIZE_GUIDE } from '../../data/seed';

export function SizeTables() {
  return (
    <div className="space-y-8">
      {Object.values(SIZE_GUIDE).map((t) => (
        <div key={t.title}>
          <h3 className="eyebrow mb-3 !text-white">{t.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-muted">{t.columns.map((c) => <th key={c} className="py-2 pr-4 font-normal text-xs uppercase tracking-wider">{c}</th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-line/60">{r.map((cell, i) => <td key={i} className={`py-2.5 pr-4 ${i === 0 ? 'font-medium' : 'text-accent'}`}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <p className="text-xs text-muted">Measurements are of the garment, laid flat. Between sizes? Size up for an oversized fit.</p>
    </div>
  );
}

export default function SizeGuideModal() {
  const { sizeGuideOpen, closeSizeGuide } = useUI();

  useEffect(() => {
    if (!sizeGuideOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeSizeGuide();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [sizeGuideOpen, closeSizeGuide]);

  return (
    <AnimatePresence>
      {sizeGuideOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSizeGuide}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-6">
          <motion.div role="dialog" aria-modal="true" aria-label="Size guide" onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-line bg-surface p-6 md:p-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display text-3xl">Size Guide</h2>
              <button type="button" onClick={closeSizeGuide} aria-label="Close size guide" className="flex h-11 w-11 items-center justify-center hover:text-accent"><X className="h-5 w-5" /></button>
            </div>
            <SizeTables />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

