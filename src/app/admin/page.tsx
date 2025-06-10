
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Sparkles, BarChart3, ImageIcon, ImagePlay, LayoutList } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-playfair-display font-bold text-primary">Admin Dashboard</h1>
      <p className="text-lg text-foreground/70">Welcome to the Gleam Gallery Admin Panel. Manage your store with ease.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair-display text-primary">Manage Products</CardTitle>
              <Package className="h-8 w-8 text-primary/70" />
            </div>
            <CardDescription>Add, edit, or remove jewelry items from your catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Go to Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair-display text-primary">AI Descriptions</CardTitle>
              <Sparkles className="h-8 w-8 text-primary/70" />
            </div>
            <CardDescription>Generate compelling product descriptions using AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/description-generator" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Use AI Tool</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair-display text-primary">Manage Categories</CardTitle>
              <LayoutList className="h-8 w-8 text-primary/70" />
            </div>
            <CardDescription>Add, edit, or delete product categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/categories" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Manage Categories</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair-display text-primary">Category Images</CardTitle>
              <ImageIcon className="h-8 w-8 text-primary/70" />
            </div>
            <CardDescription>Update images for product categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/category-images" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Manage Images</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair-display text-primary">Announcements</CardTitle>
              <ImagePlay className="h-8 w-8 text-primary/70" />
            </div>
            <CardDescription>Add and manage announcement photos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/announcements" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Manage Photos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair-display text-primary">Analytics (Coming Soon)</CardTitle>
              <BarChart3 className="h-8 w-8 text-primary/70" />
            </div>
            <CardDescription>View sales reports, customer insights, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
