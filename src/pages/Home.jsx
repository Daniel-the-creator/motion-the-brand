import Hero from '../components/home/Hero';
import NewArrivals from '../components/home/NewArrivals';
import PromoBanner from '../components/home/PromoBanner';
import CollectionsPreview from '../components/home/CollectionsPreview';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { useCatalog } from '../context/CatalogContext';
import { ErrorState } from '../components/ui/States';

export default function Home() {
  const { content, error, refresh } = useCatalog();
  if (error) return <div className="pt-32"><ErrorState message={error} onRetry={refresh} /></div>;

  return (
    <>
      <Hero />
      <NewArrivals />
      <PromoBanner />
      <CollectionsPreview />
      <section className="container-x pt-24 md:pt-36">
        <Reveal className="border-t border-line pt-14 text-center md:pt-24">
          <p className="eyebrow mb-6">The philosophy</p>
          <h2 className="display mx-auto max-w-5xl text-4xl sm:text-6xl md:text-8xl">{content?.about?.headline}</h2>
          <div className="mt-10"><Button to="/about" variant="outline">Our story</Button></div>
        </Reveal>
      </section>
    </>
  );
}

