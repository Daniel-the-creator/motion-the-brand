import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Eye, Layers } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import { formatPrice } from '../../utils/format';
import SafeImage from '../ui/SafeImage';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';

export default function DropLookbook() {
  const { products } = useCatalog();
  const { openQuickView } = useUI();

  const dropItems = products.filter((p) => p.collectionIds?.includes('col-drop001')).slice(0, 6);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [viewIdx, setViewIdx] = useState(0);

  if (dropItems.length === 0) return null;

  const active = dropItems[selectedIdx] || dropItems[0];
  const images = active.images || [];
  const currentImg = images[viewIdx] || images[0];

  const selectProduct = (i) => {
    setSelectedIdx(i);
    setViewIdx(0);
  };

  return (
    <section className="container-x pt-24 md:pt-36">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
        <div>
          <p className="eyebrow mb-3">Interactive Lookbook // 001</p>
          <h2 className="display text-4xl sm:text-5xl md:text-7xl">Drop 001 Spotlight</h2>
        </div>
        <Link
          to="/collections/drop-001"
          className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-xs uppercase tracking-[0.22em] transition-colors hover:border-white"
        >
          Explore full Drop 001 <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <div className="grid border border-line bg-surface lg:grid-cols-12">
        {/* Left: Interactive Piece Selector List */}
        <div className="divide-y divide-line border-b border-line lg:col-span-5 lg:border-b-0 lg:border-r">
          {dropItems.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectProduct(idx)}
                className={`group flex w-full items-center justify-between gap-4 p-5 text-left transition-colors md:p-6 ${
                  isSelected ? 'bg-white text-ink' : 'hover:bg-card text-white'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`font-mono text-xs tracking-widest ${
                      isSelected ? 'text-ink/60' : 'text-muted'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="h-14 w-12 shrink-0 overflow-hidden border border-line bg-white">
                    <SafeImage src={item.images[0]} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold uppercase tracking-wider">{item.name}</p>
                    <p className={`mt-0.5 text-xs ${isSelected ? 'text-ink/75' : 'text-muted'}`}>
                      {formatPrice(item.price)} · {item.colors.map((c) => c.name).join(' / ')}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isSelected ? 'text-ink' : 'text-muted'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Split Stage & Angle Switcher */}
        <div className="flex flex-col justify-between p-6 md:p-10 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="eyebrow">Selected Piece // 0{selectedIdx + 1}</span>
              <h3 className="display mt-1 text-2xl md:text-4xl">{active.name}</h3>
            </div>
            {images.length > 1 && (
              <div className="flex items-center gap-1.5">
                <Layers className="mr-1 h-3.5 w-3.5 text-muted" />
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setViewIdx(i)}
                    className={`border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                      viewIdx === i
                        ? 'border-white bg-white text-ink font-medium'
                        : 'border-line text-muted hover:border-accent hover:text-white'
                    }`}
                  >
                    {i === 0 ? 'View 01' : i === 1 ? 'View 02' : `Full Sheet`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stage Image */}
          <div className="relative my-6 aspect-[16/11] w-full overflow-hidden border border-line bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.id}-${viewIdx}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full"
              >
                <SafeImage
                  src={currentImg}
                  alt={active.name}
                  label={active.name}
                  className="h-full w-full object-contain p-4 md:p-6"
                />
              </motion.div>
            </AnimatePresence>

            <span className="absolute left-3 top-3 bg-ink px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-white">
              {formatPrice(active.price)}
            </span>
          </div>

          {/* Description + Actions */}
          <div className="flex flex-col justify-between gap-6 border-t border-line pt-5 sm:flex-row sm:items-center">
            <p className="max-w-md text-sm leading-relaxed text-muted">{active.description}</p>
            <div className="flex shrink-0 gap-3">
              <Button variant="outline" onClick={() => openQuickView(active)} className="!px-5">
                <Eye className="h-4 w-4" /> Quick Buy
              </Button>
              <Button to={`/product/${active.slug}`} className="!px-5">
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

