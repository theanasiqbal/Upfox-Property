'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/status-badge';
import { AdminPagination } from '@/components/admin-pagination';
import { AdminExportModal } from '@/components/admin-export-modal';
import { AssignSubadminSelect } from '@/components/assign-subadmin-select';
import { exportToExcel, ExportFilters } from '@/lib/export-excel';
import { Trash2, PhoneCall, RefreshCw, XCircle, Search, ArrowUpDown, Download, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddPartnerForm {
    fullName: string;
    email: string;
    phone: string;
    partnershipType: string;
    organization: string;
    message: string;
    assignedTo: string;
    assignedName: string;
}

interface Partner {
    _id: string; fullName: string; email: string; phone: string;
    partnershipType: string; organization?: string; message: string;
    status: 'pending' | 'contacted' | 'assigned' | 'closed';
    assignedTo?: string; assignedName?: string; createdAt: string;
}
interface Pagination { page: number; limit: number; total: number; pages: number; }

const STATUS_TABS = ['all', 'pending', 'contacted', 'assigned', 'closed'] as const;
const PARTNERSHIP_TYPES = ['all', 'Property Broker', 'Real Estate Agent', 'Vendor/Supplier', 'Business Partner', 'other'];
const EXPORT_STATUS_OPTIONS = [
    { value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' },
    { value: 'contacted', label: 'Contacted' }, { value: 'assigned', label: 'Assigned' },
    { value: 'closed', label: 'Closed' },
];

export default function AdminPartnersPage() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'admin';

    const [partners, setPartners] = useState<Partner[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>('all');
    const [partnershipType, setPartnershipType] = useState('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [page, setPage] = useState(1);
    const [showExport, setShowExport] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Add modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<AddPartnerForm>({
        fullName: '', email: '', phone: '', partnershipType: '', organization: '', message: '', assignedTo: '', assignedName: ''
    });
    const [isAdding, setIsAdding] = useState(false);

    const fetchPartners = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '15', sortBy, sortOrder });
            if (status !== 'all') params.set('status', status);
            if (partnershipType !== 'all') params.set('partnershipType', partnershipType);
            if (search) params.set('search', search);
            const res = await fetch(`/api/admin/partners?${params}`);
            if (res.ok) { const data = await res.json(); setPartners(data.partners); setPagination(data.pagination); }
        } catch (error) { console.error('Error fetching partners', error); }
        finally { setIsLoading(false); }
    }, [page, status, partnershipType, search, sortBy, sortOrder]);

    useEffect(() => { fetchPartners(); }, [fetchPartners]);
    useEffect(() => { setPage(1); }, [status, partnershipType, search, sortBy, sortOrder]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };
    const toggleSort = (field: string) => {
        if (sortBy === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        else { setSortBy(field); setSortOrder('desc'); }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/partners', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
            if (res.ok) setPartners(prev => prev.map(p => p._id === id ? { ...p, status: newStatus as Partner['status'] } : p));
        } catch (error) { console.error('Error updating status', error); }
    };

    const handleAssign = async (id: string, subadminId: string | null, subadminName: string | null) => {
        try {
            const res = await fetch('/api/admin/partners', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, assignedTo: subadminId, assignedName: subadminName }),
            });
            if (res.ok) {
                setPartners(prev => prev.map(p => p._id === id
                    ? { ...p, assignedTo: subadminId || undefined, assignedName: subadminName || undefined, status: subadminId ? 'assigned' : 'pending' }
                    : p));
                toast.success(subadminId ? `Assigned to ${subadminName}` : 'Unassigned');
            }
        } catch (error) { console.error('Error assigning', error); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this partner query?')) return;
        try {
            const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
            if (res.ok) { setPartners(prev => prev.filter(p => p._id !== id)); setPagination(prev => ({ ...prev, total: prev.total - 1 })); }
        } catch (error) { console.error('Error deleting partner', error); }
    };

    const handleExport = async (filters: ExportFilters) => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams({ limit: '10000', sortBy: 'createdAt', sortOrder: 'desc' });
            if (filters.status !== 'all') params.set('status', filters.status);
            if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
            if (filters.dateTo) params.set('dateTo', filters.dateTo);
            const res = await fetch(`/api/admin/partners?${params}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const rows = (data.partners as Partner[]).map(p => ({
                Date: new Date(p.createdAt).toLocaleDateString('en-IN'),
                'Full Name': p.fullName, Email: p.email, Phone: p.phone || '—',
                'Partnership Type': p.partnershipType, Organization: p.organization || 'Individual',
                Message: p.message, Status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
                'Assigned To': p.assignedName || '—',
            }));
            const columns = [
                { key: 'Date', label: 'Date' }, { key: 'Full Name', label: 'Full Name' },
                { key: 'Email', label: 'Email' }, { key: 'Phone', label: 'Phone' },
                { key: 'Partnership Type', label: 'Partnership Type' }, { key: 'Organization', label: 'Organization' },
                { key: 'Message', label: 'Message' }, { key: 'Status', label: 'Status' },
                { key: 'Assigned To', label: 'Assigned To' },
            ];
            exportToExcel(rows, columns, `partners-${new Date().toISOString().slice(0, 10)}`);
        } catch (err) { console.error('Export failed', err); }
        finally { setIsExporting(false); }
    };

    const handleAddPartner = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const res = await fetch('/api/admin/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed to add partner query');
            }
            toast.success('Partnership query added successfully');
            setShowAddModal(false);
            setAddForm({ fullName: '', email: '', phone: '', partnershipType: '', organization: '', message: '', assignedTo: '', assignedName: '' });
            fetchPartners();
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partnership Queries</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{pagination.total} total applications</p>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Add Query
                        </button>
                    )}
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export Excel
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name, email, organization..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
                    </div>
                    <button type="submit" className="px-4 py-2.5 bg-accent-purple text-white rounded-xl text-sm font-medium hover:bg-accent-purple/90 transition-colors">Search</button>
                    {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Clear</button>}
                </form>
                <select value={partnershipType} onChange={e => setPartnershipType(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                    {PARTNERSHIP_TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
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
                ) : partners.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No partner queries found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('createdAt')}><span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('fullName')}><span className="flex items-center gap-1">Partner <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Type / Org</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('status')}><span className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Assigned</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {partners.map((partner) => (
                                    <tr key={partner._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{new Date(partner.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{partner.fullName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{partner.email}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{partner.phone}</div>
                                        </td>
                                        <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{partner.partnershipType}</div><div className="text-sm text-gray-500 dark:text-gray-400">{partner.organization || 'Individual'}</div></td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs"><p className="line-clamp-2" title={partner.message}>{partner.message}</p></td>
                                        <td className="px-6 py-4"><StatusBadge status={partner.status} /></td>
                                        <td className="px-6 py-4">
                                            {isAdmin ? (
                                                <AssignSubadminSelect
                                                    currentAssignedId={partner.assignedTo}
                                                    currentAssignedName={partner.assignedName}
                                                    onAssign={(sid, sname) => handleAssign(partner._id, sid, sname)}
                                                />
                                            ) : partner.assignedName ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs rounded-lg font-medium">{partner.assignedName}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {(partner.status === 'pending' || partner.status === 'assigned') && <button onClick={() => handleUpdateStatus(partner._id, 'contacted')} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Mark Contacted"><PhoneCall className="w-4 h-4" /></button>}
                                                {partner.status === 'contacted' && <button onClick={() => handleUpdateStatus(partner._id, 'closed')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Mark Closed"><XCircle className="w-4 h-4" /></button>}
                                                {isAdmin && partner.status !== 'pending' && <button onClick={() => handleUpdateStatus(partner._id, 'pending')} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Re-open"><RefreshCw className="w-4 h-4" /></button>}
                                                {isAdmin && <button onClick={() => handleDelete(partner._id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <AdminPagination page={pagination.page} totalPages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
            </div>

            <AdminExportModal open={showExport} onClose={() => setShowExport(false)} title="Export Partners" statusOptions={EXPORT_STATUS_OPTIONS} onExport={handleExport} isExporting={isExporting} />

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white dark:bg-navy-800 z-10">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Partnership Query</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleAddPartner} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Full Name *</label>
                                    <input required value={addForm.fullName} onChange={e => setAddForm(f => ({ ...f, fullName: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Phone *</label>
                                    <input required value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="+91..." />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Email *</label>
                                <input required type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="john@example.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Partnership Type *</label>
                                    <select required value={addForm.partnershipType} onChange={e => setAddForm(f => ({ ...f, partnershipType: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30">
                                        <option value="">Select a type...</option>
                                        {PARTNERSHIP_TYPES.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Organization</label>
                                    <input value={addForm.organization} onChange={e => setAddForm(f => ({ ...f, organization: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="e.g. Acme Corp" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Message *</label>
                                <textarea required rows={3} value={addForm.message} onChange={e => setAddForm(f => ({ ...f, message: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30 resize-none" placeholder="Message content..." />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Assign to Subadmin (optional)</label>
                                <AssignSubadminSelect
                                    currentAssignedId={addForm.assignedTo || undefined}
                                    currentAssignedName={addForm.assignedName || undefined}
                                    onAssign={(sid, sname) => setAddForm(f => ({ ...f, assignedTo: sid || '', assignedName: sname || '' }))}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" disabled={isAdding} className="flex-1 px-4 py-2.5 bg-accent-purple text-white rounded-xl text-sm font-semibold hover:bg-accent-purple/90 disabled:opacity-50 transition-colors">
                                    {isAdding ? 'Adding…' : 'Add Query'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
