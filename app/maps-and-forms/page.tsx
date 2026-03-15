'use client';

import { Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { FileText, ArrowRight, Link as LinkIcon, Download, Map as MapIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
    _id: string;
    title: string;
    type: 'pdf' | 'link';
    url: string;
    isActive: boolean;
    createdAt: string;
}

export default function MapsAndFormsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch('/api/documents');
                if (res.ok) {
                    const data = await res.json();
                    setDocuments(data.documents);
                }
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const isNew = (dateString: string) => {
        const createdDate = new Date(dateString);
        const today = new Date();
        const diffInTime = today.getTime() - createdDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays <= 7; // consider "new" if uploaded within 7 days
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors">
            <Suspense fallback={null}>
                <Header />
            </Suspense>

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-blue to-navy-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                <div className="max-w-4xl mx-auto text-center relative z-10 p-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                        Maps & <span className="text-gold">Forms</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Access important notices, property maps, and official registration forms.
                    </p>
                </div>
            </section>

            {/* Document List Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 flex-1">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-navy-800 border-2 border-accent-purple/50 dark:border-accent-purple/30 rounded-2xl p-6 md:p-10 shadow-sm relative">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-white/10">
                            <div className="w-12 h-12 bg-accent-purple/10 dark:bg-accent-purple/20 text-accent-purple rounded-xl flex items-center justify-center">
                                <MapIcon className="w-6 h-6 " />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                Available Documents
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="w-6 items-center shrink-0">
                                           <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-full animate-pulse" />
                                        </div>
                                        <div className="flex-1 h-6 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p>No notices available currently.</p>
                            </div>
                        ) : (
                            <ul className="space-y-5">
                                {documents.map((doc) => (
                                    <li key={doc._id} className="group">
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start md:items-center gap-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 p-3 -mx-3 rounded-xl transition-all"
                                        >
                                            <div className="shrink-0 mt-1 md:mt-0 text-accent-purple/60 group-hover:text-accent-purple transition-colors">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                            
                                            <div className="flex-1 flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-1">
                                                <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-accent-purple transition-colors">
                                                    {doc.title}
                                                </span>
                                                
                                                {/* NEW BADGE */}
                                                {isNew(doc.createdAt) && (
                                                    <span className="flex items-center">
                                                        {/* Replicating the 'new' badge look */}
                                                        <span className="relative inline-flex items-center justify-center">
                                                            <div className="absolute w-8 h-4 bg-red-600 blur-[2px] rounded-lg animate-pulse" />
                                                            <span className="relative px-1.5 py-0.5 text-[10px] font-black italic tracking-wider text-yellow-300 drop-shadow-md">
                                                                <span className="absolute inset-0.5 bg-red-600/50 rounded pointer-events-none" />
                                                                <span className="relative z-10 uppercase inline-block -rotate-3 border border-red-900 bg-red-600/90 rounded px-1">NEW</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                )}
                                                
                                                <div className="w-full md:w-auto md:ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 uppercase font-semibold">
                                                        {doc.type}
                                                    </span>
                                                    {doc.type === 'pdf' ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
        </div>
    );
}
