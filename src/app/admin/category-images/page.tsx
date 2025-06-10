
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Category Images - Gleam Gallery Admin',
  description: 'Update images for product categories.',
};

export default function CategoryImagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair-display font-bold text-primary">Manage Category Images</h1>
      <p className="text-lg text-foreground/70">
        This section will allow you to update the images used for product categories on the homepage and other listings.
      </p>
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground">
        <p className="text-xl">Category Image Management Coming Soon</p>
        <p>Functionality to upload and assign images to categories will be implemented here.</p>
      </div>
    </div>
  );
}
