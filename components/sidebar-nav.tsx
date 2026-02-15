'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Home } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarNavProps {
  items: NavItem[];
  title?: string;
}

export function SidebarNav({ items, title = 'Menu' }: SidebarNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5 text-gray-700 dark:text-white" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-white" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-72 bg-white dark:bg-navy-800/95 dark:backdrop-blur-xl border-r border-gray-200 dark:border-white/10 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-purple-dark rounded-lg flex items-center justify-center text-white">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{title}</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {items.map((item) => {
              // Check if the current path is exactly the item href OR if it starts with item href + '/'
              // This prevents '/admin' from matching '/admin/properties'
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin' && item.href !== '/dashboard/seller');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple dark:text-accent-purple-light font-semibold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <div className="w-5 h-5">{item.icon}</div>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
