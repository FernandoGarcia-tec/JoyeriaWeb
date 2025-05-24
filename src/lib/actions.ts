// @ts-nocheck
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addProduct as dbAddProduct, updateProduct as dbUpdateProduct, deleteProduct as dbDeleteProduct } from './data'; // Removed getProductById as it's not directly used by actions here
import type { Product } from './types';
import { generateJewelryDescription, type GenerateJewelryDescriptionInput } from '@/ai/flows/generate-jewelry-description';


// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  imageUrl: z.string().url('Image URL must be a valid URL.'),
  category: z.string().min(1, 'Category is required.'),
  material: z.string().min(1, 'Material is required.'),
  gemstones: z.string().min(1, 'Gemstones are required.'),
  style: z.string().min(1, 'Style is required.'),
  occasion: z.string().min(1, 'Occasion is required.'),
});

export type ProductFormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    imageUrl?: string[];
    category?: string[];
    material?: string[];
    gemstones?: string[];
    style?: string[];
    occasion?: string[];
    _form?: string[]; // For general form errors
  };
  product?: Partial<Product>; // To repopulate form on error
};

export async function addProductAction(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = productSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add product. Please check the errors below.',
      product: rawFormData as Partial<Product>, // Pass back raw data to repopulate
    };
  }

  try {
    dbAddProduct(validatedFields.data as Omit<Product, 'id'>); // Cast as Omit<Product, 'id'>
  } catch (error) {
    return { 
        message: 'Database Error: Failed to create product.', 
        errors: { _form: ['Database error.'] },
        product: validatedFields.data // Pass back validated data
    };
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  // Instead of redirecting, return a success state to allow form reset and toast display
  // The redirect will be handled by the component after showing the toast
  return { message: 'Product added successfully!', product: undefined, errors: undefined };
  // redirect('/admin/products'); 
}

export async function updateProductAction(id: string, prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = productSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update product. Please check the errors below.',
      product: rawFormData as Partial<Product>, // Pass back raw data
    };
  }

  try {
    const updatedProduct = dbUpdateProduct(id, validatedFields.data);
    if (!updatedProduct) {
      return { 
          message: 'Database Error: Failed to update product. Product not found.', 
          errors: { _form: ['Product not found.'] },
          product: validatedFields.data // Pass back validated data
        };
    }
  } catch (error) {
    return { 
        message: 'Database Error: Failed to update product.', 
        errors: { _form: ['Database error.'] },
        product: validatedFields.data // Pass back validated data
    };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  // Instead of redirecting, return a success state
  return { message: 'Product updated successfully!', product: undefined, errors: undefined };
  // redirect('/admin/products');
}

export async function deleteProductAction(id: string): Promise<{ message?: string, success?: boolean }> {
  try {
    const success = dbDeleteProduct(id);
    if (!success) {
        return { message: 'Failed to delete product. Product not found.', success: false };
    }
    revalidatePath('/admin/products');
    revalidatePath('/products'); // Revalidate public products page as well
    return { message: 'Product deleted successfully.', success: true };
  } catch (error) {
    return { message: 'Database Error: Failed to delete product.', success: false };
  }
}

// This action is for fetching product details for the edit page (server-side)
// It's separate from the DB functions in data.ts as it's an async server action
// and can be called directly from server components.
import { getProductById as dbGetProductById } from './data'; 
export async function getProductAction(id: string): Promise<Product | null> {
  const product = dbGetProductById(id); // Using the synchronous version from data.ts
  return product || null;
}


// AI Description Generation
const aiDescriptionSchema = z.object({
  name: z.string().min(1, "Name is required."),
  material: z.string().min(1, "Material is required."),
  gemstones: z.string().min(1, "Gemstones are required."),
  style: z.string().min(1, "Style is required."),
  occasion: z.string().min(1, "Occasion is required."),
});

export type AiDescriptionFormState = {
  description?: string;
  input?: GenerateJewelryDescriptionInput;
  message?: string;
  errors?: {
    name?: string[];
    material?: string[];
    gemstones?: string[];
    style?: string[];
    occasion?: string[];
    _form?: string[];
  };
};

export async function generateDescriptionAction(prevState: AiDescriptionFormState, formData: FormData): Promise<AiDescriptionFormState> {
  const rawFormData = Object.fromEntries(formData.entries()) as GenerateJewelryDescriptionInput;
  const validatedFields = aiDescriptionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input for AI description.',
      input: rawFormData,
    };
  }
  
  try {
    const result = await generateJewelryDescription(validatedFields.data);
    return {
      description: result.description,
      message: 'Description generated successfully!',
      input: validatedFields.data,
    };
  } catch (error) {
    console.error("AI Description generation error:", error);
    return {
      message: 'Failed to generate AI description. Please try again.',
      errors: { _form: ['AI service error.'] },
      input: validatedFields.data,
    };
  }
}
