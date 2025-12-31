import Link from 'next/link';
import { Button } from './button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Church Name</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
            <Link href="/ministries" className="text-sm font-medium transition-colors hover:text-primary">
              Ministries
            </Link>
            <Link href="/sermons" className="text-sm font-medium transition-colors hover:text-primary">
              Sermons
            </Link>
            <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
              Events
            </Link>
            <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Give
          </Button>
          <Button size="sm">
            Join Us
          </Button>
        </div>
      </div>
    </header>
  );
}
