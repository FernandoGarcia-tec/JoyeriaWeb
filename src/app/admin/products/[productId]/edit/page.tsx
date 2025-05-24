import { ProductForm } from '@/components/admin/product-form';
import { getProductAction } from '@/lib/actions'; // Using server action to fetch for RSC
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Product - Gleam Gallery Admin',
  description: 'Edit an existing jewelry item in the Gleam Gallery catalog.',
};

interface EditProductPageProps {
  params: { productId: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = params.productId;
  const product = await getProductAction(productId); // Fetch product data on server

  if (!product) {
    notFound(); // Or redirect to a "not found" page specifically for admin
  }

  return (
    <div className="space-y-6">
      <ProductForm product={product} />
    </div>
  );
}
