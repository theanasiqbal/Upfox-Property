'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, Sun, Moon, Phone, ChevronDown } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { CONTACT } from '@/lib/constants';
import { PostPropertyDialog } from '@/components/post-property-dialog';

export function Header() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const mainNavItems = [
    { label: 'Home', href: '/', match: (p: string) => p === '/' },
    { label: 'About Us', href: '/about', match: (p: string) => p === '/about' },
    { label: 'Services', href: '/services', match: (p: string) => p === '/services' },
    { label: 'Properties', href: '/properties', match: (p: string) => p === '/properties' || p.startsWith('/properties/') },
    { label: 'Contact', href: '/contact', match: (p: string) => p === '/contact' },
    { label: 'Partner With Us', href: '/partner', match: (p: string) => p === '/partner' },
  ];

  const moreNavItems = [
    { label: 'Join Us', href: '/join-us', match: (p: string) => p === '/join-us' },
    { label: 'Gallery', href: '/gallery', match: (p: string) => p === '/gallery' },
    { label: 'Maps & Forms', href: '/maps-and-forms', match: (p: string) => p === '/maps-and-forms' },

    { label: 'Calculator', href: '/calculator', match: (p: string) => p === '/calculator' },
  ];

  const navItems = [...mainNavItems, ...moreNavItems];

  const isActive = (item: typeof navItems[0]) => item.match(pathname);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/upfoxx logo.png"
                alt="Upfoxx Floors"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white font-heading leading-tight">Upfoxx Floors</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation — Centered */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(item)
                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-accent-purple dark:hover:text-accent-purple-light hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${moreNavItems.some(item => isActive(item))
                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-accent-purple dark:hover:text-accent-purple-light hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                More
                <ChevronDown className="w-4 h-4 ml-0.5" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {moreNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 text-sm transition-colors ${isActive(item)
                      ? 'text-accent-purple dark:text-accent-purple-light bg-accent-purple/10 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Side Section */}
          <div className="flex items-center gap-3">

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
                {currentUser.role !== 'admin' && currentUser.role !== 'subadmin' && <PostPropertyDialog />}

                <div className="relative group">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-purple text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all">
                    {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-white/10 mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                    {currentUser.role === 'admin' || currentUser.role === 'subadmin' ? (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard/user"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-accent-purple dark:hover:text-accent-purple-light transition-all"
                >
                  Login
                </Link>
                <PostPropertyDialog />
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
                  {currentUser.role === 'admin' || currentUser.role === 'subadmin' ? (
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
                        href="/dashboard/user"
                        className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <PostPropertyDialog trigger={
                        <span className="block px-4 py-3 btn-gradient rounded-xl text-sm text-center font-semibold">
                          Post Property
                        </span>
                      } />
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
                  <PostPropertyDialog trigger={
                    <span className="block px-4 py-3 rounded-xl text-sm">
                      Post Property
                    </span>
                  } />
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
