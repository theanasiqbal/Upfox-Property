'use client';

import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { StickyMobileCTA } from '@/components/sticky-mobile-cta';
import { SERVICES, CONTACT } from '@/lib/constants';
import { Building2, Laptop, DoorOpen, Home as HomeIcon, Store, Globe, Settings, ArrowRight, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const serviceIcons: Record<string, React.ElementType> = {
    'office-space': Building2,
    'co-working': Laptop,
    'meeting-rooms': DoorOpen,
    'residential': HomeIcon,
    'commercial': Store,
    'virtual-office': Globe,
    'property-management': Settings,
};

export default function ServicesPage() {
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
                        Our <span className="text-gold">Services</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Comprehensive real estate & workspace solutions tailored for Bareilly&apos;s business owners, startups, professionals, and families.
                    </p>
                </div>
            </section>

            {/* Services Detail */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-16">
                    {SERVICES.map((service, idx) => {
                        const Icon = serviceIcons[service.id] || Building2;
                        const isEven = idx % 2 === 0;

                        return (
                            <div
                                key={service.id}
                                className={`flex flex-col lg:flex-row items-center gap-12 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Icon / Visual */}
                                <div className="flex-shrink-0 w-full lg:w-2/5">
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-12 flex items-center justify-center border border-gray-100 dark:border-white/10">
                                        <div className="w-24 h-24 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-3xl flex items-center justify-center">
                                            <Icon className="w-12 h-12 text-accent-purple" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                                        {service.title}
                                    </h2>
                                    <p className="text-sm text-accent-purple font-semibold mb-4">{service.shortDescription}</p>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3 mb-6">
                                        {service.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/properties"
                                        className="inline-flex items-center gap-2 px-6 py-3 btn-gradient font-semibold rounded-full text-sm"
                                    >
                                        Browse Properties
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gray-50 dark:bg-navy-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                        Need a Custom Solution?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                        Contact us to discuss your specific requirements. Our team will create a tailored package for your needs.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href={`tel:${CONTACT.phone}`}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark-blue hover:bg-dark-blue-dark text-white font-semibold rounded-full transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            Call: {CONTACT.phone}
                        </a>
                        <a
                            href={`${CONTACT.whatsappUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
            <StickyMobileCTA />
        </div>
    );
}
