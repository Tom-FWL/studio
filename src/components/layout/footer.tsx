import { Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row">
        <div className="md:flex-1">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Tommy’s Desk. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
        </div>

        <div className="md:flex-1 flex justify-center md:justify-end">
            <Button variant="link" asChild className="text-sm text-muted-foreground hover:text-primary">
            <Link href="/admin/login">
                2001
            </Link>
            </Button>
        </div>
      </div>
    </footer>
  );
}
