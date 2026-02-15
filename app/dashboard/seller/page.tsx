'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getPropertiesBySeller, getSellerInquiries, MOCK_PROPERTIES, MOCK_USERS } from '@/lib/data';
import { DashboardStatsCard } from '@/components/dashboard-stats-card';
import { Home, Eye, MessageSquare, Clock, Plus } from 'lucide-react';

export default function SellerDashboardPage() {
  const { currentUser } = useAuth();

  // Use fallback user if currentUser is null (for development/demo when auth is bypassed)
  const user = currentUser || MOCK_USERS[0];

  const sellerProperties = getPropertiesBySeller(user.id);
  const sellerInquiries = getSellerInquiries(user.id);

  const stats = {
    totalProperties: sellerProperties.length,
    activeListings: sellerProperties.filter((p) => p.status === 'approved').length,
    pendingApproval: sellerProperties.filter((p) => p.status === 'pending').length,
    totalViews: sellerProperties.reduce((sum, p) => sum + p.viewCount, 0),
    totalInquiries: sellerInquiries.length,
  };

  const recentInquiries = sellerInquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here&apos;s your property dashboard summary</p>
        </div>
        <Link
          href="/dashboard/seller/properties/new"
          className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 btn-gradient font-semibold rounded-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
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
        <DashboardStatsCard
          icon={MessageSquare}
          title="Total Inquiries"
          value={stats.totalInquiries}
        />
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Inquiries</h2>
        </div>

        {recentInquiries.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Buyer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {recentInquiries.map((inquiry) => {
                    const property = MOCK_PROPERTIES.find((p) => p.id === inquiry.propertyId);
                    return (
                      <tr key={inquiry.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {property?.title || 'Property Not Found'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inquiry.buyerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inquiry.buyerEmail}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inquiry.buyerPhone}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${inquiry.status === 'new'
                            ? 'bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple dark:text-accent-purple-light'
                            : inquiry.status === 'contacted'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400'
                            }`}>
                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
              {recentInquiries.map((inquiry) => {
                const property = MOCK_PROPERTIES.find((p) => p.id === inquiry.propertyId);
                return (
                  <div key={inquiry.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{property?.title || 'Property Not Found'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${inquiry.status === 'new'
                        ? 'bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple dark:text-accent-purple-light'
                        : inquiry.status === 'contacted'
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400'
                        }`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <p><span className="font-medium">Buyer:</span> {inquiry.buyerName}</p>
                      <p><span className="font-medium">Email:</span> {inquiry.buyerEmail}</p>
                      <p><span className="font-medium">Phone:</span> {inquiry.buyerPhone}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No inquiries yet. Keep adding properties!</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10">
          <Link
            href="/dashboard/seller/inquiries"
            className="text-accent-purple hover:text-accent-purple-dark dark:hover:text-accent-purple-light font-medium text-sm transition-colors"
          >
            View all inquiries →
          </Link>
        </div>
      </div>
    </div>
  );
}
