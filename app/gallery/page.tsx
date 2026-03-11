'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { StickyMobileCTA } from '@/components/sticky-mobile-cta';
import { X, ZoomIn, Images } from 'lucide-react';

interface GalleryItem {
    _id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
}

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

    useEffect(() => {
        fetch('/api/gallery')
            .then((r) => r.json())
            .then((d) => setItems(d.items || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-navy-800">
            <Suspense fallback={null}>
                <Header />
            </Suspense>

            {/* Hero */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-blue to-navy-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                        Our <span className="text-gold">Gallery</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Take a visual journey through our properties, spaces, and moments.
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-white/10" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 rounded-full bg-accent-purple/10 dark:bg-accent-purple/20 flex items-center justify-center mx-auto mb-4">
                                <Images className="w-10 h-10 text-accent-purple" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-heading">No Photos Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Our gallery is being set up. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                                    onClick={() => setLightbox(item)}
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Title */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="text-white font-semibold text-base font-heading drop-shadow-sm translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                            {item.title}
                                        </p>
                                    </div>

                                    {/* Zoom icon on hover */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <ZoomIn className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-0 right-0 -translate-y-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={lightbox.imageUrl}
                            alt={lightbox.title}
                            className="max-h-[80vh] max-w-full object-contain rounded-xl"
                        />
                        <p className="text-white font-semibold text-lg mt-4 font-heading">{lightbox.title}</p>
                    </div>
                </div>
            )}

            <Footer />
            <WhatsAppButton />
            <StickyMobileCTA />
        </div>
    );
}
