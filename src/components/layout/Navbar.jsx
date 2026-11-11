import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { LOGO_SRC } from '../../config/images';
import { SITE } from '../../config/site';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/collections/drop-001', label: 'Drop 001', highlight: true },
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections', end: true },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const { totalQuantity, openCart } = useCart();
  const { openSearch } = useUI();
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const solid = scrolled || menuOpen || pathname !== '/';

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? 'border-b border-line bg-ink/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'}`}>
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <Link to="/" aria-label={`${SITE.name} home`} className="relative z-50 flex items-center">
            <img src={LOGO_SRC} alt={SITE.name} className="h-10 w-auto md:h-12" />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `group relative flex items-center gap-1.5 py-2 text-[0.72rem] uppercase tracking-[0.25em] transition-colors ${
                    isActive ? 'text-white' : l.highlight ? 'text-accent hover:text-white' : 'text-muted hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.highlight && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                    {l.label}
                    <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-white transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="relative z-50 flex items-center">
            <button type="button" onClick={openSearch} aria-label="Search" className="flex h-11 w-11 items-center justify-center transition-colors hover:text-accent">
              <Search className="h-5 w-5" />
            </button>
            <button type="button" onClick={openCart} aria-label={`Open bag, ${totalQuantity} items`} className="relative flex h-11 w-11 items-center justify-center transition-colors hover:text-accent">
              <ShoppingBag className="h-5 w-5" />
              {totalQuantity > 0 && (
                <motion.span key={totalQuantity} initial={{ scale: 0.6 }} animate={{ scale: 1 }}
                  className="absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center bg-white px-1 text-[0.6rem] font-semibold text-ink">
                  {totalQuantity}
                </motion.span>
              )}
            </button>
            <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="flex h-11 w-11 items-center justify-center md:hidden">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Live Scroll Progress Line */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="h-[1.5px] w-full origin-left bg-white/80"
        />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 md:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.5 }}>
                  <Link to={l.to} className="display block py-2 text-5xl">{l.label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="space-y-2 text-xs uppercase tracking-[0.25em] text-muted">
              <p className="text-white">{SITE.tagline}</p>
              <div className="flex gap-6 pt-3">
                <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white">TikTok</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
