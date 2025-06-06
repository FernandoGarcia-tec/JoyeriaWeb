
import { getAllProducts } from '@/lib/data'; // Use the getter function
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import type { Product } from '@/lib/types';

export const metadata = {
  title: 'Our Products - Gleam Gallery',
  description: 'Browse our exquisite collection of handcrafted jewelry.',
};

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    material?: string;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, material } = searchParams || {};

  // Fetch all products using the getter function
  const allProducts = getAllProducts();
  let filteredProducts: Product[] = allProducts;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (material) {
    filteredProducts = filteredProducts.filter(
      (product) => product.material.toLowerCase() === material.toLowerCase()
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-playfair-display font-bold text-primary text-center">
        Our Collection
      </h1>
      
      <ProductFilters />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-foreground/70">No products match your current filters.</p>
          <p className="text-foreground/70">Try adjusting your selection or viewing all products.</p>
        </div>
      )}
    </div>
  );
}
