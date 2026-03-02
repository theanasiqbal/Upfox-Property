'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardStatsCard } from '@/components/dashboard-stats-card';
import {
  AlertCircle, Users, Home, MessageSquare, Star, Mail,
  Handshake, Bell, ShoppingBag, Store, CheckCircle, Clock,
} from 'lucide-react';

interface AdminStats {
  pendingProperties: number;
  approvedProperties: number;
  totalUsers: number;
  totalInquiries: number;
  unreadContacts: number;
  newPartnerApplications: number;
  newsletterSubscribers: number;
  pendingReviews: number;
  approvedReviews: number;
}

interface PendingProperty {
  _id: string;
  title: string;
  city: string;
  price: number;
  ownerName: string;
  listingDate: string;
}

interface PendingReview {
  _id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, propsRes, reviewsRes] = await Promise.all([
          fetch('/api/admin/stats', { credentials: 'include' }),
          fetch('/api/properties?status=pending&limit=5', { credentials: 'include' }),
          fetch('/api/reviews/pending', { credentials: 'include' }),
        ]);

        const statsData = await statsRes.json();
        const propsData = await propsRes.json();
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };

        if (statsData.stats) setStats(statsData.stats);
        if (propsData.properties) setPendingProperties(propsData.properties);
        if (reviewsData.reviews) setPendingReviews(reviewsData.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleReviewAction = async (id: string, approve: boolean) => {
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, isApproved: approve }),
      });
      setPendingReviews((prev) => prev.filter((r) => r._id !== id));
      setStats((prev) =>
        prev
          ? {
            ...prev,
            pendingReviews: prev.pendingReviews - 1,
            approvedReviews: approve ? prev.approvedReviews + 1 : prev.approvedReviews,
          }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-white/10 rounded-xl w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor all platform metrics and manage listings</p>
      </div>

      {/* Key Metrics — Row 1 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Properties</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <DashboardStatsCard icon={AlertCircle} title="Pending Approvals" value={stats?.pendingProperties ?? 0} highlighted />
          <DashboardStatsCard icon={Home} title="Approved Listings" value={stats?.approvedProperties ?? 0} />
          <DashboardStatsCard icon={MessageSquare} title="Total Inquiries" value={stats?.totalInquiries ?? 0} />
          <DashboardStatsCard icon={Bell} title="Unread Contacts" value={stats?.unreadContacts ?? 0} highlighted={!!stats?.unreadContacts} />
        </div>
      </div>

      {/* Key Metrics — Row 2: Users */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Users</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <DashboardStatsCard icon={Users} title="Total Users" value={stats?.totalUsers ?? 0} />
          <DashboardStatsCard icon={Mail} title="Newsletter Subs" value={stats?.newsletterSubscribers ?? 0} />
        </div>
      </div>

      {/* Key Metrics — Row 3: Engagement */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Engagement</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <DashboardStatsCard icon={Handshake} title="Partner Applications" value={stats?.newPartnerApplications ?? 0} highlighted={!!stats?.newPartnerApplications} />
          <DashboardStatsCard icon={Star} title="Approved Reviews" value={stats?.approvedReviews ?? 0} />
          <DashboardStatsCard icon={Clock} title="Pending Reviews" value={stats?.pendingReviews ?? 0} highlighted={!!stats?.pendingReviews} />
          <DashboardStatsCard icon={CheckCircle} title="Total Reviews" value={(stats?.approvedReviews ?? 0) + (stats?.pendingReviews ?? 0)} />
        </div>
      </div>

      {/* Two-column layout: Pending Props + Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Properties */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Pending Approvals
              {pendingProperties.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                  {pendingProperties.length}
                </span>
              )}
            </h2>
            <Link href="/admin/properties/pending" className="text-accent-purple hover:underline font-medium text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {pendingProperties.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No pending properties 🎉</p>
              </div>
            ) : (
              pendingProperties.map((property) => (
                <div key={property._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{property.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {property.ownerName} · {property.city} · ₹{property.price?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link
                    href={`/admin/properties/pending`}
                    className="ml-4 shrink-0 text-xs px-3 py-1.5 bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple font-semibold rounded-lg hover:bg-accent-purple/20 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>


      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Manage Properties', href: '/admin/properties', icon: Home, color: 'bg-accent-purple/10 text-accent-purple' },
            { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
            { label: 'Partner Requests', href: '/admin/partners', icon: Handshake, color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' },
            { label: 'Contact Forms', href: '/admin/contacts', icon: Mail, color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-accent-purple/50 hover:bg-accent-purple/5 dark:hover:bg-white/5 transition-all group text-center"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
