'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getSellerInquiries, MOCK_PROPERTIES, MOCK_USERS } from '@/lib/data';
import { MessageSquare, User, Mail, Phone, Calendar } from 'lucide-react';

export default function InquiriesPage() {
  const { currentUser } = useAuth();

  // Use fallback user if currentUser is null
  const user = currentUser || MOCK_USERS[0];

  const inquiries = getSellerInquiries(user.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{inquiries.length} total inquiries received</p>
      </div>

      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const property = MOCK_PROPERTIES.find((p) => p.id === inquiry.propertyId);
            return (
              <div key={inquiry.id} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 p-4 md:p-6 hover:shadow-md dark:hover:shadow-accent-purple/10 transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    {property && (
                      <Link href={`/properties/${property.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        {property.title}
                      </Link>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Property ID: {inquiry.propertyId}</p>
                  </div>
                  <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-medium ${inquiry.status === 'new'
                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'
                    : inquiry.status === 'contacted'
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-300'
                    }`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </span>
                </div>

                {/* Buyer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Buyer Name</p>
                      <p className="font-medium text-gray-900 dark:text-white truncate">{inquiry.buyerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white truncate">{inquiry.buyerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{inquiry.buyerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Received</p>
                      <p className="font-medium text-gray-900 dark:text-white">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Message</p>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 rounded p-3 text-sm">{inquiry.message}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${inquiry.buyerEmail}`}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Reply via Email
                  </a>
                  <a
                    href={`tel:${inquiry.buyerPhone}`}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium rounded-lg transition-colors"
                  >
                    Call Buyer
                  </a>
                  <select
                    defaultValue={inquiry.status}
                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 dark:border-white/20 bg-white dark:bg-navy-900/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 px-6 py-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No inquiries yet</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">Keep adding properties to start receiving inquiries from buyers</p>
          <Link href="/dashboard/seller/properties/new" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Add Property
          </Link>
        </div>
      )}
    </div>
  );
}
