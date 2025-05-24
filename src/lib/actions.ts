'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addProduct as dbAddProduct, updateProduct as dbUpdateProduct, deleteProduct as dbDeleteProduct, getProductById as dbGetProductById, mockProductsDB } from './data';
import type { Product } from './types';
import { generateJewelryDescription, type GenerateJewelryDescriptionInput } from '@/ai/flows/generate-jewelry-description';


// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
  material: z.string().min(1, 'Material is required'),
  gemstones: z.string().min(1, 'Gemstones are required'),
  style: z.string().min(1, 'Style is required'),
  occasion: z.string().min(1, 'Occasion is required'),
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
  product?: Product;
};

export async function addProductAction(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = productSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add product. Please check the errors below.',
    };
  }

  try {
    dbAddProduct(validatedFields.data);
  } catch (error) {
    return { message: 'Database Error: Failed to create product.', errors: { _form: ['Database error.'] } };
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products'); // Or return a success state to show toast
}

export async function updateProductAction(id: string, prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = productSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update product. Please check the errors below.',
    };
  }

  try {
    const updatedProduct = dbUpdateProduct(id, validatedFields.data);
    if (!updatedProduct) {
      return { message: 'Database Error: Failed to update product. Product not found.', errors: { _form: ['Product not found.'] } };
    }
  } catch (error) {
    return { message: 'Database Error: Failed to update product.', errors: { _form: ['Database error.'] } };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  redirect('/admin/products'); // Or return a success state
}

export async function deleteProductAction(id: string): Promise<{ message?: string, success?: boolean }> {
  try {
    const success = dbDeleteProduct(id);
    if (!success) {
        return { message: 'Failed to delete product. Product not found.' };
    }
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { message: 'Product deleted successfully.', success: true };
  } catch (error) {
    return { message: 'Database Error: Failed to delete product.' };
  }
}

export async function getProductAction(id: string): Promise<Product | null> {
  // In a real app, this would fetch from a database
  // For now, using the mock data directly
  const product = mockProductsDB.find(p => p.id === id);
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
