
import type { Product, Category } from './types';

export const initialCategoriesData: Category[] = [
  {
    id: 'cat1',
    name: 'Necklaces',
    imageUrl: 'https://placehold.co/400x300.png',
    description: 'Adorn your neck with our stunning collection of necklaces, from delicate pendants to statement pieces.',
  },
  {
    id: 'cat2',
    name: 'Rings',
    imageUrl: 'https://placehold.co/400x300.png',
    description: 'Find the perfect ring to symbolize love, commitment, or simply to elevate your style.',
  },
  {
    id: 'cat3',
    name: 'Earrings',
    imageUrl: 'https://placehold.co/400x300.png',
    description: 'From elegant studs to glamorous drops, our earrings are designed to make you shine.',
  },
  {
    id: 'cat4',
    name: 'Bracelets',
    imageUrl: 'https://placehold.co/400x300.png',
    description: 'Grace your wrist with our exquisite bracelets, perfect for any occasion.',
  },
];

// Use globalThis for categories array
declare global {
  // eslint-disable-next-line no-var
  var __categories_store__: Category[];
}

if (process.env.NODE_ENV === 'production') {
  globalThis.__categories_store__ = [...initialCategoriesData];
} else {
  // In development, re-initialize if it's undefined OR if it's defined but empty (and shouldn't be, i.e. initial data exists).
  if (!globalThis.__categories_store__ || (globalThis.__categories_store__ && globalThis.__categories_store__.length === 0 && initialCategoriesData.length > 0)) {
    globalThis.__categories_store__ = [...initialCategoriesData];
  }
}
const categoriesStore = globalThis.__categories_store__!;


export const getAllCategories = (): Category[] => {
  // Ensure store is populated if accessed and found empty in dev
  if (process.env.NODE_ENV !== 'production' && categoriesStore.length === 0 && initialCategoriesData.length > 0) {
    categoriesStore.push(...initialCategoriesData.filter(ic => !categoriesStore.find(cs => cs.id === ic.id)));
  }
  return [...categoriesStore];
};

export const getCategoryById = (id: string): Category | undefined => {
  // Ensure store is populated if accessed and found empty in dev (helps if getById is first access)
  if (process.env.NODE_ENV !== 'production' && categoriesStore.length === 0 && initialCategoriesData.length > 0) {
     categoriesStore.push(...initialCategoriesData.filter(ic => !categoriesStore.find(cs => cs.id === ic.id)));
  }
  const category = categoriesStore.find(c => c.id === id);
  return category ? { ...category } : undefined;
};

export const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
  const newCategory: Category = { ...categoryData, id: `cat${Date.now()}` };
  categoriesStore.push(newCategory);
  return { ...newCategory };
};

export const updateCategory = (id: string, updates: Partial<Category>): Category | undefined => {
  const categoryIndex = categoriesStore.findIndex(c => c.id === id);
  if (categoryIndex === -1) return undefined;
  categoriesStore[categoryIndex] = { ...categoriesStore[categoryIndex], ...updates };
  return { ...categoriesStore[categoryIndex] };
};

export const deleteCategory = (id: string): boolean => {
  const categoryIndex = categoriesStore.findIndex(c => c.id === id);
  if (categoryIndex === -1) return false;
  categoriesStore.splice(categoryIndex, 1);
  return true;
};


// This is the initial static data for products.
const initialProductsData: Product[] = [
  {
    id: 'prod1',
    name: 'Seraphina Diamond Necklace',
    description: 'A breathtaking platinum necklace featuring a radiant-cut diamond, surrounded by a halo of smaller gems. Perfect for gala events.',
    price: 2500,
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Rings',
    material: 'Gold',
    gemstones: 'None',
    style: 'Classic',
    occasion: 'Everyday',
  },
];

// Use globalThis for the products array to ensure singleton behavior in dev
declare global {
  // eslint-disable-next-line no-var
  var __products_store__: Product[];
}

if (process.env.NODE_ENV === 'production') {
  globalThis.__products_store__ = [...initialProductsData];
} else {
  // In development, re-initialize if it's undefined OR if it's defined but empty (and shouldn't be).
  if (!globalThis.__products_store__ || (globalThis.__products_store__ && globalThis.__products_store__.length === 0 && initialProductsData.length > 0)) {
    globalThis.__products_store__ = [...initialProductsData];
  }
}
const productsStore = globalThis.__products_store__!;


export const getAllProducts = (): Product[] => {
  // Ensure store is populated if accessed and found empty in dev
  if (process.env.NODE_ENV !== 'production' && productsStore.length === 0 && initialProductsData.length > 0) {
     productsStore.push(...initialProductsData.filter(ip => !productsStore.find(ps => ps.id === ip.id)));
  }
  return [...productsStore];
};

export const getProductById = (id: string): Product | undefined => {
  // Ensure store is populated if accessed and found empty in dev
  if (process.env.NODE_ENV !== 'production' && productsStore.length === 0 && initialProductsData.length > 0) {
    productsStore.push(...initialProductsData.filter(ip => !productsStore.find(ps => ps.id === ip.id)));
  }
  const product = productsStore.find(p => p.id === id);
  return product ? { ...product } : undefined;
};

export const addProduct = (productData: Omit<Product, 'id'>): Product => {
  const newProduct: Product = { ...productData, id: `prod${Date.now()}` };
  productsStore.push(newProduct);
  return { ...newProduct };
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | undefined => {
  const productIndex = productsStore.findIndex(p => p.id === id);
  if (productIndex === -1) return undefined;
  productsStore[productIndex] = { ...productsStore[productIndex], ...updates };
  return { ...productsStore[productIndex] };
};

export const deleteProduct = (id: string): boolean => {
  const productIndex = productsStore.findIndex(p => p.id === id);
  if (productIndex === -1) return false;
  productsStore.splice(productIndex, 1);
  return true;
};

export const getMaterials = (): string[] => {
  // Ensure store is populated for this calculation
  if (process.env.NODE_ENV !== 'production' && productsStore.length === 0 && initialProductsData.length > 0) {
    productsStore.push(...initialProductsData.filter(ip => !productsStore.find(ps => ps.id === ip.id)));
  }
  const materials = new Set(productsStore.map(p => p.material));
  return Array.from(materials);
};

// Export categories array directly for use on the homepage and other places
// This will now use the potentially re-initialized categoriesStore
export const categories: Category[] = getAllCategories();
