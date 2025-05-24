
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // Category name or ID
  material: string;
  gemstones: string; // Comma-separated list
  style: string;
  occasion: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}
