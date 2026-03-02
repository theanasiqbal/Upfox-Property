'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { SidebarNav } from '@/components/sidebar-nav';
import { LayoutGrid, Home, CheckCircle, Users, MessageSquare, Handshake, Star, Mail } from 'lucide-react';

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    label: 'Properties',
    href: '/admin/properties',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Pending Approvals',
    href: '/admin/properties/pending',
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Enquiries',
    href: '/admin/enquiries',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: 'Contacts',
    href: '/admin/contacts',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    label: 'Partners',
    href: '/admin/partners',
    icon: <Handshake className="w-5 h-5" />,
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    icon: <Star className="w-5 h-5" />,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // <ProtectedRoute requiredRole="admin">
    <div className="flex h-screen bg-gray-50 dark:bg-navy-800">
      {/* Sidebar */}
      <SidebarNav items={adminNavItems} title="Admin Panel" />

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
