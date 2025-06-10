
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/data'; // Import the function
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/types';

export default function HomePage() {
  const categories: Category[] = getAllCategories(); // Call the function to get current categories

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-background to-purple-100 rounded-lg shadow-lg">
        <h1 className="text-5xl md:text-6xl font-playfair-display font-bold text-primary mb-6">
          Welcome to Gleam Gallery
        </h1>
        <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Discover timeless elegance and exquisite craftsmanship in every piece. Our collections are designed to celebrate your unique sparkle.
        </p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
            Explore All Products <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="text-4xl font-playfair-display font-semibold text-center mb-10 text-primary">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`} passHref>
              <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-[4/3] relative w-full overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      data-ai-hint={`${category.name.toLowerCase()} jewelry`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-6 text-center">
                  <CardTitle className="text-2xl font-playfair-display text-primary group-hover:text-accent transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-foreground/70 text-sm">
                    {category.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="justify-center pb-6">
                   <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    View {category.name}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
