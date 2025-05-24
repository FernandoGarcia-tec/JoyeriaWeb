'use client';

import type { Product } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import { deleteProductAction } from '@/lib/actions';
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
import { useState, useTransition } from 'react';

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState(initialProducts);


  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.success) {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
        toast({
          title: 'Product Deleted',
          description: result.message || 'The product has been successfully deleted.',
        });
      } else {
        toast({
          title: 'Error Deleting Product',
          description: result.message || 'There was an error deleting the product.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <Table>
        <TableCaption>A list of your jewelry products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Material</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image src={product.imageUrl} alt={product.name} fill sizes="48px" className="object-cover" data-ai-hint={`${product.category} small`} />
                </div>
              </TableCell>
              <TableCell className="font-medium text-primary">{product.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{product.category}</Badge>
              </TableCell>
              <TableCell>{product.material}</TableCell>
              <TableCell className="text-right text-accent font-semibold">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Link href={`/products/${product.id}`} passHref target="_blank">
                    <Button variant="ghost" size="icon" aria-label="View product">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`} passHref>
                    <Button variant="ghost" size="icon" aria-label="Edit product">
                      <Edit className="h-4 w-4 text-yellow-500" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Delete product" disabled={isPending}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product
                          "{product.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
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
      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No products found. Add some to get started!</p>
      )}
    </div>
  );
}
