export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95 py-6">
      <div className="container flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Gleam Gallery. All rights reserved.</p>
        <p className="mt-1">Exquisite Jewelry Crafted with Passion.</p>
      </div>
    </footer>
  );
}
