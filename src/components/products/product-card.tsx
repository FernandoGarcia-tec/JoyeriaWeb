'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} passHref>
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
              data-ai-hint={`${product.category} ${product.material}`}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <Link href={`/products/${product.id}`} passHref>
          <CardTitle className="text-xl font-playfair-display text-primary group-hover:text-accent transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="mt-2 text-sm text-foreground/70">
          {product.material} - {product.gemstones}
        </CardDescription>
        <p className="mt-3 text-lg font-semibold text-accent">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
        <Link href={`/products/${product.id}`} passHref className="flex-1">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
        <Button 
          onClick={() => addItem(product)} 
          className="w-full flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
