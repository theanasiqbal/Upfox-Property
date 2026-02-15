'use client';

import Link from 'next/link';
import { MOCK_PROPERTIES, MOCK_USERS, MOCK_INQUIRIES } from '@/lib/data';
import { DashboardStatsCard } from '@/components/dashboard-stats-card';
import { AlertCircle, Users, Home, MessageSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  const pendingProperties = MOCK_PROPERTIES.filter((p) => p.status === 'pending');
  const totalProperties = MOCK_PROPERTIES.filter((p) => p.status === 'approved').length;
  const totalUsers = MOCK_USERS.length;
  const totalInquiries = MOCK_INQUIRIES.length;

  // Calculate properties by city
  const propertiesByCity = MOCK_PROPERTIES.reduce(
    (acc, prop) => {
      if (prop.status === 'approved') {
        acc[prop.city] = (acc[prop.city] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor platform metrics and manage properties</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <DashboardStatsCard
          icon={AlertCircle}
          title="Pending Approvals"
          value={pendingProperties.length}
          highlighted
        />
        <DashboardStatsCard
          icon={Home}
          title="Total Properties"
          value={totalProperties}
        />
        <DashboardStatsCard
          icon={Users}
          title="Total Users"
          value={totalUsers}
        />
        <DashboardStatsCard
          icon={MessageSquare}
          title="Total Inquiries"
          value={totalInquiries}
        />
      </div>

      {/* Pending Properties */}
      {pendingProperties.length > 0 && (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Property Approvals</h2>
            <Link href="/admin/properties?status=pending" className="text-accent-purple hover:text-accent-purple-dark dark:hover:text-accent-purple-light font-medium text-sm transition-colors">
              View All →
            </Link>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {pendingProperties.slice(0, 5).map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{property.city}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{property.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(property.listingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="text-accent-purple hover:text-accent-purple-dark dark:hover:text-accent-purple-light font-medium transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
            {pendingProperties.slice(0, 5).map((property) => (
              <div key={property.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{property.title}</h3>
                  <span className="text-accent-purple font-bold whitespace-nowrap">₹{property.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                      <Home className="w-2.5 h-2.5" />
                    </div>
                    {property.city}
                  </div>
                  <div className="text-right">
                    {new Date(property.listingDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="flex items-center justify-center w-full py-2 bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple dark:text-accent-purple-light font-medium rounded-lg text-sm"
                  >
                    Review Property
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      }

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties by City */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Properties by City</h3>
          <div className="space-y-3">
            {Object.entries(propertiesByCity)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([city, count]) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-purple to-accent-purple-light rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(propertiesByCity))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Regular Users</p>
                <p className="text-2xl font-bold text-accent-purple">
                  {MOCK_USERS.filter((u) => u.role === 'user').length}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {MOCK_USERS.filter((u) => u.role === 'admin').length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Properties/User</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalProperties / MOCK_USERS.filter((u) => u.role === 'user').length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
