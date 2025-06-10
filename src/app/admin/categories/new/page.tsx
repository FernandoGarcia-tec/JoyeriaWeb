
import { CategoryForm } from '@/components/admin/category-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Category - Gleam Gallery Admin',
  description: 'Add a new category to Gleam Gallery.',
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <CategoryForm />
    </div>
  );
}
