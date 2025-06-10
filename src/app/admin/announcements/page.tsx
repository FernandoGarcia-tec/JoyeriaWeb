
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Announcements - Gleam Gallery Admin',
  description: 'Add and manage announcement photos and content.',
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair-display font-bold text-primary">Manage Announcements</h1>
      <p className="text-lg text-foreground/70">
        Use this section to upload and manage photos or banners for site-wide announcements.
      </p>
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground">
        <p className="text-xl">Announcement Management Coming Soon</p>
        <p>Functionality to upload images and set up announcements will be implemented here.</p>
      </div>
    </div>
  );
}
