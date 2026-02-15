'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, Sun, Moon, Home, Phone } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { CONTACT } from '@/lib/constants';

export function Header() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: 'Home', href: '/', match: (p: string) => p === '/' },
    { label: 'Services', href: '/services', match: (p: string) => p === '/services' },
    { label: 'Properties', href: '/properties', match: (p: string) => p === '/properties' || p.startsWith('/properties/') },
    { label: 'About Us', href: '/about', match: (p: string) => p === '/about' },
    { label: 'Contact', href: '/contact', match: (p: string) => p === '/contact' },
  ];

  const isActive = (item: typeof navItems[0]) => item.match(pathname);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-dark-blue to-gold rounded-lg flex items-center justify-center text-white">
                <Home className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white font-heading leading-tight">Upfoxx Floors</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation — Centered */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(item)
                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-accent-purple dark:hover:text-accent-purple-light hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Section */}
          <div className="flex items-center gap-3">
            {/* Call Button — Desktop */}
            <a
              href={`tel:${CONTACT.phone}`}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-accent-purple hover:text-accent-purple-dark transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{CONTACT.phone}</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-4">
                {currentUser.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard/seller"
                      className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/seller/properties/new"
                      className="px-4 py-2 btn-gradient text-sm font-bold rounded-full"
                    >
                      Post Property
                    </Link>
                  </>
                )}
                <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10" />
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-accent-purple dark:hover:text-accent-purple-light transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 btn-gradient text-sm font-bold rounded-full shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden border-t border-gray-200 dark:border-white/10 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item)
                  ? 'bg-accent-purple/10 text-accent-purple'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-white/10 pt-3 mt-3 space-y-1">
              {currentUser ? (
                <>
                  {currentUser.role === 'admin' ? (
                    <Link
                      href="/admin"
                      className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/dashboard/seller"
                        className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/seller/properties/new"
                        className="block px-4 py-3 btn-gradient rounded-xl text-sm text-center font-semibold"
                        onClick={() => setIsOpen(false)}
                      >
                        Post Property
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-3 btn-gradient rounded-xl text-sm text-center font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
