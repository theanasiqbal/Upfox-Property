'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPagination } from '@/components/admin-pagination';
import { AdminExportModal } from '@/components/admin-export-modal';
import { AdminAddUserModal } from '@/components/admin-add-user-modal';
import { exportToExcel, ExportFilters } from '@/lib/export-excel';
import { CheckCircle, Shield, Trash2, Search, ArrowUpDown, Download, Plus } from 'lucide-react';

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  registrationDate: string;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

const ROLE_TABS = ['all', 'user', 'admin'] as const;

const EXPORT_ROLE_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'user', label: 'Regular Users' },
  { value: 'admin', label: 'Admins Only' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [adminCount, setAdminCount] = useState(0);

  const [role, setRole] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showExport, setShowExport] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15', sortBy, sortOrder });
      if (role !== 'all') params.set('role', role);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, role, search, sortBy, sortOrder]);

  // Fetch admin count separately for stats card
  const fetchAdminCount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users?role=admin&limit=1');
      if (res.ok) {
        const data = await res.json();
        setAdminCount(data.pagination.total);
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchAdminCount(); }, [fetchAdminCount]);
  useEffect(() => { setPage(1); }, [role, search, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const handleToggleAdmin = async (user: IUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user._id, role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
        fetchAdminCount();
      }
    } catch (error) { console.error('Error toggling admin', error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        fetchAdminCount();
      }
    } catch (error) { console.error('Error deleting user', error); }
  };

  const handleExport = async (filters: ExportFilters) => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({ limit: '10000', sortBy: 'registrationDate', sortOrder: 'desc' });
      if (filters.status !== 'all') params.set('role', filters.status);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const rows = (data.users as IUser[]).map(u => ({
        Name: u.name,
        Email: u.email,
        Phone: u.phone || '—',
        Role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
        Joined: new Date(u.registrationDate).toLocaleDateString('en-IN'),
      }));
      const columns = [
        { key: 'Name', label: 'Name' },
        { key: 'Email', label: 'Email' },
        { key: 'Phone', label: 'Phone' },
        { key: 'Role', label: 'Role' },
        { key: 'Joined', label: 'Joined Date' },
      ];
      exportToExcel(rows, columns, `users-${new Date().toISOString().slice(0, 10)}`);
    } catch (err) { console.error('Export failed', err); }
    finally { setIsExporting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{pagination.total} total users</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 px-4 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Admin
          </button>
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-5 rounded-2xl border border-gray-100 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
        </div>
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-5 rounded-2xl border border-gray-100 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Users</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{adminCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, phone..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-accent-purple text-white rounded-xl text-sm font-medium hover:bg-accent-purple/90 transition-colors">Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Clear</button>}
        </form>
        <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o as 'asc' | 'desc'); }} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
          <option value="registrationDate-desc">Newest First</option>
          <option value="registrationDate-asc">Oldest First</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="email-asc">Email A–Z</option>
        </select>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-white/10">
        {ROLE_TABS.map(tab => (
          <button key={tab} onClick={() => setRole(tab)} className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors capitalize ${role === tab ? 'border-accent-purple text-accent-purple' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            {tab === 'all' ? 'All Users' : tab === 'admin' ? 'Admins Only' : 'Regular Users'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />)}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">No users found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('name')}>
                      <span className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('email')}>
                      <span className="flex items-center gap-1">Email <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('registrationDate')}>
                      <span className="flex items-center gap-1">Joined <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300'}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{new Date(user.registrationDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleAdmin(user)} className={`p-2 rounded-lg transition-colors ${user.role === 'admin' ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'}`} title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}>
                            <Shield className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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
            <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user) => (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Verified</div>
                    <span>{new Date(user.registrationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                    <button onClick={() => handleToggleAdmin(user)} className="p-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <AdminPagination page={pagination.page} totalPages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
      </div>

      <AdminExportModal
        open={showExport}
        onClose={() => setShowExport(false)}
        title="Export Users"
        statusOptions={EXPORT_ROLE_OPTIONS}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <AdminAddUserModal
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSuccess={(newUser) => {
          setUsers(prev => [newUser, ...prev]);
          setPagination(prev => ({ ...prev, total: prev.total + 1 }));
          if (newUser.role === 'admin') fetchAdminCount();
        }}
      />
    </div>
  );
}
