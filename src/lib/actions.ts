// @ts-nocheck
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addProduct as dbAddProduct, updateProduct as dbUpdateProduct, deleteProduct as dbDeleteProduct, getProductById as dbGetProductById } from './data';
import type { Product } from './types';
import { generateJewelryDescription, type GenerateJewelryDescriptionInput } from '@/ai/flows/generate-jewelry-description';


// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  imageUrl: z.string().url('Image URL must be a valid URL. If uploading, this will be a Data URL.'), // Data URLs are valid URLs
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
    imageUrl?: string[]; // For errors related to the final image URL (e.g. from file processing)
    category?: string[];
    material?: string[];
    gemstones?: string[];
    style?: string[];
    occasion?: string[];
    _form?: string[]; // For general form errors or image file errors
  };
  product?: Partial<Product>; // To repopulate form on error
};

async function processImageUpload(imageFile: File | null): Promise<{ imageUrl?: string; error?: string }> {
  if (!imageFile || imageFile.size === 0) {
    return {}; // No file or empty file, no new URL, no error
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(imageFile.type)) {
    return { error: 'Invalid image file type. Please upload a JPG, PNG, GIF, WEBP.' };
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (imageFile.size > MAX_FILE_SIZE) {
    return { error: `Image file too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` };
  }

  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const dataUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    return { imageUrl: dataUrl };
  } catch (e) {
    console.error("Error processing image: ", e);
    return { error: 'Could not process image file.' };
  }
}


export async function addProductAction(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const rawFormValues: {[k:string]: any} = {};
  for (const [key, value] of formData.entries()) {
    if (key !== 'imageFile') {
        rawFormValues[key] = value;
    }
  }

  const imageFile = formData.get('imageFile') as File | null;
  const imageProcessResult = await processImageUpload(imageFile);

  if (imageProcessResult.error) {
    return {
      errors: { _form: [imageProcessResult.error], imageUrl: [imageProcessResult.error] }, // Also assign to imageUrl for specific field message if needed
      message: imageProcessResult.error,
      product: rawFormValues as Partial<Product>,
    };
  }

  let finalImageUrl = imageProcessResult.imageUrl || 'https://placehold.co/600x400.png'; // Default if no file uploaded

  const dataToValidate = {
    ...rawFormValues,
    price: parseFloat(rawFormValues.price as string), // Ensure Zod gets a number
    imageUrl: finalImageUrl,
  };
  
  const validatedFields = productSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add product. Please check the errors below.',
      product: { ...rawFormValues, imageUrl: finalImageUrl } as Partial<Product>, 
    };
  }

  try {
    dbAddProduct(validatedFields.data as Omit<Product, 'id'>);
  } catch (error) {
    return { 
        message: 'Database Error: Failed to create product.', 
        errors: { _form: ['Database error.'] },
        product: validatedFields.data,
    };
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { message: 'Product added successfully!', product: undefined, errors: undefined };
}

export async function updateProductAction(id: string, prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const existingProduct = dbGetProductById(id);
  if (!existingProduct) {
    return { message: 'Product not found for update.', errors: { _form: ['Product not found.'] }};
  }

  const rawFormValues: {[k:string]: any} = {};
  for (const [key, value] of formData.entries()) {
    if (key !== 'imageFile') {
        rawFormValues[key] = value;
    }
  }

  const imageFile = formData.get('imageFile') as File | null;
  const imageProcessResult = await processImageUpload(imageFile);

  if (imageProcessResult.error) {
    return {
      errors: { _form: [imageProcessResult.error], imageUrl: [imageProcessResult.error] },
      message: imageProcessResult.error,
      product: { ...rawFormValues, imageUrl: existingProduct.imageUrl } as Partial<Product>,
    };
  }

  let finalImageUrl = imageProcessResult.imageUrl || existingProduct.imageUrl; // Use new if provided, else existing

  const dataToValidate = {
    ...rawFormValues,
    price: parseFloat(rawFormValues.price as string),
    imageUrl: finalImageUrl,
  };

  const validatedFields = productSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update product. Please check the errors below.',
      product: { ...rawFormValues, imageUrl: existingProduct.imageUrl } as Partial<Product>,
    };
  }

  try {
    const updatedProduct = dbUpdateProduct(id, validatedFields.data);
    if (!updatedProduct) {
      return { 
          message: 'Database Error: Failed to update product. Product not found post-update.', 
          errors: { _form: ['Product not found after attempting update.'] },
          product: validatedFields.data,
        };
    }
  } catch (error) {
    return { 
        message: 'Database Error: Failed to update product.', 
        errors: { _form: ['Database error.'] },
        product: validatedFields.data,
    };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  return { message: 'Product updated successfully!', product: {...validatedFields.data, id }, errors: undefined }; // Return updated product data
}

export async function deleteProductAction(id: string): Promise<{ message?: string, success?: boolean }> {
  try {
    const success = dbDeleteProduct(id);
    if (!success) {
        return { message: 'Failed to delete product. Product not found.', success: false };
    }
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { message: 'Product deleted successfully.', success: true };
  } catch (error) {
    return { message: 'Database Error: Failed to delete product.', success: false };
  }
}

export async function getProductAction(id: string): Promise<Product | null> {
  const product = dbGetProductById(id);
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
