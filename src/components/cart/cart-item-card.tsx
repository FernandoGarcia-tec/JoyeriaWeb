'use client';

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-border rounded-lg shadow-sm bg-card">
      <Link href={`/products/${item.id}`} passHref>
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="128px"
            className="object-cover"
            data-ai-hint={`${item.category} ${item.material}`}
          />
        </div>
      </Link>

      <div className="flex-grow text-center sm:text-left">
        <Link href={`/products/${item.id}`} passHref>
          <h3 className="text-lg font-playfair-display font-semibold text-primary hover:text-accent transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{item.material}</p>
        <p className="text-md font-semibold text-accent mt-1 sm:mt-0">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <MinusCircle className="h-5 w-5" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          className="w-16 text-center h-9"
          aria-label="Item quantity"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-lg font-semibold text-primary w-24 text-center sm:text-right mt-2 sm:mt-0">
        ${(item.price * item.quantity).toFixed(2)}
      </p>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(item.id)}
        className="text-destructive hover:text-destructive/80 mt-2 sm:mt-0"
        aria-label="Remove item"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
