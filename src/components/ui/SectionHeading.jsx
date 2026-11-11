import Reveal from './Reveal';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function SectionHeading({ eyebrow, title, linkTo, linkLabel }) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="display text-4xl sm:text-5xl md:text-7xl">{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className="hidden shrink-0 items-center gap-2 border-b border-white/40 pb-1 text-xs uppercase tracking-[0.22em] transition-colors hover:border-white sm:inline-flex">
          {linkLabel} <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </Reveal>
  );
}

