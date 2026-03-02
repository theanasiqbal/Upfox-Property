'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { DashboardStatsCard } from '@/components/dashboard-stats-card';
import { Home, Eye, Clock, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Property } from '@/lib/types';

export default function UserDashboardPage() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties?seller=me');
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [currentUser]);

  const stats = {
    totalProperties: properties.length,
    activeListings: properties.filter((p) => p.status === 'approved').length,
    pendingApproval: properties.filter((p) => p.status === 'pending').length,
    totalViews: properties.reduce((sum, p) => sum + p.viewCount, 0),
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back, {currentUser.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here&apos;s your property dashboard summary</p>
        </div>
        <Link
          href="/dashboard/user/properties/new"
          className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 btn-gradient font-semibold rounded-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <DashboardStatsCard
          icon={Home}
          title="Total Properties"
          value={stats.totalProperties}
        />
        <DashboardStatsCard
          icon={Home}
          title="Active Listings"
          value={stats.activeListings}
          highlighted
        />
        <DashboardStatsCard
          icon={Clock}
          title="Pending Approval"
          value={stats.pendingApproval}
        />
        <DashboardStatsCard
          icon={Eye}
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
        />

      </div>


    </div>
  );
}
