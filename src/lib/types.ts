
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

// User types for authentication
export interface User {
  id: string;
  username: string;
  passwordHash: string; // In a real app, this would be a securely hashed password
  role: 'user' | 'admin';
}

export interface AuthUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
}
