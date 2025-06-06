// @ts-nocheck
'use client';

import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories as allCategories, getMaterials } from '@/lib/data';
import type { Product } from '@/lib/types';
import { addProductAction, updateProductAction, ProductFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';


interface ProductFormProps {
  product?: Product | null; // Product for editing, null/undefined for creating
}

const initialState: ProductFormState = { message: undefined, errors: {} };

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
    </Button>
  );
}

export function ProductForm({ product }: ProductFormProps) {
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [productMaterials, setProductMaterials] = useState<string[]>([]);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);

  useEffect(() => {
    setProductCategories(allCategories.map(c => c.name));
    setProductMaterials(getMaterials());
    if (product?.imageUrl) {
      setImagePreview(product.imageUrl);
    } else if (!product) {
      setImagePreview('https://placehold.co/600x400.png'); // Default for new products
    }
  }, [product]);

  const action = product ? updateProductAction.bind(null, product.id) : addProductAction;
  const [state, formAction] = useActionState(action, initialState); 

  useEffect(() => {
    if (state.message && !state.errors) { // Success message
      toast({
        title: product ? "Product Updated" : "Product Added",
        description: state.message,
      });
      if (!product && state.product === undefined) { // Successfully added new product
        // Reset form fields visually for new product form if needed, though useActionState handles state reset
        setImagePreview('https://placehold.co/600x400.png');
      } else if (product && state.product?.imageUrl) {
        setImagePreview(state.product.imageUrl);
      }
    } else if (state.message && state.errors) { // Error message
        // No specific toast for field errors, alert handles it. Toast for _form errors.
        if (state.errors._form) {
            toast({
                title: "Error",
                description: state.message || state.errors._form.join(', '),
                variant: "destructive",
            });
        }
    }
  }, [state, toast, product]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(product?.imageUrl || 'https://placehold.co/600x400.png'); // Revert to original or placeholder
    }
  };


  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-playfair-display text-primary">{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
        <CardDescription>{product ? `Update details for ${product.name}` : 'Fill in the details for the new jewelry item.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state.message && state.errors && Object.keys(state.errors).length > 0 && !state.errors._form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Input Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {state.errors?._form && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Form Error</AlertTitle>
                <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" defaultValue={product?.name || state.product?.name} required className="mt-1" />
            {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product?.description || state.product?.description} required rows={4} className="mt-1" />
            {state.errors?.description && <p className="text-sm text-destructive mt-1">{state.errors.description.join(', ')}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price || state.product?.price} required className="mt-1" />
              {state.errors?.price && <p className="text-sm text-destructive mt-1">{state.errors.price.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={product?.category || state.product?.category} required>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              {state.errors?.category && <p className="text-sm text-destructive mt-1">{state.errors.category.join(', ')}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="imageFile">Product Image</Label>
            <Input 
              id="imageFile" 
              name="imageFile" 
              type="file" 
              accept="image/png, image/jpeg, image/gif, image/webp" 
              className="mt-1 file:text-primary file:font-semibold file:bg-primary/10 file:border-primary/20 hover:file:bg-primary/20"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden border">
                <Image src={imagePreview} alt="Image Preview" layout="fill" objectFit="contain" data-ai-hint="product preview" />
              </div>
            )}
            {state.errors?.imageUrl && <p className="text-sm text-destructive mt-1">{state.errors.imageUrl.join(', ')}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="material">Material</Label>
              <Select name="material" defaultValue={product?.material || state.product?.material} required>
                <SelectTrigger id="material" className="mt-1">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold', ...productMaterials.filter(m => !['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold'].includes(m))].map(mat => <SelectItem key={mat} value={mat}>{mat}</SelectItem>)}
                </SelectContent>
              </Select>
              {state.errors?.material && <p className="text-sm text-destructive mt-1">{state.errors.material.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="gemstones">Gemstones (comma-separated)</Label>
              <Input id="gemstones" name="gemstones" defaultValue={product?.gemstones || state.product?.gemstones} required className="mt-1" />
              {state.errors?.gemstones && <p className="text-sm text-destructive mt-1">{state.errors.gemstones.join(', ')}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="style">Style</Label>
              <Input id="style" name="style" defaultValue={product?.style || state.product?.style} required className="mt-1" />
              {state.errors?.style && <p className="text-sm text-destructive mt-1">{state.errors.style.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="occasion">Occasion</Label>
              <Input id="occasion" name="occasion" defaultValue={product?.occasion || state.product?.occasion} required className="mt-1" />
              {state.errors?.occasion && <p className="text-sm text-destructive mt-1">{state.errors.occasion.join(', ')}</p>}
            </div>
          </div>
          
          <SubmitButton isEditing={!!product} />
        </form>
      </CardContent>
    </Card>
  );
}
