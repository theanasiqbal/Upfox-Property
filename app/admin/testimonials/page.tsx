'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPagination } from '@/components/admin-pagination';
import { Star, Trash2, CheckCircle, XCircle, Plus, ToggleLeft, ToggleRight, X, ArrowUpDown } from 'lucide-react';

interface Review {
    _id: string;
    name: string;
    role: string;
    rating: number;
    message: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

export default function AdminTestimonialsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Filters
    const [isApproved, setIsApproved] = useState('all');
    const [isFeatured, setIsFeatured] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [page, setPage] = useState(1);

    // Form
    const [name, setName] = useState('');
    const [role, setRole] = useState('Customer');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [featuredCheck, setFeaturedCheck] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchReviews = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const params = new URLSearchParams({ page: String(page), limit: '15', sortBy, sortOrder });
            if (isApproved !== 'all') params.set('isApproved', isApproved);
            if (isFeatured !== 'all') params.set('isFeatured', isFeatured);

            const res = await fetch(`/api/admin/reviews?${params}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching reviews', error);
            setErrorMessage('Failed to load testimonials.');
        } finally {
            setIsLoading(false);
        }
    }, [page, isApproved, isFeatured, sortBy, sortOrder]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);
    useEffect(() => { setPage(1); }, [isApproved, isFeatured, sortBy, sortOrder]);

    const toggleSort = (field: string) => {
        if (sortBy === field) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        else { setSortBy(field); setSortOrder('desc'); }
    };

    const handleToggle = async (id: string, field: 'isApproved' | 'isFeatured', currentValue: boolean) => {
        setErrorMessage('');
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, [field]: !currentValue }),
            });
            const data = await res.json();
            if (res.ok) {
                setReviews(prev => prev.map(r => r._id === id ? { ...r, [field]: !currentValue } : r));
            } else {
                setErrorMessage(data.error || `Failed to update ${field}.`);
            }
        } catch (error) { setErrorMessage(`Error updating ${field}.`); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        setErrorMessage('');
        try {
            const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setReviews(prev => prev.filter(r => r._id !== id));
                setPagination(prev => ({ ...prev, total: prev.total - 1 }));
            } else {
                setErrorMessage('Failed to delete testimonial.');
            }
        } catch { setErrorMessage('Error deleting testimonial.'); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, role, message, rating, isFeatured: featuredCheck }),
            });
            const data = await res.json();
            if (res.ok) {
                setIsModalOpen(false);
                setName(''); setRole('Customer'); setMessage(''); setRating(5); setFeaturedCheck(false);
                fetchReviews();
            } else {
                setErrorMessage(data.error || 'Failed to create testimonial.');
            }
        } catch { setErrorMessage('Error submitting testimonial.'); }
        finally { setIsSubmitting(false); }
    };

    const featuredCount = reviews.filter(r => r.isFeatured).length;

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {pagination.total} total · {featuredCount}/3 featured on homepage
                    </p>
                </div>
                <button
                    onClick={() => { setErrorMessage(''); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl shadow-sm transition-colors"
                >
                    <Plus className="w-5 h-5" /> Add Testimonial
                </button>
            </div>

            {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl flex justify-between items-center">
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')}><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select value={isApproved} onChange={e => setIsApproved(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                    <option value="all">All Statuses</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                </select>
                <select value={isFeatured} onChange={e => setIsFeatured(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                    <option value="all">All (Featured & Not)</option>
                    <option value="true">Featured Only</option>
                    <option value="false">Not Featured</option>
                </select>
                <select value={`${sortBy}-${sortOrder}`} onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o as 'asc' | 'desc'); }} className="px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                    <option value="name-asc">Name A–Z</option>
                </select>
            </div>

            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />)}</div>
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No testimonials found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('createdAt')}>
                                        <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('name')}>
                                        <span className="flex items-center gap-1">Reviewer <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-accent-purple" onClick={() => toggleSort('rating')}>
                                        <span className="flex items-center gap-1">Rating <ArrowUpDown className="w-3 h-3" /></span>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Approved</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Featured</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{new Date(review.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{review.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{review.role}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex text-amber-500">
                                                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                                            <p className="line-clamp-2" title={review.message}>{review.message}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleToggle(review._id, 'isApproved', review.isApproved)} className={`p-1 transition-colors ${review.isApproved ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} title={review.isApproved ? 'Approved' : 'Pending'}>
                                                {review.isApproved ? <CheckCircle className="w-6 h-6 mx-auto" /> : <XCircle className="w-6 h-6 mx-auto" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleToggle(review._id, 'isFeatured', review.isFeatured)} className={`p-1 transition-colors ${review.isFeatured ? 'text-accent-purple' : 'text-gray-300 dark:text-gray-600'}`} title={review.isFeatured ? 'Featured on Homepage' : 'Not Featured'}>
                                                {review.isFeatured ? <ToggleRight className="w-8 h-8 mx-auto" /> : <ToggleLeft className="w-8 h-8 mx-auto" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <button onClick={() => handleDelete(review._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <AdminPagination page={pagination.page} totalPages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
            </div>

            {/* Add Testimonial Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-gray-100 dark:border-white/10">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Testimonial</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role/Company *</label>
                                    <input type="text" required value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating *</label>
                                <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                                <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl resize-none" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="feature_check" checked={featuredCheck} onChange={e => setFeaturedCheck(e.target.checked)} className="w-4 h-4 rounded text-accent-purple" />
                                <label htmlFor="feature_check" className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature on Homepage</label>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl font-medium mt-4 disabled:opacity-50">
                                {isSubmitting ? 'Saving...' : 'Save Testimonial'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
