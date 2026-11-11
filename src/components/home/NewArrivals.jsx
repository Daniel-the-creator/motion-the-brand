import { useMemo } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import SectionHeading from '../ui/SectionHeading';
import ProductGrid from '../product/ProductGrid';
import { EmptyState, ProductSkeletonGrid } from '../ui/States';
import Button from '../ui/Button';

export default function NewArrivals() {
  const { products, loading } = useCatalog();
  const items = useMemo(
    () => products.filter((p) => p.isNew).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
    [products],
  );

  return (
    <section className="container-x pt-24 md:pt-36">
      <SectionHeading eyebrow="Latest drop" title="New Arrivals" linkTo="/shop?sort=newest" linkLabel="View all" />
      {loading ? <ProductSkeletonGrid /> : items.length === 0 ? (
        <EmptyState title="Nothing new yet" message="New pieces are on the way." actionLabel="Browse the shop" actionTo="/shop" />
      ) : <ProductGrid products={items} />}
      <div className="mt-10 sm:hidden"><Button to="/shop?sort=newest" variant="outline" className="w-full">View all</Button></div>
    </section>
  );
}

