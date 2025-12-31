import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'About Us',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Beliefs', href: '/about/beliefs' },
        { name: 'Leadership', href: '/about/leadership' },
        { name: 'Sermons', href: '/sermons' },
      ],
    },
    {
      title: 'Ministries',
      links: [
        { name: 'Children', href: '/ministries/children' },
        { name: 'Youth', href: '/ministries/youth' },
        { name: 'Women', href: '/ministries/women' },
        { name: 'Men', href: '/ministries/men' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Events', href: '/events' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Give', href: '/give' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer 
      className="border-t"
      style={{
        backgroundColor: '#0D47A1', // Dark Blue (from your palette)
        borderColor: '#BBDEFB', // Light Blue Accent border
      }}
    >
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span 
                className="text-2xl font-bold"
                style={{ color: '#E3F2FD' }} // Light Blue text
              >
                Grace Church
              </span>
            </Link>
            <p 
              className="text-sm"
              style={{ 
                color: '#BBDEFB', // Light Blue Accent text
                opacity: 0.9 
              }}
            >
              A place to grow in faith and fellowship. Join us as we seek to know Christ and make Him known.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-80"
                  style={{ 
                    color: '#E3F2FD', // Light Blue text
                  }}
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 
                className="text-sm font-semibold mb-4"
                style={{ 
                  color: '#E3F2FD', // Light Blue text
                  borderBottom: '2px solid #BBDEFB', // Light Blue Accent underline
                  paddingBottom: '8px'
                }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors block py-1"
                      style={{
                        color: '#BBDEFB', // Light Blue Accent text
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFFFFF'; // White on hover
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#BBDEFB'; // Light Blue Accent
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-12 pt-8 border-t"
          style={{
            borderColor: '#BBDEFB', // Light Blue Accent border
            opacity: 0.6
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-sm"
              style={{ 
                color: '#E3F2FD', // Light Blue text
                opacity: 0.8 
              }}
            >
              &copy; {currentYear} Grace Church. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm transition-colors"
                style={{
                  color: '#BBDEFB', // Light Blue Accent text
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'; // White on hover
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#BBDEFB'; // Light Blue Accent
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm transition-colors"
                style={{
                  color: '#BBDEFB', // Light Blue Accent text
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'; // White on hover
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#BBDEFB'; // Light Blue Accent
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}