
'use client';

import type { Category } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition, useEffect } from 'react';
// import { deleteCategoryAction } from '@/lib/actions'; // To be implemented

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      // const result = await deleteCategoryAction(id); // Implement this action
      // if (result.success) {
      //   setCategories(prev => prev.filter(c => c.id !== id));
      //   toast({ title: 'Category Deleted', description: result.message });
      // } else {
      //   toast({ title: 'Error Deleting Category', description: result.message, variant: 'destructive' });
      // }
      toast({
        title: 'Deletion Not Implemented',
        description: 'Category deletion functionality is coming soon.',
      });
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <Table>
        <TableCaption>A list of your product categories.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
            <TableHead className="text-center w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="relative w-16 h-12 rounded-md overflow-hidden">
                  <Image 
                    src={category.imageUrl} 
                    alt={category.name} 
                    fill 
                    sizes="64px" 
                    className="object-cover"
                    data-ai-hint={`${category.name.toLowerCase()} category icon`}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-primary">{category.name}</TableCell>
              <TableCell className="text-sm text-foreground/80">{category.description}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Link href={`/admin/categories/${category.id}/edit`} passHref>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Edit category"
                      disabled={isPending}
                    >
                      <Edit className="h-4 w-4 text-yellow-500" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Delete category" disabled={isPending}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the category
                          "{category.name}". (Deletion not yet implemented)
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
                          disabled={isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {categories.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No categories found.</p>
      )}
    </div>
  );
}
