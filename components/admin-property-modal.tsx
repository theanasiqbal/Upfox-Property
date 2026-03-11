'use client';

import { useState } from 'react';
import { IProperty } from '@/lib/db/models/Property';
import { StatusBadge } from '@/components/status-badge';
import { X, Check, Star, StarOff, Archive, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface AdminPropertyModalProps {
    property: IProperty;
    onClose: () => void;
    // Called after a successful action so parent can update its list
    onAction?: (id: string, action: 'approved' | 'rejected' | 'archived' | 'featured') => void;
}

export function AdminPropertyModal({ property, onClose, onAction }: AdminPropertyModalProps) {
    const [rejectMode, setRejectMode] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isBusy, setIsBusy] = useState(false);

    const callApi = async (body: Record<string, unknown>) => {
        setIsBusy(true);
        try {
            const res = await fetch('/api/admin/properties', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: property._id, ...body }),
            });
            return res.ok;
        } catch {
            return false;
        } finally {
            setIsBusy(false);
        }
    };

    const handleApprove = async () => {
        const ok = await callApi({ status: 'approved' });
        if (ok) { onAction?.(property._id, 'approved'); onClose(); }
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) return;
        const ok = await callApi({ status: 'rejected', rejectionReason });
        if (ok) { onAction?.(property._id, 'rejected'); onClose(); }
    };

    const handleArchive = async () => {
        const ok = await callApi({ status: property.status === 'approved' ? 'archived' : 'approved' });
        if (ok) { onAction?.(property._id, 'archived'); onClose(); }
    };

    const handleToggleFeature = async () => {
        const ok = await callApi({ featured: !property.featured });
        if (ok) { onAction?.(property._id, 'featured'); onClose(); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">Property Details</h2>
                        <StatusBadge status={property.status} />
                        {property.featured && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                                <Star className="w-3 h-3 fill-current" /> Featured
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Info */}
                        <div className="space-y-5">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
                                <p className="text-3xl font-bold text-accent-purple mt-1">
                                    ₹{property.price?.toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    { label: 'City', value: property.city },
                                    { label: 'State', value: property.state },
                                    { label: 'Type', value: property.propertyType },
                                    { label: 'Listing', value: property.listingType },
                                    { label: 'Condition', value: property.condition },
                                    { label: 'Area', value: `${property.area} sq ft` },
                                    { label: 'BDA/RERA Approved', value: property.bdaApproved ? 'Yes' : 'No' },
                                    { label: 'Availability', value: property.availability || 'Available' },
                                    { label: 'Submitted', value: new Date(property.listingDate).toLocaleDateString() },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
                                        <p className="font-medium text-gray-900 dark:text-white capitalize">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {property.amenities?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Amenities</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {property.amenities.map(a => (
                                            <span key={a} className="px-2.5 py-1 bg-accent-purple/10 text-accent-purple text-xs font-medium rounded-full">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">{property.description}</p>
                            </div>
                        </div>

                        {/* Right: Images + Seller */}
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Images</h3>
                                {property.images?.length > 0 && !property.video ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {property.images.slice(0, 4).map((img, i) => (
                                            <div key={i} className={`relative rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                                                <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : property.video ? (
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                        <video
                                            src={property.video}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                                        No images or video attached
                                    </div>
                                )}
                            </div>

                            {/* Seller Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Seller Information</h3>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Name</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{property.ownerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Email</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{property.ownerEmail}</span>
                                    </div>
                                    {property.ownerPhone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Phone</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{property.ownerPhone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Address</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                                    {property.location}, {property.city}, {property.state} — {property.zipcode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    {property.status === 'pending' ? (
                        // ── Pending: Approve / Reject ──
                        !rejectMode ? (
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setRejectMode(true)}
                                    disabled={isBusy}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" /> Reject Property
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isBusy}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" /> {isBusy ? 'Approving…' : 'Approve Property'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reason for Rejection <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    autoFocus
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Provide a reason that will be sent to the seller…"
                                    className="w-full text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 min-h-[90px] focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                />
                                <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => setRejectMode(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRejectSubmit}
                                        disabled={!rejectionReason.trim() || isBusy}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> {isBusy ? 'Rejecting…' : 'Confirm Rejection'}
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        // ── Approved / Archived / Rejected: Feature + Archive toggle ──
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={handleToggleFeature}
                                disabled={isBusy}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors border flex items-center gap-2 disabled:opacity-50 ${property.featured
                                    ? 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-900/20'
                                    : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                    }`}
                            >
                                {property.featured ? <><StarOff className="w-4 h-4" /> Remove Featured</> : <><Star className="w-4 h-4" /> Feature Property</>}
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={isBusy}
                                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-xl transition-colors disabled:opacity-50 ${property.status === 'approved'
                                    ? 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                    : 'text-white bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {property.status === 'approved'
                                    ? <><Archive className="w-4 h-4" /> Archive</>
                                    : <><CheckCircle className="w-4 h-4" /> Re-list</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
