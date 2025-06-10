
import type { Metadata } from 'next';
import { Lora, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context'; // Import AuthProvider

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gleam Gallery - Exquisite Jewelry',
  description: 'Discover our unique collection of handcrafted jewelry.',
  icons: {
    icon: '/favicon.ico', // Placeholder, actual favicon not generated
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${playfairDisplay.variable} antialiased flex flex-col min-h-screen`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <CartProvider>
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <SiteFooter />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
