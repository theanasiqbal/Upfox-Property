import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-navy-900 border-t border-gray-200 dark:border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/upfoxx logo.png"
                alt="Upfoxx Floors"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">Upfoxx Floors</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Your trusted premium real estate & workspace solutions provider in Bareilly. Find verified properties, office spaces, and co-working hubs.
            </p>
            <div className="space-y-3">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                <Mail className="w-4 h-4" />
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                <Phone className="w-4 h-4" />
                +91 {CONTACT.phone}
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {CONTACT.address}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider font-heading">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Properties', href: '/properties' },
                { label: 'Services', href: '/services' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider font-heading">Services</h3>
            <ul className="space-y-3">
              {[
                'Office Space for Rent',
                'Co-Working Spaces',
                'Meeting Rooms',
                'Residential Rentals',
                'Commercial Properties',
                'Virtual Office',
                'Property Management',
              ].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider font-heading">Locations</h3>
            <ul className="space-y-3">
              {[
                'Civil Lines, Bareilly',
                'Rajendra Nagar',
                'CB Ganj',
                'Pilibhit Bypass',
                'Subhash Nagar',
                'Izatnagar',
              ].map((item) => (
                <li key={item}>
                  <Link href="/properties" className="text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} Upfoxx Floors. All rights reserved.
          </p>

          <div className="flex gap-4">
            {[
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Instagram, href: '#' },
              { icon: Linkedin, href: '#' },
            ].map(({ icon: Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-accent-purple hover:text-white dark:hover:bg-accent-purple transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
