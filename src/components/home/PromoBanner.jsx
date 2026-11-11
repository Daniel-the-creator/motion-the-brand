import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import SafeImage from '../ui/SafeImage';

/** Promotional banner — editable from Admin > Site Content. Internal links use the router. */
export default function PromoBanner() {
  const { content } = useCatalog();
  const promo = content?.promo;
  if (!promo?.enabled) return null;
  const external = /^https?:\/\//.test(promo.linkUrl || '');

  return (
    <section className="mt-24 md:mt-36">
      <Reveal className="relative overflow-hidden border-y border-line bg-surface">
        <div className="container-x grid grid-cols-1 items-center gap-8 py-14 md:py-24 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-6">
            <span className="inline-block max-w-full border border-line bg-ink px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-accent sm:text-[0.62rem] sm:tracking-[0.28em]">
              {promo.text}
            </span>
            <h2 className="display mt-5 text-[clamp(3.2rem,10vw,8.5rem)]">{promo.title}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-accent">{promo.description}</p>
            {promo.linkLabel && (
              <div className="mt-8">
                {external ? (
                  <Button href={promo.linkUrl}>{promo.linkLabel}</Button>
                ) : (
                  <Button to={promo.linkUrl || '/shop'}>{promo.linkLabel}</Button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden border border-line bg-white p-4">
              <SafeImage
                src={promo.image}
                alt={promo.title}
                label={promo.title}
                className="aspect-[16/10] w-full object-contain"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
