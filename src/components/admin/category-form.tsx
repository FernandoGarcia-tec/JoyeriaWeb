
// @ts-nocheck
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Category } from '@/lib/types';
import { addCategoryAction, updateCategoryAction, type CategoryFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
  category?: Category | null;
}

const initialState: CategoryFormState = { message: undefined, errors: {} };

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Category' : 'Add Category')}
    </Button>
  );
}

export function CategoryForm({ category }: CategoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);

  useEffect(() => {
    if (category?.imageUrl) {
      setImagePreview(category.imageUrl);
    } else if (!category) { // For new category form
      setImagePreview('https://placehold.co/400x300.png');
    }
  }, [category]);

  const action = category ? updateCategoryAction.bind(null, category.id) : addCategoryAction;
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message && !state.errors) { // Success message
      toast({
        title: category ? "Category Updated" : "Category Added",
        description: state.message,
      });
      if (!category || state.category === undefined) { // Successfully added new category or form reset state
         setImagePreview('https://placehold.co/400x300.png'); 
      } else if (category && state.category?.imageUrl) {
        setImagePreview(state.category.imageUrl);
      }
      // Redirect to categories list after successful add/update
      router.push('/admin/categories');

    } else if (state.message && state.errors) { // Error message
      if (state.errors._form) {
        toast({
          title: "Error",
          description: state.message || state.errors._form.join(', '),
          variant: "destructive",
        });
      }
    }
  }, [state, toast, category, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(category?.imageUrl || 'https://placehold.co/400x300.png');
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-playfair-display text-primary">
          {category ? 'Edit Category' : 'Add New Category'}
        </CardTitle>
        <CardDescription>
          {category ? `Update details for ${category.name}` : 'Fill in the details for the new category.'}
        </CardDescription>
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
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" name="name" defaultValue={category?.name || state.category?.name} required className="mt-1" />
            {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={category?.description || state.category?.description} required rows={3} className="mt-1" />
            {state.errors?.description && <p className="text-sm text-destructive mt-1">{state.errors.description.join(', ')}</p>}
          </div>
          
          <div>
            <Label htmlFor="imageFile">Category Image</Label>
            <Input 
              id="imageFile" 
              name="imageFile" 
              type="file" 
              accept="image/png, image/jpeg, image/gif, image/webp" 
              className="mt-1 file:text-primary file:font-semibold file:bg-primary/10 file:border-primary/20 hover:file:bg-primary/20"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-4 relative w-full aspect-[4/3] rounded-md overflow-hidden border">
                <Image src={imagePreview} alt="Image Preview" layout="fill" objectFit="contain" data-ai-hint="category image preview"/>
              </div>
            )}
            {state.errors?.imageUrl && <p className="text-sm text-destructive mt-1">{state.errors.imageUrl.join(', ')}</p>}
          </div>
          
          <CardFooter className="p-0 pt-4">
            <SubmitButton isEditing={!!category} />
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
