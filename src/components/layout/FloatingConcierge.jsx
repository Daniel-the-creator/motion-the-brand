import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ghost, MessageCircle, MessageSquare, X } from 'lucide-react';
import { SITE } from '../../config/site';
import { whatsappLink } from '../../utils/whatsapp';

export default function FloatingConcierge() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('pointerdown', handlePointerDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="eyebrow flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VIP Concierge
                </p>
                <h4 className="display mt-0.5 text-xl tracking-wider">MOTION DIRECT</h4>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close concierge"
                className="text-muted transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted">
              Connect directly with our team for styling, sizing guidance, custom requests, and instant ordering.
            </p>

            <div className="mt-4 space-y-2.5">
              {/* WhatsApp Option */}
              <a
                href={whatsappLink('Hello MOTION, I would like to make an inquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between border border-line bg-ink/60 p-3 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-white group-hover:text-emerald-300">
                      WhatsApp Concierge
                    </p>
                    <p className="text-[0.65rem] text-muted">Instant ordering & sizing</p>
                  </div>
                </div>
                <span className="text-[0.6rem] uppercase tracking-widest text-emerald-400 opacity-80 group-hover:opacity-100">
                  Chat →
                </span>
              </a>

              {/* Snapchat Option */}
              <a
                href={SITE.social.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between border border-line bg-ink/60 p-3 transition-all hover:border-yellow-400/50 hover:bg-yellow-400/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-yellow-400/30 bg-yellow-400/20 text-yellow-300">
                    <Ghost className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-white group-hover:text-yellow-200">
                      Snapchat Concierge
                    </p>
                    <p className="text-[0.65rem] text-muted">@that_boy_diles</p>
                  </div>
                </div>
                <span className="text-[0.6rem] uppercase tracking-widest text-yellow-300 opacity-80 group-hover:opacity-100">
                  Add →
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open MOTION Concierge"
        aria-expanded={open}
        className="flex items-center gap-2.5 border border-line bg-surface/95 px-4 py-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white backdrop-blur transition-all hover:border-white hover:bg-white hover:text-ink shadow-lg"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <MessageSquare className="h-4 w-4" />
        <span>Concierge</span>
      </button>
    </div>
  );
}
