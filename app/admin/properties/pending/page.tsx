'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPagination } from '@/components/admin-pagination';
import { AdminPropertyModal } from '@/components/admin-property-modal';
import { Trash2, ArrowUpDown, Search, Eye, CheckCircle } from 'lucide-react';
import { IProperty } from '@/lib/db/models/Property';

interface Pagination { page: number; limit: number; total: number; pages: number; }

export default function AdminPendingPropertiesPage() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('listingDate');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);

  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ status: 'pending', page: String(page), limit: '15', sortBy, sortOrder });
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/properties?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching pending properties', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);
  useEffect(() => { setPage(1); }, [search, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  // After modal action: remove from pending list (approved/rejected both leave 'pending')
  const handleModalAction = (id: string) => {
    setProperties(prev => prev.filter(p => p._id !== id));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    setSelectedProperty(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) { console.error('Error deleting property', error); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pending Approvals</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{pagination.total} properties awaiting review</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by title, owner, city..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-accent-purple text-white rounded-xl text-sm font-medium hover:bg-accent-purple/90 transition-colors">Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Clear</button>}
        </form>
        <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o as 'asc' | 'desc'); }} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
          <option value="listingDate-desc">Newest First</option>
          <option value="listingDate-asc">Oldest First</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="title-asc">Title A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />)}</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No pending properties 🎉</p>
            <p className="text-sm text-gray-400 mt-1">All properties have been reviewed.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('title')}>
                      <span className="flex items-center gap-1">Property <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('price')}>
                      <span className="flex items-center gap-1">Price <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('listingDate')}>
                      <span className="flex items-center gap-1">Submitted <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {properties.map(property => (
                    <tr
                      key={property._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">{property.title}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">{property.ownerName}</div>
                        <div className="text-xs text-gray-400">{property.ownerEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        ₹{property.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{property.city}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {new Date(property.listingDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View & Review"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, property._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
              {properties.map(property => (
                <div
                  key={property._id}
                  onClick={() => setSelectedProperty(property)}
                  className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{property.title}</h3>
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">Pending</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-semibold text-accent-purple">₹{property.price?.toLocaleString('en-IN')}</div>
                    <div className="text-right">{new Date(property.listingDate).toLocaleDateString()}</div>
                    <div className="col-span-2">{property.ownerName} · {property.city}</div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Tap to review →</p>
                </div>
              ))}
            </div>
          </>
        )}
        <AdminPagination page={pagination.page} totalPages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <AdminPropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onAction={handleModalAction}
        />
      )}
    </div>
  );
}
