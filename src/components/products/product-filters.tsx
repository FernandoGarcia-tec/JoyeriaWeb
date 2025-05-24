
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories, getMaterials } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';
import { FilterX } from 'lucide-react';

const ALL_ITEMS_VALUE = "__ALL__"; // Special value for "All" options

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const materials = getMaterials(); // In a real app, this might come from API or be pre-defined

  const handleFilterChange = (type: 'category' | 'material', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === ALL_ITEMS_VALUE) { // If "All" is selected for this filter type
      current.delete(type);
    } else {
      current.set(type, value);
    }
    const query = current.toString();
    router.push(`/products${query ? `?${query}` : ''}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const selectedCategory = searchParams.get('category') || ALL_ITEMS_VALUE;
  const selectedMaterial = searchParams.get('material') || ALL_ITEMS_VALUE;

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-foreground mb-1">Category</label>
          <Select value={selectedCategory} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger id="category-filter" className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE}>All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="material-filter" className="block text-sm font-medium text-foreground mb-1">Material</label>
          <Select value={selectedMaterial} onValueChange={(value) => handleFilterChange('material', value)}>
            <SelectTrigger id="material-filter" className="w-full">
              <SelectValue placeholder="All Materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ITEMS_VALUE}>All Materials</SelectItem>
              {materials.map(material => (
                <SelectItem key={material} value={material}>
                  {material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={clearFilters} variant="outline" className="w-full md:w-auto self-end">
          <FilterX className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </div>
    </div>
  );
}
