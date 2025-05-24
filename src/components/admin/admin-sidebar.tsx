'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Sparkles, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Manage Products', icon: Package },
  { href: '/admin/description-generator', label: 'AI Descriptions', icon: Sparkles },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground p-4 space-y-2 shadow-lg hidden md:block fixed top-0 left-0 pt-20"> {/* pt-20 to account for header */}
      <nav className="flex flex-col space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-sm',
                  isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
