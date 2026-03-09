'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit, X, ArrowUpDown, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';

interface Service {
    _id: string;
    identifier: string;
    title: string;
    shortDescription: string;
    description: string;
    features: string[];
    image: string | null;
    order: number;
    createdAt: string;
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState<string[]>(['']);
    const [image, setImage] = useState('');
    const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload');
    const [order, setOrder] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch('/api/services');
            if (res.ok) {
                const data = await res.json();
                setServices(data.services);
            }
        } catch (error) {
            console.error('Error fetching services', error);
            setErrorMessage('Failed to load services.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchServices(); }, [fetchServices]);



    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete the "${name}" service?`)) return;
        setErrorMessage('');
        try {
            const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setServices(prev => prev.filter(s => s._id !== id));
            } else {
                setErrorMessage('Failed to delete service.');
            }
        } catch { setErrorMessage('Error deleting service.'); }
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const addFeatureField = () => setFeatures([...features, '']);

    const removeFeatureField = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures.length ? newFeatures : ['']);
    };

    const openModal = (service?: Service) => {
        if (service) {
            setEditId(service._id);
            setTitle(service.title);
            setShortDescription(service.shortDescription);
            setDescription(service.description);
            setFeatures(service.features.length ? service.features : ['']);
            setImage(service.image || '');
            setImageInputType((service.image && !service.image.includes('res.cloudinary.com')) ? 'url' : 'upload');
            setOrder(service.order);
        } else {
            setEditId(null);
            setTitle('');
            setShortDescription('');
            setDescription('');
            setFeatures(['']);
            setImage('');
            setImageInputType('upload');
            setOrder(services.length);
        }
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        // Clean features (remove empty string features)
        const cleanedFeatures = features.filter(f => f.trim() !== '');

        // Ensure image respects the selected input type
        const finalImage = imageInputType === 'upload' && image && !image.includes('res.cloudinary.com') ? null :
            imageInputType === 'url' ? image :
                imageInputType === 'upload' ? image : null;

        try {
            const url = '/api/admin/services';
            const method = editId ? 'PATCH' : 'POST';


            const body = JSON.stringify({
                id: editId,
                title,
                shortDescription,
                description,
                features: cleanedFeatures,
                image: finalImage,
                order
            });

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body,
            });

            const data = await res.json();

            if (res.ok) {
                setIsModalOpen(false);
                fetchServices();
            } else {
                setErrorMessage(data.error || 'Failed to save service.');
            }
        } catch {
            setErrorMessage('Error submitting service.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage the services offered on the website
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl shadow-sm transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Add Service
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl flex justify-between items-center">
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')}><X className="w-4 h-4" /></button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                    ))
                ) : services.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                        No services found. Click "Add Service" to create one.
                    </div>
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => openModal(service)}
                                    className="p-2 text-gray-400 hover:text-accent-purple bg-gray-50 hover:bg-purple-50 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service._id, service.title)}
                                    className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                    {service.image ? (
                                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1 pr-16 max-w-full overflow-hidden">
                                    <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-white truncate">{service.title}</h3>
                                    <p className="text-sm font-semibold text-accent-purple mb-2 truncate">{service.shortDescription}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{service.description}</p>

                                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Features ({service.features.length})</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        {service.features.slice(0, 3).map((f, i) => (
                                            <li key={i} className="flex gap-2 items-start">
                                                <span className="text-accent-purple">•</span>
                                                <span className="truncate">{f}</span>
                                            </li>
                                        ))}
                                        {service.features.length > 3 && (
                                            <li className="text-gray-400 italic font-medium pl-3">
                                                +{service.features.length - 3} more...
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-100 dark:border-white/10 overflow-hidden relative">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 shrink-0">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editId ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                                        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" placeholder="e.g., Office Space for Rent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
                                        <input type="number" required min="0" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description *</label>
                                    <input type="text" required value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" placeholder="e.g., Flexible leases in prime business areas" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description *</label>
                                    <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl resize-y" placeholder="Detailed explanation of the service..." />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Banner Image (Optional)</label>
                                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => { setImageInputType('upload'); setImage(''); }}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${imageInputType === 'upload' ? 'bg-white dark:bg-navy-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                            >
                                                Upload File
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setImageInputType('url'); setImage(''); }}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${imageInputType === 'url' ? 'bg-white dark:bg-navy-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                            >
                                                Image URL
                                            </button>
                                        </div>
                                    </div>

                                    {imageInputType === 'upload' ? (
                                        <div>
                                            <ImageUpload
                                                maxImages={1}
                                                existingImages={image ? [image] : []}
                                                onImagesChange={(urls) => setImage(urls.length > 0 ? urls[0] : '')}
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Upload a high-quality image for the service banner. Defaults to Cloudinary.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl" placeholder="https://..." />
                                            <p className="text-xs text-gray-500 mt-1">Provide an external URL for the banner image directly.</p>
                                            {image && (
                                                <div className="mt-3 w-full h-32 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-gray-50 dark:bg-white/5 relative">
                                                    <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</label>
                                    <div className="space-y-2">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={e => handleFeatureChange(index, e.target.value)}
                                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                                                    placeholder={`Feature ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeatureField(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                                                    disabled={features.length === 1}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addFeatureField} className="mt-2 text-sm text-accent-purple font-medium hover:underline flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Add Feature
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl font-medium disabled:opacity-50">
                                        {isSubmitting ? 'Saving...' : (editId ? 'Update Service' : 'Create Service')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
