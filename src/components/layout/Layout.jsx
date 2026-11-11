import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import SearchOverlay from './SearchOverlay';
import SizeGuideModal from './SizeGuideModal';
import QuickViewModal from '../product/QuickViewModal';
import PageTransition from '../ui/PageTransition';
import { whatsappLink } from '../../utils/whatsapp';

export default function Layout() {
  const location = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-ink">
      <Navbar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <SizeGuideModal />
      <QuickViewModal />

      {/* Floating WhatsApp Concierge Pill */}
      <a
        href={whatsappLink('Hello MOTION, I have a question about a piece.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with MOTION on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 border border-line bg-surface/95 px-4 py-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white backdrop-blur transition-colors hover:border-white hover:bg-white hover:text-ink"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp Concierge</span>
      </a>
    </div>
  );
}
