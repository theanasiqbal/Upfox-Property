'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageUpload } from '@/components/image-upload';
import { useAuth } from '@/lib/auth-context';
import { Upload, Trash2, AlertCircle, Images, CheckCircle } from 'lucide-react';

interface GalleryItem {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

export default function AdminGalleryPage() {
    const { currentUser } = useAuth();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    // Track the images array from image upload component
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    // Incremented after each successful submit to force-remount ImageUpload
    const [formKey, setFormKey] = useState(0);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Sync single uploaded image url from ImageUpload component
    useEffect(() => {
        if (uploadedImages.length > 0) {
            setImageUrl(uploadedImages[0]);
        } else {
            setImageUrl('');
        }
    }, [uploadedImages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !imageUrl) {
            setError('Please provide both a title and an image.');
            return;
        }
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title: title.trim(), imageUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to add item');
            setItems((prev) => [data.item, ...prev]);
            setTitle('');
            setImageUrl('');
            setUploadedImages([]);
            setFormKey((k) => k + 1); // Remount ImageUpload to clear its internal preview state
            setSuccess('Photo added to gallery successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/gallery?id=${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            setItems((prev) => prev.filter((item) => item._id !== id));
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage photos shown on the public Gallery page.</p>
            </div>

            {/* Upload Form */}
            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent-purple" />
                    Add New Photo
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Photo Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Modern Co-Working Space"
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
                        />
                    </div>

                    {/* Image Upload — single image (max 1) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Photo <span className="text-red-500">*</span>
                        </label>
                        <ImageUpload
                            key={formKey}
                            onImagesChange={(urls) => setUploadedImages(urls)}
                            maxImages={1}
                            existingImages={[]}
                        />
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
                        disabled={submitting || !title || !imageUrl}
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
                                Add to Gallery
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Existing Gallery */}
            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Images className="w-5 h-5 text-accent-purple" />
                    Gallery Photos
                    {!loading && (
                        <span className="ml-2 px-2.5 py-0.5 bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple text-xs font-semibold rounded-full">
                            {items.length}
                        </span>
                    )}
                </h2>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[4/3] rounded-xl bg-gray-200 dark:bg-white/10" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <Images className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No photos uploaded yet. Add your first photo above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item) => (
                            <div key={item._id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-700 aspect-[4/3]">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    disabled={deletingId === item._id}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm disabled:opacity-50"
                                    title="Delete photo"
                                >
                                    {deletingId === item._id ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
