'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MOCK_PROPERTIES, getUserById } from '@/lib/data';
import { StatusBadge } from '@/components/status-badge';
import { PropertyStatus } from '@/lib/types';
import { Eye, Edit, Trash2, Check, X } from 'lucide-react';

function AdminPropertiesContent() {
  const searchParams = useSearchParams();
  const statusFilter = (searchParams.get('status') as PropertyStatus) || null;
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [selectedTab, setSelectedTab] = useState<PropertyStatus | 'all'>(statusFilter || 'all');

  const tabs: Array<{ id: PropertyStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const filteredProperties = useMemo(() => {
    if (selectedTab === 'all') {
      return properties;
    }
    return properties.filter((p) => p.status === selectedTab);
  }, [properties, selectedTab]);

  const handleApprove = (propertyId: string) => {
    setProperties(
      properties.map((p) =>
        p.id === propertyId ? { ...p, status: 'approved' as const } : p
      )
    );
  };

  const handleReject = (propertyId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setProperties(
        properties.map((p) =>
          p.id === propertyId
            ? { ...p, status: 'rejected' as const, rejectionReason: reason }
            : p
        )
      );
    }
  };

  const handleDelete = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter((p) => p.id !== propertyId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Properties Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{filteredProperties.length} properties</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.id
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Properties Table */}
      {filteredProperties.length > 0 ? (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredProperties.map((property) => {
                  const seller = getUserById(property.sellerId);
                  return (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                        {property.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {seller ? seller.name : 'Unknown Seller'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={property.status} />
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{property.city}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(property.listingDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/properties/${property.id}`}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {property.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(property.id)}
                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(property.id)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
            {filteredProperties.map((property) => {
              const seller = getUserById(property.sellerId);
              return (
                <div key={property.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{property.title}</h3>
                    <StatusBadge status={property.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-semibold text-accent-purple dark:text-accent-purple-light">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="text-right">
                      {new Date(property.listingDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5">
                      <span className="text-gray-500">Seller:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {seller ? seller.name : 'Unknown'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      {property.city}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                    <Link
                      href={`/properties/${property.id}`}
                      className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {property.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(property.id)}
                          className="p-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(property.id)}
                          className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
          <p className="text-gray-600">No properties found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading properties...</div>}>
      <AdminPropertiesContent />
    </Suspense>
  );
}
