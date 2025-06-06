
import type { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Necklaces',
    imageUrl: 'https://placehold.co/400x300/E6E6FA/9400D3?text=Necklace',
    description: 'Adorn your neck with our stunning collection of necklaces, from delicate pendants to statement pieces.',
  },
  {
    id: 'cat2',
    name: 'Rings',
    imageUrl: 'https://placehold.co/400x300/E6E6FA/9400D3?text=Ring',
    description: 'Find the perfect ring to symbolize love, commitment, or simply to elevate your style.',
  },
  {
    id: 'cat3',
    name: 'Earrings',
    imageUrl: 'https://placehold.co/400x300/E6E6FA/9400D3?text=Earrings',
    description: 'From elegant studs to glamorous drops, our earrings are designed to make you shine.',
  },
  {
    id: 'cat4',
    name: 'Bracelets',
    imageUrl: 'https://placehold.co/400x300/E6E6FA/9400D3?text=Bracelet',
    description: 'Grace your wrist with our exquisite bracelets, perfect for any occasion.',
  },
];

// This is the initial static data for products.
const initialProductsData: Product[] = [
  {
    id: 'prod1',
    name: 'Seraphina Diamond Necklace',
    description: 'A breathtaking platinum necklace featuring a radiant-cut diamond, surrounded by a halo of smaller gems. Perfect for gala events.',
    price: 2500,
    imageUrl: 'https://placehold.co/600x400/E6E6FA/4B0082?text=Diamond+Necklace',
    category: 'Necklaces',
    material: 'Platinum',
    gemstones: 'Diamond, Sapphire',
    style: 'Classic',
    occasion: 'Gala',
  },
  {
    id: 'prod2',
    name: 'Azure Dream Ring',
    description: 'A mesmerizing 18k gold ring showcasing a stunning oval sapphire, flanked by two pear-shaped diamonds. Ideal for engagements or anniversaries.',
    price: 1800,
    imageUrl: 'https://placehold.co/600x400/E6E6FA/4B0082?text=Sapphire+Ring',
    category: 'Rings',
    material: 'Gold',
    gemstones: 'Sapphire, Diamond',
    style: 'Vintage',
    occasion: 'Engagement',
  },
  {
    id: 'prod3',
    name: 'Emerald Envy Earrings',
    description: 'Elegant drop earrings crafted from white gold, adorned with vibrant emeralds and sparkling diamond accents. Perfect for adding a touch of color to your evening wear.',
    price: 1200,
    imageUrl: 'https://placehold.co/600x400/E6E6FA/4B0082?text=Emerald+Earrings',
    category: 'Earrings',
    material: 'White Gold',
    gemstones: 'Emerald, Diamond',
    style: 'Elegant',
    occasion: 'Evening Wear',
  },
  {
    id: 'prod4',
    name: 'Ruby Radiance Bracelet',
    description: 'A stunning rose gold bracelet featuring a line of brilliant rubies, perfect for a bold statement.',
    price: 2200,
    imageUrl: 'https://placehold.co/600x400/E6E6FA/4B0082?text=Ruby+Bracelet',
    category: 'Bracelets',
    material: 'Rose Gold',
    gemstones: 'Ruby',
    style: 'Modern',
    occasion: 'Party',
  },
  {
    id: 'prod5',
    name: 'Celestial Pearl Pendant',
    description: 'A delicate silver chain holding a luminous freshwater pearl, perfect for everyday elegance.',
    price: 350,
    imageUrl: 'https://placehold.co/600x400/E6E6FA/4B0082?text=Pearl+Pendant',
    category: 'Necklaces',
    material: 'Silver',
    gemstones: 'Pearl',
    style: 'Minimalist',
    occasion: 'Everyday',
  },
  {
    id: 'prod6',
    name: 'Golden Knot Ring',
    description: 'A simple yet elegant 14k gold ring designed in a timeless knot motif. Suitable for daily wear.',
    price: 450,
    imageUrl: 'https://placehold.co/600x400/E6E6FA/4B0082?text=Gold+Knot+Ring',
    category: 'Rings',
    material: 'Gold',
    gemstones: 'None',
    style: 'Classic',
    occasion: 'Everyday',
  },
];

// This `products` array is the single source of truth. It's mutable and exported.
// All parts of the application (admin and public) will use this array.
export let products: Product[] = [...initialProductsData];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const addProduct = (productData: Omit<Product, 'id'>): Product => {
  const newProduct: Product = { ...productData, id: `prod${Date.now()}` };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | undefined => {
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) return undefined;
  products[productIndex] = { ...products[productIndex], ...updates };
  return products[productIndex];
};

export const deleteProduct = (id: string): boolean => {
  const initialLength = products.length;
  // Reassign `products` to a new filtered array.
  // This ensures that modules get the new reference upon revalidation.
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
};

export const getMaterials = (): string[] => {
  const materials = new Set(products.map(p => p.material));
  return Array.from(materials);
};
