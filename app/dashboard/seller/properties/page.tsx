'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getPropertiesBySeller, MOCK_PROPERTIES, MOCK_USERS } from '@/lib/data';
import { StatusBadge } from '@/components/status-badge';
import { Eye, Edit, Trash2, Archive, Plus } from 'lucide-react';
import { useState } from 'react';

export default function MyPropertiesPage() {
  const { currentUser } = useAuth();

  // Use fallback user if currentUser is null
  const user = currentUser || MOCK_USERS[0];

  const [properties, setProperties] = useState(() => getPropertiesBySeller(user.id));

  const handleDelete = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter((p) => p.id !== propertyId));
    }
  };

  const handleArchive = (propertyId: string) => {
    setProperties(
      properties.map((p) =>
        p.id === propertyId ? { ...p, status: 'archived' as const } : p
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Properties</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{properties.length} total properties</p>
        </div>
        <Link
          href="/dashboard/seller/properties/new"
          className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {/* Properties Table */}
      {properties.length > 0 ? (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date Listed</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    {/* Property */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={property.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop'}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{property.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{property.city}, {property.state}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={property.status} />
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {property.listingType === 'rent'
                        ? `₹${property.price.toLocaleString('en-IN')}/mo`
                        : `₹${property.price.toLocaleString('en-IN')}`}
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {property.viewCount.toLocaleString()}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(property.listingDate).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/seller/properties/${property.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleArchive(property.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-white/5">
            {properties.map((property) => (
              <div key={property.id} className="p-4 space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={property.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{property.title}</h3>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {/* More options menu trigger could be here */}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{property.city}, {property.state}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge status={property.status} />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {property.listingType === 'rent'
                          ? `₹${property.price.toLocaleString('en-IN')}/mo`
                          : `₹${property.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    {property.viewCount.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/properties/${property.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/seller/properties/${property.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleArchive(property.id)}
                      className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg shadow-sm border border-gray-200 dark:border-white/10 px-6 py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't listed any properties yet.</p>
          <Link
            href="/dashboard/seller/properties/new"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
      )}
    </div>
  );
}
