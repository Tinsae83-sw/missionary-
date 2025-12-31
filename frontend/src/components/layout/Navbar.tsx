import Link from 'next/link';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet"

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Events', href: '/events' },
    { name: 'Ministries', href: '/ministries' },
    { name: 'Blog', href: '/blog' },
    { name: 'Give', href: '/give' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        backgroundColor: '#BBDEFB', // Light Blue Accent - More visible background
        borderColor: '#0D47A1', // Dark Blue border for contrast
        boxShadow: '0 2px 10px rgba(13, 71, 161, 0.2)', // Subtle shadow for depth
      }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span 
            className="text-xl font-bold"
            style={{ 
              color: '#0D47A1', // Dark Blue text for high contrast
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.3)' // Subtle text shadow
            }}
          >
            Grace Church
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors px-3 py-2 rounded-md"
              style={{
                color: '#0D47A1', // Dark Blue text for high contrast
                backgroundColor: 'transparent',
                textDecoration: 'none',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF'; // White text on hover
                e.currentTarget.style.backgroundColor = '#0D47A1'; // Dark Blue background on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#0D47A1'; // Dark Blue text
                e.currentTarget.style.backgroundColor = 'transparent'; // Transparent background
              }}
            >
              {link.name}
            </Link>
          ))}
          <Button 
            asChild 
            size="sm"
            style={{
              backgroundColor: '#0D47A1', // Dark Blue background
              color: '#FFFFFF', // White text for maximum contrast
              border: '2px solid #0D47A1',
              fontWeight: '600',
              padding: '8px 20px',
              borderRadius: '6px',
            }}
            className="hover:scale-105 transition-transform"
          >
            <Link href="/login">Login</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                style={{
                  color: '#0D47A1', // Dark Blue text
                  backgroundColor: 'rgba(13, 71, 161, 0.1)',
                  border: '1px solid rgba(13, 71, 161, 0.3)',
                }}
                className="hover:bg-[#0D47A1] hover:text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[400px]"
              style={{
                backgroundColor: '#BBDEFB', // Light Blue Accent
                borderColor: '#0D47A1', // Dark Blue border
                color: '#0D47A1', // Dark Blue text
              }}
            >
              <div className="flex flex-col space-y-2 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium py-3 px-4 rounded-md"
                    style={{
                      color: '#0D47A1', // Dark Blue text
                      backgroundColor: 'transparent',
                      textDecoration: 'none',
                      fontWeight: '600',
                      border: '1px solid rgba(13, 71, 161, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF'; // White text on hover
                      e.currentTarget.style.backgroundColor = '#0D47A1'; // Dark Blue background on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#0D47A1'; // Dark Blue text
                      e.currentTarget.style.backgroundColor = 'transparent'; // Transparent background
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button 
                  asChild 
                  className="mt-4"
                  style={{
                    backgroundColor: '#0D47A1', // Dark Blue background
                    color: '#FFFFFF', // White text for maximum contrast
                    border: '2px solid #0D47A1',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '6px',
                  }}
                  className="hover:scale-105 transition-transform"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}