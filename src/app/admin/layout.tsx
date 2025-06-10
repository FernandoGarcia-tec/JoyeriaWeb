
'use client'; // Make this a client component to use auth context

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// export const metadata = { // Metadata should be in server components or page.tsx
// title: 'Admin Panel - Gleam Gallery',
// description: 'Manage Gleam Gallery products and settings.',
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/login?message=unauthorized'); // Redirect to login if not admin
      }
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || currentUser.role !== 'admin') {
    // Show a loading skeleton or a simple loading message
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 p-8">
            <h1 className="text-2xl font-semibold">Loading Admin Panel...</h1>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6 mt-0">
        {children}
      </div>
    </div>
  );
}
