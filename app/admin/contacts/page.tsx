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

interface AddContactForm {
    name: string;
    email: string;
    phone: string;
    message: string;
    inquiryType: string;
    propertyInterest: string;
    assignedTo: string;
    assignedName: string;
}

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    inquiryType?: string;
    propertyInterest?: string;
    status: 'new' | 'contacted' | 'assigned' | 'closed';
    assignedTo?: string;
    assignedName?: string;
    createdAt: string;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

const STATUS_TABS = ['all', 'new', 'contacted', 'assigned', 'closed'] as const;
const INQUIRY_TYPES = ['all', 'buying', 'selling', 'renting', 'investment', 'general'];
const EXPORT_STATUS_OPTIONS = [
    { value: 'all', label: 'All' }, { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' }, { value: 'assigned', label: 'Assigned' },
    { value: 'closed', label: 'Closed' },
];

export default function AdminContactsPage() {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'admin';

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
    const [isLoading, setIsLoading] = useState(true);

    const [status, setStatus] = useState<string>('all');
    const [inquiryType, setInquiryType] = useState('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [page, setPage] = useState(1);
    const [showExport, setShowExport] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Add modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<AddContactForm>({
        name: '', email: '', phone: '', message: '', inquiryType: '', propertyInterest: '', assignedTo: '', assignedName: ''
    });
    const [isAdding, setIsAdding] = useState(false);

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '15', sortBy, sortOrder });
            if (status !== 'all') params.set('status', status);
            if (inquiryType !== 'all') params.set('inquiryType', inquiryType);
            if (search) params.set('search', search);
            const res = await fetch(`/api/admin/contacts?${params}`);
            if (res.ok) { const data = await res.json(); setContacts(data.contacts); setPagination(data.pagination); }
        } catch (error) { console.error('Error fetching contacts', error); }
        finally { setIsLoading(false); }
    }, [page, status, inquiryType, search, sortBy, sortOrder]);

    useEffect(() => { fetchContacts(); }, [fetchContacts]);
    useEffect(() => { setPage(1); }, [status, inquiryType, search, sortBy, sortOrder]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };
    const toggleSort = (field: string) => {
        if (sortBy === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        else { setSortBy(field); setSortOrder('desc'); }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) setContacts(prev => prev.map(c => c._id === id ? { ...c, status: newStatus as Contact['status'] } : c));
        } catch (error) { console.error('Error updating status', error); }
    };

    const handleAssign = async (id: string, subadminId: string | null, subadminName: string | null) => {
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, assignedTo: subadminId, assignedName: subadminName }),
            });
            if (res.ok) {
                setContacts(prev => prev.map(c => c._id === id
                    ? { ...c, assignedTo: subadminId || undefined, assignedName: subadminName || undefined, status: subadminId ? 'assigned' : 'new' }
                    : c));
                toast.success(subadminId ? `Assigned to ${subadminName}` : 'Unassigned');
            }
        } catch (error) { console.error('Error assigning', error); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this contact submission?')) return;
        try {
            const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
            if (res.ok) { setContacts(prev => prev.filter(c => c._id !== id)); setPagination(prev => ({ ...prev, total: prev.total - 1 })); }
        } catch (error) { console.error('Error deleting contact', error); }
    };

    const handleExport = async (filters: ExportFilters) => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams({ limit: '10000', sortBy: 'createdAt', sortOrder: 'desc' });
            if (filters.status !== 'all') params.set('status', filters.status);
            if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
            if (filters.dateTo) params.set('dateTo', filters.dateTo);
            const res = await fetch(`/api/admin/contacts?${params}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const rows = (data.contacts as Contact[]).map(c => ({
                Date: new Date(c.createdAt).toLocaleDateString('en-IN'),
                Name: c.name, Email: c.email, Phone: c.phone || '—',
                'Inquiry Type': c.inquiryType || 'General', 'Property Interest': c.propertyInterest || '—',
                Message: c.message, Status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
                'Assigned To': c.assignedName || '—',
            }));
            const columns = [
                { key: 'Date', label: 'Date' }, { key: 'Name', label: 'Name' }, { key: 'Email', label: 'Email' },
                { key: 'Phone', label: 'Phone' }, { key: 'Inquiry Type', label: 'Inquiry Type' },
                { key: 'Property Interest', label: 'Property Interest' }, { key: 'Message', label: 'Message' },
                { key: 'Status', label: 'Status' }, { key: 'Assigned To', label: 'Assigned To' },
            ];
            exportToExcel(rows, columns, `contacts-${new Date().toISOString().slice(0, 10)}`);
        } catch (err) { console.error('Export failed', err); }
        finally { setIsExporting(false); }
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed to add contact');
            }
            toast.success('Contact enquiry added successfully');
            setShowAddModal(false);
            setAddForm({ name: '', email: '', phone: '', message: '', inquiryType: '', propertyInterest: '', assignedTo: '', assignedName: '' });
            fetchContacts();
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us Enquiries</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{pagination.total} total submissions</p>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Add Enquiry
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
                        <input type="text" placeholder="Search by name, email, phone..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
                    </div>
                    <button type="submit" className="px-4 py-2.5 bg-accent-purple text-white rounded-xl text-sm font-medium hover:bg-accent-purple/90 transition-colors">Search</button>
                    {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Clear</button>}
                </form>
                <select value={inquiryType} onChange={e => setInquiryType(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                    {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o as 'asc' | 'desc'); }} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
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
                ) : contacts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No contacts found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('createdAt')}><span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('name')}><span className="flex items-center gap-1">Contact <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Message & Interest</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('status')}><span className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span></th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Assigned</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {contacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                                            <div className="font-semibold text-accent-purple text-xs mb-1 uppercase tracking-wider">{contact.inquiryType || 'General'} {contact.propertyInterest ? `• ${contact.propertyInterest}` : ''}</div>
                                            <p className="line-clamp-2" title={contact.message}>{contact.message}</p>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={contact.status} /></td>
                                        <td className="px-6 py-4">
                                            {isAdmin ? (
                                                <AssignSubadminSelect
                                                    currentAssignedId={contact.assignedTo}
                                                    currentAssignedName={contact.assignedName}
                                                    onAssign={(sid, sname) => handleAssign(contact._id, sid, sname)}
                                                />
                                            ) : contact.assignedName ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs rounded-lg font-medium">{contact.assignedName}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {(contact.status === 'new' || contact.status === 'assigned') && <button onClick={() => handleUpdateStatus(contact._id, 'contacted')} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Mark Contacted"><PhoneCall className="w-4 h-4" /></button>}
                                                {contact.status === 'contacted' && <button onClick={() => handleUpdateStatus(contact._id, 'closed')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Mark Closed"><XCircle className="w-4 h-4" /></button>}
                                                {isAdmin && contact.status !== 'new' && <button onClick={() => handleUpdateStatus(contact._id, 'new')} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Re-open"><RefreshCw className="w-4 h-4" /></button>}
                                                {isAdmin && <button onClick={() => handleDelete(contact._id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>}
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

            <AdminExportModal open={showExport} onClose={() => setShowExport(false)} title="Export Contacts" statusOptions={EXPORT_STATUS_OPTIONS} onExport={handleExport} isExporting={isExporting} />

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white dark:bg-navy-800 z-10">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Contact Enquiry</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleAddContact} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Name *</label>
                                    <input required value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30" placeholder="John Doe" />
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
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Inquiry Type</label>
                                    <select value={addForm.inquiryType} onChange={e => setAddForm(f => ({ ...f, inquiryType: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30">
                                        <option value="">Select a type...</option>
                                        {INQUIRY_TYPES.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Property Type of Interest</label>
                                    <select value={addForm.propertyInterest} onChange={e => setAddForm(f => ({ ...f, propertyInterest: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/30">
                                        <option value="" className="dark:bg-navy-700">Select a type...</option>
                                        <option value="office" className="dark:bg-navy-700">Office Space</option>
                                        <option value="co-working" className="dark:bg-navy-700">Co-Working Space</option>
                                        <option value="meeting-room" className="dark:bg-navy-700">Meeting Room</option>
                                        <option value="residential" className="dark:bg-navy-700">Residential Property</option>
                                        <option value="commercial" className="dark:bg-navy-700">Commercial Property</option>
                                        <option value="virtual-office" className="dark:bg-navy-700">Virtual Office</option>
                                        <option value="property-management" className="dark:bg-navy-700">Property Management</option>
                                    </select>
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
                                    {isAdding ? 'Adding…' : 'Add Enquiry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
