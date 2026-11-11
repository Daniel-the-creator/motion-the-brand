import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import SafeImage from './SafeImage';

/** Large editorial collection tile. */
export default function CollectionCard({ collection, count, index = 0, tall = false }) {
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <Link to={`/collections/${collection.slug}`} className="group block">
        <div className={`relative overflow-hidden bg-card ${tall ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
          <SafeImage src={collection.coverImage} alt={collection.name} label={collection.name} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
            <div>
              <h3 className="display text-3xl sm:text-4xl md:text-5xl">{collection.name}</h3>
              {typeof count === 'number' && <p className="eyebrow mt-3 !text-accent">{count} {count === 1 ? 'piece' : 'pieces'}</p>}
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/60 transition-colors group-hover:bg-white group-hover:text-ink"><ArrowUpRight className="h-5 w-5" /></span>
          </div>
        </div>
        <p className="mt-4 max-w-lg text-sm text-muted">{collection.description}</p>
        <span className="mt-3 inline-block border-b border-white/40 pb-1 text-xs uppercase tracking-[0.22em] group-hover:border-white">View Collection</span>
      </Link>
    </Reveal>
  );
}

