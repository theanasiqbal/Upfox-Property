'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Upload, Trash2, AlertCircle, CheckCircle, FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
    _id: string;
    title: string;
    type: 'pdf' | 'link';
    url: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminDocumentsPage() {
    const { currentUser } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'pdf' | 'link'>('pdf');
    const [url, setUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('/api/admin/documents');
            const data = await res.json();
            if (res.ok) {
                setDocuments(data.documents || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const resetForm = () => {
        setTitle('');
        setUrl('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Please provide a title.');
            return;
        }

        if (type === 'link' && !url.trim()) {
            setError('Please provide a URL.');
            return;
        }

        if (type === 'pdf' && !selectedFile) {
            setError('Please select a PDF file.');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            let finalUrl = url;

            // If PDF, first upload to Cloudinary
            if (type === 'pdf' && selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadRes = await fetch('/api/upload/document', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload PDF');
                finalUrl = uploadData.url;
            }

            // Save Document
            const res = await fetch('/api/admin/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim(), type, url: finalUrl }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save document');

            setDocuments((prev) => [data.document, ...prev]);
            resetForm();
            setSuccess('Document added successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/documents/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setDocuments((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maps & Forms</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage PDFs and external links for notices and maps.</p>
            </div>

            {/* Upload Form */}
            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent-purple" />
                    Add New Document
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Document Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Upfoxx Floors Map"
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
                            />
                        </div>

                        {/* Type Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Upload Type
                            </label>
                            <div className="flex bg-gray-100 dark:bg-navy-900/50 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => { setType('pdf'); resetForm(); }}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${type === 'pdf' ? 'bg-white dark:bg-navy-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    <FileText className="w-4 h-4" /> PDF File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setType('link'); resetForm(); }}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${type === 'link' ? 'bg-white dark:bg-navy-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    <LinkIcon className="w-4 h-4" /> Web Link
                                </button>
                            </div>
                        </div>

                        {/* File / Link Input */}
                        <div>
                            {type === 'pdf' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select PDF <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={fileInputRef}
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-sm text-gray-900 dark:text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent-purple/10 file:text-accent-purple hover:file:bg-accent-purple/20 file:transition-colors focus:outline-none"
                                    />
                                    {selectedFile && <p className="mt-2 text-xs text-gray-500">Selected: {selectedFile.name}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Website URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 btn-gradient font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Add Document
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Documents List */}
            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent-purple" />
                    Uploaded Documents
                    {!loading && (
                        <span className="ml-2 px-2.5 py-0.5 bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple text-xs font-semibold rounded-full">
                            {documents.length}
                        </span>
                    )}
                </h2>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 dark:bg-white/10 rounded-xl w-full" />
                        ))}
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No documents found. Upload your first document above.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 rounded-t-xl">
                                <tr>
                                    <th className="px-6 py-4 font-medium first:rounded-tl-xl">Title</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Date ADDED</th>
                                    <th className="px-6 py-4 font-medium text-right last:rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {documents.map((doc) => (
                                    <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {doc.type === 'pdf' ? (
                                                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900 dark:text-white max-w-sm truncate" title={doc.title}>
                                                    {doc.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-gray-600 dark:text-gray-300">{doc.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-accent-purple dark:hover:text-accent-purple hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
                                                    title="Open Link"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    disabled={deletingId === doc._id}
                                                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingId === doc._id ? (
                                                        <div className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
