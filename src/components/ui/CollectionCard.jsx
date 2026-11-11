import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import SafeImage from './SafeImage';

/** Large editorial collection tile. */
export default function CollectionCard({ collection, count, index = 0, tall = false }) {
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <Link to={`/collections/${collection.slug}`} className="group block border border-line bg-surface transition-colors hover:border-white/60">
        <div className={`relative overflow-hidden bg-white ${tall ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
          <SafeImage
            src={collection.coverImage}
            alt={collection.name}
            label={collection.name}
            className="h-full w-full object-contain p-4 transition-transform duration-[900ms] ease-out group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 bg-ink px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-white">
            0{index + 1} // COLLECTION
          </span>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-line p-6 md:p-8">
          <div>
            {typeof count === 'number' && (
              <p className="eyebrow mb-2 !text-accent">
                {count} {count === 1 ? 'piece' : 'pieces'} available
              </p>
            )}
            <h3 className="display text-3xl sm:text-4xl md:text-5xl">{collection.name}</h3>
            <p className="mt-3 max-w-lg text-sm text-muted">{collection.description}</p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line transition-colors group-hover:border-white group-hover:bg-white group-hover:text-ink">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
