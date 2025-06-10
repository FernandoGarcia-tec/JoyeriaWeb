
import { CategoryForm } from '@/components/admin/category-form';
import { getCategoryAction } from '@/lib/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface EditCategoryPageProps {
  params: { categoryId: string };
}

export async function generateMetadata({ params }: EditCategoryPageProps): Promise<Metadata> {
  const category = await getCategoryAction(params.categoryId);
  return {
    title: category ? `Edit ${category.name} - Gleam Gallery Admin` : 'Edit Category - Gleam Gallery Admin',
    description: `Edit the category details for ${category?.name || 'the selected category'}.`,
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categoryId = params.categoryId;
  const category = await getCategoryAction(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CategoryForm category={category} />
    </div>
  );
}
