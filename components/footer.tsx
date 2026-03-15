'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-navy-900 border-t border-gray-200 dark:border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
              Your trusted premium real estate &amp; workspace solutions provider. Find verified properties, office spaces, and co-working hubs.
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
                { label: 'Maps & Forms', href: '/maps-and-forms' },
                { label: 'Contact', href: '/contact' },
                { label: 'Partner With Us', href: '/partner' },
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


        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-10 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold font-heading mb-1">Stay Updated</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get latest property listings and workspace deals in your inbox.</p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem('newsletter') as HTMLInputElement);
                if (!input?.value) return;
                const email = input.value;
                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  });
                  if (res.ok) {
                    input.value = '';
                  }
                } catch {
                  // silently ignore
                }
              }}
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
            >
              <input
                type="email"
                name="newsletter"
                required
                placeholder="Enter your email"
                className="flex-1 min-w-[240px] px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-2.5 btn-gradient rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {currentYear} Upfoxx Floors. All rights reserved.
            </p>
            <span className="hidden md:block text-gray-300 dark:text-gray-600">|</span>
            <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="flex gap-4">
            {[
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                aria-label={label}
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
