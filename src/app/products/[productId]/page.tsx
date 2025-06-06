
import { getProductById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductDetailDisplay } from '@/components/products/product-detail-display';
import type { Metadata, ResolvingMetadata } from 'next';

interface ProductDetailPageProps {
  params: { productId: string };
}

export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = getProductById(params.productId);

  if (!product) {
    return {
      title: 'Product Not Found - Gleam Gallery',
      description: 'The product you are looking for does not exist.',
    };
  }

  return {
    title: `${product.name} - Gleam Gallery`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.imageUrl,
          width: 600,
          height: 400,
          alt: product.name,
        },
      ],
    },
  };
}


export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = params.productId;
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailDisplay product={product} />;
}

