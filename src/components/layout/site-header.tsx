
'use client';

import Link from 'next/link';
import { Gem, ShoppingCart, UserCog, Menu, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from 'react';

export function SiteHeader() {
  const { totalItems } = useCart();
  const { currentUser, logout, isLoading } = useAuth(); // Get auth state and functions
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/'); // Redirect to home after logout
  };

  const NavLink = ({ href, children, icon, action }: { href?: string; children: React.ReactNode; icon?: React.ElementType; action?: () => void; }) => {
    const IconComponent = icon;
    const commonProps = {
      variant: pathname === href ? 'secondary' : 'ghost' as any,
      className: "text-sm font-medium",
      onClick: () => {
        if (action) action();
        else if (href) router.push(href);
        setIsMobileMenuOpen(false);
      }
    };

    return (
      <Button {...commonProps}>
        {IconComponent && <IconComponent className="h-5 w-5 mr-1" />}
        {children}
      </Button>
    );
  };
  
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

  const AuthNavLinks = () => {
    if (isLoading && !isClient) return <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>; // Placeholder for loading
    if (currentUser) {
      return (
        <>
          {currentUser.role === 'admin' && (
            <NavLink href="/admin" icon={UserCog}>Admin</NavLink>
          )}
          <NavLink action={handleLogout} icon={LogOut}>Logout</NavLink>
        </>
      );
    }
    return (
      <>
        <NavLink href="/login" icon={LogIn}>Login</NavLink>
        <NavLink href="/register" icon={UserPlus}>Register</NavLink>
      </>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" passHref>
          <Gem className="h-7 w-7 text-primary" />
          <span className="font-playfair-display text-2xl font-bold text-primary">Gleam Gallery</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <AuthNavLinks />
          <CartLink/>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
           <CartLink/> {/* Show cart icon outside sheet on mobile too */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 p-6 bg-background">
              <nav className="flex flex-col space-y-3">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/products">Products</NavLink>
                {/* <NavLink href="/cart">Cart</NavLink> Cart is outside */}
                <AuthNavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
