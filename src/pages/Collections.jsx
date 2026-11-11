import { useCatalog } from '../context/CatalogContext';
import CollectionCard from '../components/ui/CollectionCard';
import { EmptyState, Spinner } from '../components/ui/States';

export default function Collections() {
  const { collections, products, loading } = useCatalog();
  return (
    <div className="container-x pb-10 pt-32 md:pt-40">
      <header className="mb-12 md:mb-16">
        <p className="eyebrow mb-3">Curated</p>
        <h1 className="display text-6xl md:text-9xl">Collections</h1>
      </header>
      {loading ? <Spinner /> : collections.length === 0 ? (
        <EmptyState title="No collections yet" message="Check back soon." actionLabel="Shop all" actionTo="/shop" />
      ) : (
        <div className="grid gap-x-6 gap-y-16 md:grid-cols-2">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} index={i} count={products.filter((p) => p.collectionIds.includes(c.id)).length} />
          ))}
        </div>
      )}
    </div>
  );
}

