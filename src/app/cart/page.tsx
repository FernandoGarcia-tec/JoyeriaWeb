'use client';

import { useCart } from '@/contexts/cart-context';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, CreditCard, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    // In a real app, this would redirect to a checkout process or API call
    toast({
      title: "Checkout Initiated",
      description: "Thank you for your order! (This is a demo checkout)",
    });
    clearCart(); // Clears the cart after "checkout"
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-playfair-display font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-foreground/70 mb-8">
          Looks like you haven't added any exquisite pieces to your cart yet.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-5 w-5" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-playfair-display font-bold text-primary text-center">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1 sticky top-24 p-6 bg-card rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-playfair-display font-semibold text-primary">Order Summary</h2>
          
          <div className="space-y-2 text-md">
            <div className="flex justify-between">
              <span className="text-foreground/80">Total Items:</span>
              <span className="font-medium text-foreground">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">Subtotal:</span>
              <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">Shipping:</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-foreground/80">Total:</span>
            <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          
          <Button 
            onClick={handleCheckout} 
            size="lg" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
          </Button>

          <Button 
            onClick={clearCart} 
            variant="outline" 
            size="sm"
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
