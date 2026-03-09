'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/status-badge';
import { AdminPagination } from '@/components/admin-pagination';
import { AssignSubadminSelect } from '@/components/assign-subadmin-select';
import { Trash2, PhoneCall, RefreshCw, XCircle, Search, ArrowUpDown, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface JobApplication {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    resumeUrl: string;
    status: 'new' | 'contacted' | 'assigned' | 'approved' | 'rejected';
    assignedTo?: string;
    assignedName?: string;
    createdAt: string;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

const STATUS_TABS = ['all', 'new', 'contacted', 'assigned', 'approved', 'rejected'] as const;

export default function AdminJoinUsPage() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'admin';

    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [page, setPage] = useState(1);

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '15', sortBy, sortOrder });
            if (status !== 'all') params.set('status', status);
            if (search) params.set('search', search);
            const res = await fetch(`/api/admin/join-us?${params}`);
            if (res.ok) { const data = await res.json(); setApplications(data.applications); setPagination(data.pagination); }
        } catch (error) { console.error('Error fetching applications', error); }
        finally { setIsLoading(false); }
    }, [page, status, search, sortBy, sortOrder]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);
    useEffect(() => { setPage(1); }, [status, search, sortBy, sortOrder]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };
    const toggleSort = (field: string) => {
        if (sortBy === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        else { setSortBy(field); setSortOrder('desc'); }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/join-us', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
            if (res.ok) setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus as JobApplication['status'] } : a));
        } catch (error) { console.error('Error updating status', error); }
    };

    const handleAssign = async (id: string, subadminId: string | null, subadminName: string | null) => {
        try {
            const res = await fetch('/api/admin/join-us', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, assignedTo: subadminId, assignedName: subadminName }),
            });
            if (res.ok) {
                setApplications(prev => prev.map(a => a._id === id
                    ? { ...a, assignedTo: subadminId || undefined, assignedName: subadminName || undefined, status: subadminId ? 'assigned' : 'new' }
                    : a));
                toast.success(subadminId ? `Assigned to ${subadminName}` : 'Unassigned');
            }
        } catch (error) { console.error('Error assigning', error); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this job application?')) return;
        try {
            const res = await fetch(`/api/admin/join-us?id=${id}`, { method: 'DELETE' });
            if (res.ok) { setApplications(prev => prev.filter(a => a._id !== id)); setPagination(prev => ({ ...prev, total: prev.total - 1 })); }
        } catch (error) { console.error('Error deleting application', error); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{pagination.total} total applicants</p>
                </div>
            </div>

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
                    <option value="createdAt-desc">Newest First</option><option value="createdAt-asc">Oldest First</option>
                    <option value="fullName-asc">Name A–Z</option><option value="fullName-desc">Name Z–A</option>
                </select>
            </div>

            <div className="flex gap-1 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
                {STATUS_TABS.map(tab => (
                    <button key={tab} onClick={() => setStatus(tab)} className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors whitespace-nowrap capitalize ${status === tab ? 'border-accent-purple text-accent-purple' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                        {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />)}</div>
                ) : applications.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No applications found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('createdAt')}><span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('fullName')}><span className="flex items-center gap-1">Applicant <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cover Letter</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Resume</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('status')}><span className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Assigned</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{app.fullName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{app.email}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs"><p className="line-clamp-2" title={app.message}>{app.message}</p></td>
                                        <td className="px-6 py-4 text-center">
                                            <a href={app.resumeUrl.includes('/upload/') ? app.resumeUrl.replace('/upload/', '/upload/fl_attachment/') : app.resumeUrl} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 rounded-lg text-sm font-medium transition-colors">
                                                <Download className="w-4 h-4" /> Download
                                            </a>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={app.status === 'new' ? 'pending' : app.status} /></td>
                                        <td className="px-6 py-4">
                                            {isAdmin ? (
                                                <AssignSubadminSelect
                                                    currentAssignedId={app.assignedTo}
                                                    currentAssignedName={app.assignedName}
                                                    onAssign={(sid, sname) => handleAssign(app._id, sid, sname)}
                                                />
                                            ) : app.assignedName ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs rounded-lg font-medium">{app.assignedName}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {(app.status === 'new' || app.status === 'assigned') && <button onClick={() => handleUpdateStatus(app._id, 'contacted')} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Mark Contacted"><PhoneCall className="w-4 h-4" /></button>}
                                                {app.status === 'contacted' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(app._id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                                                        <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                                                    </>
                                                )}
                                                {isAdmin && app.status !== 'new' && <button onClick={() => handleUpdateStatus(app._id, 'new')} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Reset to New"><RefreshCw className="w-4 h-4" /></button>}
                                                {isAdmin && <button onClick={() => handleDelete(app._id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {pagination.pages > 1 && (
                    <AdminPagination page={pagination.page} totalPages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
                )}
            </div>
        </div>
    );
}
