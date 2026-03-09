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
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const userNavItems = [
  {
    label: 'Back to Website',
    href: '/',
    icon: <ArrowLeft className="w-5 h-5" />,
  },
  {
    label: 'Profile',
    href: '/dashboard/user',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    label: 'My Properties',
    href: '/dashboard/user/properties',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Add Property',
    href: '/dashboard/user/properties/new',
    icon: <Plus className="w-5 h-5" />,
  },

  {
    label: 'Settings',
    href: '/dashboard/user/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  return (
    // <ProtectedRoute requiredRole="user">
    <div className="flex h-screen bg-gray-50 dark:bg-navy-800">
      {/* Sidebar */}
      <SidebarNav items={userNavItems} title={currentUser?.name ? `Hey, ${currentUser.name}` : "User Profile"} />

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
