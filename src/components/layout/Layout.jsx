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
import FloatingConcierge from './FloatingConcierge';

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

      {/* Floating Concierge (WhatsApp + Snapchat) */}
      <FloatingConcierge />
    </div>
  );
}
