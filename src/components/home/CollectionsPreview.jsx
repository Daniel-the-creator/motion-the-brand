import { useCatalog } from '../../context/CatalogContext';
import SectionHeading from '../ui/SectionHeading';
import CollectionCard from '../ui/CollectionCard';

export default function CollectionsPreview() {
  const { collections, products } = useCatalog();
  if (!collections.length) return null;
  return (
    <section className="container-x pt-24 md:pt-36">
      <SectionHeading eyebrow="Curated" title="Collections" linkTo="/collections" linkLabel="All collections" />
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
        {collections.slice(0, 4).map((c, i) => (
          <CollectionCard key={c.id} collection={c} index={i} count={products.filter((p) => p.collectionIds.includes(c.id)).length} />
        ))}
      </div>
    </section>
  );
}

