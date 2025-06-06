
import { getAllProducts } from '@/lib/data'; // Use the getter function
import { ProductsTable } from '@/components/admin/products-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Manage Products - Gleam Gallery Admin',
  description: 'View, add, edit, and delete jewelry products.',
};

export default async function AdminProductsPage() {
  // Fetch products using the getter function.
  // This ensures we get the current state of the mutable products array from data.ts.
  const productsForTable = getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair-display font-bold text-primary">Manage Products</h1>
        <Link href="/admin/products/new" passHref>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>
      <ProductsTable products={productsForTable} />
    </div>
  );
}
