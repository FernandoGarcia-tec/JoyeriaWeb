import { ProductForm } from '@/components/admin/product-form';

export const metadata = {
  title: 'Add New Product - Gleam Gallery Admin',
  description: 'Add a new jewelry item to the Gleam Gallery catalog.',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <ProductForm />
    </div>
  );
}
