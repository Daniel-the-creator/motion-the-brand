import { Link } from 'react-router-dom';
import { LOGO_SRC } from '../../config/images';
import { SITE } from '../../config/site';
import { whatsappLink } from '../../utils/whatsapp';
import { useUI } from '../../context/UIContext';
import Newsletter from './Newsletter';

const linkCls = 'text-sm text-muted transition-colors hover:text-white';

export default function Footer() {
  const { openSizeGuide } = useUI();
  return (
    <footer className="mt-32 border-t border-line bg-surface">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={LOGO_SRC} alt={SITE.name} className="h-14 w-auto md:h-16" />
            <p className="display mt-6 text-3xl text-white/90 md:text-5xl">{SITE.tagline}</p>
            <div className="mt-10 max-w-sm">
              <p className="eyebrow mb-2">Join the newsletter</p>
              <Newsletter />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3 md:pl-10">
            <div>
              <p className="eyebrow mb-5">Explore</p>
              <ul className="space-y-3">
                <li><Link to="/shop" className={linkCls}>Shop</Link></li>
                <li><Link to="/collections" className={linkCls}>Collections</Link></li>
                <li><Link to="/about" className={linkCls}>About</Link></li>
                <li><Link to="/contact" className={linkCls}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Help</p>
              <ul className="space-y-3">
                <li><button type="button" onClick={openSizeGuide} className={linkCls}>Size Guide</button></li>
                <li><Link to="/shipping" className={linkCls}>Shipping Information</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Follow</p>
              <ul className="space-y-3">
                <li><a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>Instagram</a></li>
                <li><a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" className={linkCls}>TikTok</a></li>
                <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkCls}>WhatsApp</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <Link to="/admin" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

