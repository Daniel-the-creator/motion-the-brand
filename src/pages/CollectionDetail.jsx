import { Link, useParams } from 'react-router-dom';
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
      <section className="border-b border-line bg-surface pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              <Link to="/collections" className="hover:text-white">Collections</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{collection.name}</span>
            </nav>
            <p className="eyebrow mb-3 !text-accent">Curated Drop // {items.length} {items.length === 1 ? 'Piece' : 'Pieces'}</p>
            <h1 className="display text-5xl sm:text-7xl md:text-8xl">{collection.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-accent">{collection.description}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-line bg-white p-4">
              <SafeImage
                src={collection.coverImage}
                alt={collection.name}
                label={collection.name}
                loading="eager"
                className="aspect-[16/10] w-full object-contain"
              />
            </div>
          </div>
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
