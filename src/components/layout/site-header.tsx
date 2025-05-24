'use client';

import Link from 'next/link';
import { Gem, ShoppingCart, UserCog, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/admin', label: 'Admin' },
];

export function SiteHeader() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} passHref>
      <Button
        variant={pathname === href ? 'secondary' : 'ghost'}
        className="text-sm font-medium"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {children}
      </Button>
    </Link>
  );
  
  const CartLink = () => (
     <Link href="/cart" passHref>
        <Button variant={pathname === "/cart" ? "secondary" : "ghost"} className="relative" onClick={() => setIsMobileMenuOpen(false)}>
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Cart</span>
          {isClient && totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2">
              {totalItems}
            </span>
          )}
        </Button>
      </Link>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" passHref>
          <Gem className="h-7 w-7 text-primary" />
          <span className="font-playfair-display text-2xl font-bold text-primary">Gleam Gallery</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/admin">
            <UserCog className="h-5 w-5 mr-1" /> Admin
          </NavLink>
          <CartLink/>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 p-6 bg-background">
              <nav className="flex flex-col space-y-4">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/products">Products</NavLink>
                 <NavLink href="/admin">
                  <UserCog className="h-5 w-5 mr-1" /> Admin
                </NavLink>
                <CartLink/>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
