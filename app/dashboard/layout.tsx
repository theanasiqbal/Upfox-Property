'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { SidebarNav } from '@/components/sidebar-nav';
import {
  LayoutGrid,
  Home,
  MessageSquare,
  Heart,
  Settings,
  Plus,
} from 'lucide-react';

const sellerNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/seller',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    label: 'My Properties',
    href: '/dashboard/seller/properties',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Add Property',
    href: '/dashboard/seller/properties/new',
    icon: <Plus className="w-5 h-5" />,
  },
  {
    label: 'Inquiries',
    href: '/dashboard/seller/inquiries',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: 'Saved Properties',
    href: '/dashboard/seller/favorites',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/dashboard/seller/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    // <ProtectedRoute requiredRole="user">
    <div className="flex h-screen bg-gray-50 dark:bg-navy-800">
      {/* Sidebar */}
      <SidebarNav items={sellerNavItems} title="Seller Dashboard" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0">
        <main className="p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
