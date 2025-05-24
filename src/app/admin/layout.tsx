import { AdminSidebar } from '@/components/admin/admin-sidebar';
import React from 'react';

export const metadata = {
  title: 'Admin Panel - Gleam Gallery',
  description: 'Manage Gleam Gallery products and settings.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6 mt-0"> {/* mt-16 was for fixed header, now header is part of RootLayout and admin sidebar is fixed*/}
        {children}
      </div>
    </div>
  );
}
