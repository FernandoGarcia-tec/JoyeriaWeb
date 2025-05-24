
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { products as allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Tag, Gem, Star, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading, null for not found
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    if (productId) {
      const foundProduct = allProducts.find((p) => p.id === productId);
      setProduct(foundProduct || null);
      setQuantity(1); // Reset quantity when product changes
    }
  }, [productId]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (product === undefined) { // Loading state
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-destructive mb-4">Product Not Found</h1>
        <p className="text-lg text-foreground/70">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            data-ai-hint={`${product.category} ${product.material} detail`}
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-playfair-display font-bold text-primary">
            {product.name}
          </h1>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm px-3 py-1">{product.category}</Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">{product.style}</Badge>
          </div>

          <p className="text-3xl font-semibold text-accent">${product.price.toFixed(2)}</p>
          
          <p className="text-lg text-foreground/80 leading-relaxed">
            {product.description}
          </p>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center">
              <Gem className="h-5 w-5 mr-3 text-primary" />
              <span className="font-medium text-foreground/90">Material:</span>
              <span className="ml-2 text-foreground/70">{product.material}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-3 text-primary" />
              <span className="font-medium text-foreground/90">Gemstones:</span>
              <span className="ml-2 text-foreground/70">{product.gemstones}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-3 text-primary" />
              <span className="font-medium text-foreground/90">Occasion:</span>
              <span className="ml-2 text-foreground/70">{product.occasion}</span>
            </div>
          </div>
          
          <Separator />

          <div className="flex items-center space-x-3 my-4">
            <span className="font-medium text-foreground/90">Quantity:</span>
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                    handleQuantityChange(val);
                } else if (e.target.value === "") {
                    setQuantity(1); // Or some other default/handling for empty input
                }
              }}
              onBlur={(e) => { // Ensure quantity is at least 1 on blur
                if(parseInt(e.target.value, 10) < 1 || isNaN(parseInt(e.target.value, 10))) {
                  setQuantity(1);
                }
              }}
              min="1"
              className="w-16 h-10 text-center"
              aria-label="Item quantity"
            />
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)} aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => addItem(product, quantity)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105"
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>

          <div className="mt-6 p-4 border border-border rounded-lg bg-muted/50">
             <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                <span>Authentic Materials & Craftsmanship Guaranteed</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
