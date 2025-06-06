
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Tag, Gem, Star, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface ProductDetailDisplayProps {
  product: Product;
}

export function ProductDetailDisplay({ product: initialProduct }: ProductDetailDisplayProps) {
  const { addItem } = useCart();
  // Use state to manage product details if they can be updated client-side,
  // or simply use initialProduct directly if it's only updated by server.
  const [product, setProduct] = useState<Product>(initialProduct);
  const [quantity, setQuantity] = useState(1);

  // Update the local product state if the prop changes (e.g., after revalidation)
  useEffect(() => {
    setProduct(initialProduct);
    setQuantity(1); // Reset quantity if product identity changes
  }, [initialProduct]);


  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

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
                    // Allow user to clear input, set to 1 if they blur while empty or invalid
                    setQuantity(NaN); // Use NaN or similar to indicate temp empty state
                }
              }}
              onBlur={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) {
                  setQuantity(1);
                  val = 1; // ensure val is up-to-date for addItem
                } else {
                  setQuantity(val);
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
            onClick={() => {
                // Ensure quantity is valid before adding to cart, especially if it was NaN
                const currentQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
                if (isNaN(quantity) || quantity < 1) setQuantity(1); // Reset input visually too
                addItem(product, currentQuantity);
            }}
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
