import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Home, Mail, Phone, MapPin } from 'lucide-react';

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
              <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-purple-dark rounded-lg flex items-center justify-center text-white">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Upfoxx</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Your trusted premium real estate marketplace. Discover elegant homes with modern design and seamless experiences.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@upfoxx.com" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                <Mail className="w-4 h-4" />
                info@upfoxx.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                <Phone className="w-4 h-4" />
                +1 234 567 890
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                123 Main St, Business Bay
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Properties', href: '/properties' },
                { label: 'About Us', href: '#' },
                { label: 'Contact', href: '#' },
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
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {['Buy Property', 'Rent Property', 'Sell Property', 'Property Management'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {['How it works', 'Pricing', 'Reviews', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light text-sm transition-colors">
                    {item}
                  </a>
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
            © {currentYear} Upfoxx Properties. All rights reserved.
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
