import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { LOGO_SRC } from '../../config/images';
import { SITE } from '../../config/site';
import { formatPrice } from '../../utils/format';
import Button from '../ui/Button';
import SafeImage from '../ui/SafeImage';

const ease = [0.22, 1, 0.36, 1];

/** Splits a headline into lines that slide up from a mask. */
function MaskLine({ children, delay }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { content, products } = useCatalog();
  const hero = content?.hero;

  // Spotlight the flagship DROP 001 pieces in the interactive Hero stage
  const spotlights = products.filter((p) => p.collectionIds?.includes('col-drop001')).slice(0, 5);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || spotlights.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % spotlights.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, spotlights.length]);

  const current = spotlights[activeIdx] || products[0];

  const words = (hero?.headline || SITE.tagline).split(' ');
  const mid = Math.ceil(words.length / 2);
  const lines = words.length > 1 ? [words.slice(0, mid).join(' '), words.slice(mid).join(' ')] : words;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-line pt-24 pb-16 md:pt-28 md:pb-20">
      {/* Subtle architectural grid & ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #292929 1px, transparent 1px), linear-gradient(to bottom, #292929 1px, transparent 1px)',
          backgroundSize: '4.5rem 4.5rem',
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[32rem] w-[32rem] rounded-full bg-white/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/80" />

      {/* Giant watermark background text */}
      <div
        aria-hidden="true"
        className="display pointer-events-none absolute -bottom-10 left-0 right-0 select-none overflow-hidden whitespace-nowrap text-center text-[22vw] leading-none text-white/[0.025]"
      >
        MOTION DROP 001
      </div>

      <div className="container-x relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left column: Campaign Editorial Copy */}
        <div className="lg:col-span-7">
          <div className="mb-6 flex items-center gap-4 md:mb-8">
            <motion.img
              src={LOGO_SRC}
              alt={SITE.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="h-14 w-auto md:h-20"
            />
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="border-l border-line pl-4"
            >
              <span className="inline-flex items-center gap-1.5 border border-line bg-surface px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-accent">
                <Sparkles className="h-3 w-3 text-white" /> {hero?.eyebrow || 'DROP 001 / LIVE'}
              </span>
              <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.24em] text-muted">
                LAGOS · HEAVYWEIGHT LUXURY STREETWEAR
              </p>
            </motion.div>
          </div>

          <h1 className="display text-[clamp(3.3rem,10.5vw,9.2rem)]">
            {lines.map((l, i) => (
              <MaskLine key={l} delay={0.35 + i * 0.12}>
                {l}
              </MaskLine>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease }}
            className="mt-6 max-w-lg text-base leading-relaxed text-accent md:text-lg"
          >
            {hero?.subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button to="/collections/drop-001">Explore Drop 001</Button>
            <Button to="/shop" variant="outline">
              Shop All Pieces
            </Button>
          </motion.div>

          {/* Editorial Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.9 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6"
          >
            <div>
              <p className="display text-2xl md:text-3xl">280GSM</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted">Heavyweight Cotton</p>
            </div>
            <div>
              <p className="display text-2xl md:text-3xl">DROP 001</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted">Limited Edition Run</p>
            </div>
            <div>
              <p className="display text-2xl md:text-3xl">24/7</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted">WhatsApp Concierge</p>
            </div>
          </motion.div>
        </div>

        {/* Right column: Interactive Drop 001 Showcase Card */}
        {current && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md border border-line bg-surface p-3 md:p-4">
              {/* Top status bar inside showcase frame */}
              <div className="mb-3 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.24em] text-muted">
                <span>
                  SPOTLIGHT // 0{activeIdx + 1} / 0{spotlights.length}
                </span>
                <span className="text-white">DROP 001 ARCHIVE</span>
              </div>

              <Link
                to={`/product/${current.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-white"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease }}
                    className="h-full w-full"
                  >
                    <SafeImage
                      src={current.images[0]}
                      alt={current.name}
                      label={current.name}
                      loading="eager"
                      className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-white">
                  Featured Piece
                </span>

                <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-ink text-white transition-transform duration-300 group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>

              {/* Featured Product Caption */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    to={`/product/${current.slug}`}
                    className="truncate block text-sm font-medium uppercase tracking-wider hover:text-accent"
                  >
                    {current.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-accent">{formatPrice(current.price)}</p>
                </div>
                <Link
                  to={`/product/${current.slug}`}
                  className="shrink-0 border border-line px-3.5 py-2 text-[0.65rem] uppercase tracking-[0.2em] hover:border-white hover:bg-white hover:text-ink transition-colors"
                >
                  View Piece
                </Link>
              </div>

              {/* Interactive Slide Selector Pills */}
              {spotlights.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-1.5">
                  {spotlights.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Show ${item.name}`}
                      className="group relative h-1.5 overflow-hidden bg-line"
                    >
                      <span
                        className={`block h-full bg-white transition-all duration-300 ${
                          i === activeIdx ? 'w-full' : 'w-0 group-hover:w-1/2'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className=" -translate-x-1/2 absolute bottom-4 left-1/2 hidden text-muted md:block"
        aria-hidden="true"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </motion.div>
    </section>
  );
}
