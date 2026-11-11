import { useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import ProductGrid from '../components/product/ProductGrid';
import SafeImage from '../components/ui/SafeImage';
import { EmptyState, Spinner } from '../components/ui/States';

export default function CollectionDetail() {
  const { slug } = useParams();
  const { collections, products, loading } = useCatalog();
  const collection = collections.find((c) => c.slug === slug);

  if (loading) return <div className="pt-32"><Spinner /></div>;
  if (!collection) return <div className="pt-32"><EmptyState title="Collection not found" actionLabel="All collections" actionTo="/collections" /></div>;

  const items = products.filter((p) => p.collectionIds.includes(collection.id));

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <SafeImage src={collection.coverImage} alt="" label={collection.name} loading="eager" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="container-x relative pb-12 pt-40">
          <p className="eyebrow mb-3 !text-accent">Collection</p>
          <h1 className="display text-5xl sm:text-7xl md:text-9xl">{collection.name}</h1>
          <p className="mt-5 max-w-xl text-accent">{collection.description}</p>
        </div>
      </section>
      <div className="container-x pt-16">
        {items.length === 0
          ? <EmptyState title="No pieces yet" message="Products will appear here once added to this collection." actionLabel="Shop all" actionTo="/shop" />
          : <ProductGrid products={items} />}
      </div>
    </>
  );
}

