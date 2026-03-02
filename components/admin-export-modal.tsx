'use client';

import { useState } from 'react';
import { X, Download, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { ExportFilters } from '@/lib/export-excel';

interface StatusOption {
    value: string;
    label: string;
}

interface AdminExportModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    statusOptions: StatusOption[];
    onExport: (filters: ExportFilters) => Promise<void>;
    isExporting: boolean;
}

export function AdminExportModal({
    open,
    onClose,
    title,
    statusOptions,
    onExport,
    isExporting,
}: AdminExportModalProps) {
    const [status, setStatus] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    if (!open) return null;

    const handleExport = async () => {
        await onExport({ status, dateFrom, dateTo });
        onClose();
    };

    const hasDateFilter = dateFrom || dateTo;
    const hasStatusFilter = status !== 'all';
    const filtersActive = hasDateFilter || hasStatusFilter;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Configure filters before downloading</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Status Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <Filter className="w-4 h-4" />
                            Status Filter
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setStatus(opt.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${status === opt.value
                                        ? 'bg-accent-purple text-white border-accent-purple'
                                        : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-accent-purple/50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="w-4 h-4" />
                            Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">From</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={e => setDateFrom(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">To</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    min={dateFrom}
                                    onChange={e => setDateTo(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                                />
                            </div>
                        </div>
                        {hasDateFilter && dateFrom && dateTo && (
                            <p className="text-xs text-accent-purple mt-1.5">
                                Exporting records from {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {/* Summary */}
                    <div className={`p-3 rounded-xl text-sm ${filtersActive
                        ? 'bg-accent-purple/10 border border-accent-purple/20 text-accent-purple dark:text-accent-purple-light'
                        : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-400'
                        }`}>
                        {filtersActive
                            ? `Exporting: ${status !== 'all' ? status.toUpperCase() + ' records' : 'All statuses'}${hasDateFilter ? ' within selected date range' : ''}`
                            : 'No filters selected — all records will be exported'}
                    </div>

                    {/* Clear dates shortcut */}
                    {hasDateFilter && (
                        <button
                            onClick={() => { setDateFrom(''); setDateTo(''); }}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                        >
                            ✕ Clear date range
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        {isExporting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download Excel
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
