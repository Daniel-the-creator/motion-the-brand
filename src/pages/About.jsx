import { useCatalog } from '../context/CatalogContext';
import Reveal from '../components/ui/Reveal';
import SafeImage from '../components/ui/SafeImage';
import Button from '../components/ui/Button';

const paragraphs = (t = '') => t.split(/\n\s*\n/).filter(Boolean);

export default function About() {
  const { content } = useCatalog();
  const about = content?.about;
  if (!about) return null;
  const imgs = about.images || [];

  return (
    <div className="container-x pb-10 pt-32 md:pt-44">
      <Reveal>
        <p className="eyebrow mb-6">About MOTION</p>
        <h1 className="display max-w-6xl text-[clamp(2.6rem,9vw,8.5rem)]">{about.headline}</h1>
      </Reveal>

      {imgs[0] && (
        <Reveal className="mt-16 md:mt-24">
          <SafeImage src={imgs[0]} alt="MOTION campaign" label="Campaign" className="aspect-[16/9] w-full object-cover" loading="eager" />
        </Reveal>
      )}

      <div className="mt-20 grid gap-12 md:mt-32 md:grid-cols-12">
        <Reveal className="md:col-span-4"><h2 className="eyebrow !text-white">Brand story</h2></Reveal>
        <Reveal className="space-y-6 text-lg leading-relaxed text-accent md:col-span-8 md:text-2xl">
          {paragraphs(about.story).map((p, i) => <p key={i}>{p}</p>)}
        </Reveal>
      </div>

      <div className="mt-20 grid gap-4 md:mt-32 md:grid-cols-2">
        <Reveal className="border border-line bg-surface p-8 md:p-14">
          <p className="eyebrow mb-6">Philosophy</p>
          <p className="display text-3xl md:text-4xl">Less noise. More motion.</p>
          <p className="mt-6 leading-relaxed text-muted">{about.philosophy}</p>
        </Reveal>
        <Reveal delay={0.1} className="border border-line bg-surface p-8 md:p-14">
          <p className="eyebrow mb-6">What MOTION represents</p>
          <p className="display text-3xl md:text-4xl">Never standing still.</p>
          <p className="mt-6 leading-relaxed text-muted">{about.represents}</p>
        </Reveal>
      </div>

      {imgs.length > 1 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {imgs.slice(1).map((src, i) => (
            <Reveal key={i} delay={i * 0.1}><SafeImage src={src} alt="MOTION campaign" label="Campaign" className="aspect-[4/5] w-full object-cover" /></Reveal>
          ))}
        </div>
      )}

      <Reveal className="mt-24 text-center md:mt-36">
        <h2 className="display text-4xl md:text-7xl">Built to move.</h2>
        <div className="mt-8"><Button to="/shop">Shop the collection</Button></div>
      </Reveal>
    </div>
  );
}

