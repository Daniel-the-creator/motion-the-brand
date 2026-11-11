import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';

/** Promotional banner — editable from Admin > Site Content. Internal links use the router. */
export default function PromoBanner() {
  const { content } = useCatalog();
  const promo = content?.promo;
  if (!promo?.enabled) return null;
  const external = /^https?:\/\//.test(promo.linkUrl || '');

  return (
    <section className="mt-24 md:mt-36">
      <Reveal className="relative flex min-h-[70vh] items-center overflow-hidden border-y border-line">
        <img src={promo.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="container-x relative py-20">
          <p className="eyebrow mb-4 !text-accent">{promo.text}</p>
          <h2 className="display text-[clamp(3.5rem,13vw,12rem)]">{promo.title}</h2>
          <p className="mt-5 max-w-md text-accent">{promo.description}</p>
          {promo.linkLabel && (
            <div className="mt-8">
              {external ? <Button href={promo.linkUrl}>{promo.linkLabel}</Button> : <Button to={promo.linkUrl || '/shop'}>{promo.linkLabel}</Button>}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
