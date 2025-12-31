import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Church Name</h3>
          <p className="text-gray-400">
            Sharing the love of Christ with our community and beyond through worship, discipleship, and service.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/ministries" className="text-gray-400 hover:text-white">Ministries</Link></li>
            <li><Link href="/sermons" className="text-gray-400 hover:text-white">Sermons</Link></li>
            <li><Link href="/events" className="text-gray-400 hover:text-white">Events</Link></li>
            <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Connect</h4>
          <ul className="space-y-2">
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            <li><Link href="/prayer-request" className="text-gray-400 hover:text-white">Prayer Request</Link></li>
            <li><Link href="/give" className="text-gray-400 hover:text-white">Give Online</Link></li>
            <li><Link href="/volunteer" className="text-gray-400 hover:text-white">Volunteer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Service Times</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Sunday: 9:00 AM & 11:00 AM</li>
            <li>Wednesday: 7:00 PM</li>
            <li>Friday Prayer: 6:30 PM</li>
          </ul>
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Location</h4>
            <p className="text-gray-400">123 Church Street<br />City, State ZIP</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
        <p>© {currentYear} Church Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
