
'use client';

import type { CartItem, Product } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Function to generate a dynamic storage key
const getCartStorageKey = (userId: string | null | undefined): string => {
  if (userId) {
    return `gleamGalleryCart_${userId}`;
  }
  return 'gleamGalleryCart_guest'; // Key for guest users or when auth is loading
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { currentUser, isLoading: isAuthLoading } = useAuth(); // Get currentUser and auth loading state

  // Effect to load cart when currentUser changes or on initial auth resolution
  useEffect(() => {
    if (isAuthLoading) {
      // Still waiting for auth status to be determined.
      // Optionally, load guest cart here or wait. For now, let's wait to avoid flash of guest cart if user is logged in.
      // Or, could load guest cart and then it will be replaced if user is found.
      // Let's load guest cart by default and let it be overwritten if user logs in.
      const guestKey = getCartStorageKey(null);
      const storedGuestCart = localStorage.getItem(guestKey);
      if (storedGuestCart) {
        try {
          setItems(JSON.parse(storedGuestCart));
        } catch (e) {
          console.error("Failed to parse guest cart from localStorage on init:", e);
          localStorage.removeItem(guestKey);
        }
      } else {
        setItems([]);
      }
      return;
    }

    const storageKey = getCartStorageKey(currentUser?.id);
    const storedCart = localStorage.getItem(storageKey);

    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (e) {
        console.error(`Failed to parse cart from localStorage for key ${storageKey}:`, e);
        setItems([]);
        localStorage.removeItem(storageKey); // Clear corrupted data
      }
    } else {
      setItems([]); // Clear items if no cart found for this user/guest, or on switch
    }
  }, [currentUser, isAuthLoading]);

  // Effect to save cart when items or currentUser changes
  useEffect(() => {
    // Don't save if auth is still loading, as currentUser might not be stable yet
    if (isAuthLoading && currentUser === undefined) { 
        // If auth is loading and user is truly undefined (not null),
        // we might be in a transient state. Let's wait for auth to settle.
        // However, if items change due to user action, we probably should save to guest cart.
        // This logic can be tricky. For now, let's ensure we use the correct key.
    }

    const storageKey = getCartStorageKey(currentUser?.id);

    if (items.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } else {
      // If items array is empty, remove its corresponding key from localStorage.
      localStorage.removeItem(storageKey);
    }
  }, [items, currentUser, isAuthLoading]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Item Removed",
      description: `Item has been removed from your cart.`,
      variant: "destructive"
    });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    // The useEffect for saving will handle removing it from localStorage based on current user
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItemQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
