import { mockProductsDB } from '@/lib/data'; // Using the mutable mock DB for this page
import { ProductsTable } from '@/components/admin/products-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Manage Products - Gleam Gallery Admin',
  description: 'View, add, edit, and delete jewelry products.',
};

export default async function AdminProductsPage() {
  // In a real app, products would be fetched from a database.
  // We use mockProductsDB here as it can be mutated by server actions for demo purposes.
  // For RSC, this will show the current state of mockProductsDB at build/request time.
  // Client component ProductsTable will handle dynamic updates via useState if needed for client-side interactions after delete.
  const products = [...mockProductsDB]; // Create a shallow copy to pass to client component

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
      <ProductsTable products={products} />
    </div>
  );
}
