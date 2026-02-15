'use client';

import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { StickyMobileCTA } from '@/components/sticky-mobile-cta';
import { CONTACT } from '@/lib/constants';
import { MapPin, Users, Target, Eye, ShieldCheck, Award, CheckCircle } from 'lucide-react';

export default function AboutPage() {
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
                        About <span className="text-gold">Upfoxx Floors</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Your trusted partner for real estate & workspace solutions in Bareilly since day one.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-heading">
                                Bareilly&apos;s Premier <span className="gradient-text">Real Estate</span> Platform
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                Upfoxx Floors was born from a simple vision — to transform how people find and manage properties in Bareilly. Located in the heart of Civil Lines, we understand the local market like no one else.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                Whether you&apos;re a startup founder looking for a co-working space, a family searching for the perfect home, or a business owner seeking prime office space — Upfoxx Floors is your one-stop solution.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                We combine deep local expertise with a modern, transparent approach to real estate. Every listing is verified, every price is upfront, and every client receives personalized support from our dedicated team.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=500&fit=crop"
                                alt="Upfoxx Floors office in Civil Lines Bareilly"
                                className="rounded-2xl w-full object-cover shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-accent-purple text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg font-heading">
                                Civil Lines, Bareilly
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-20 bg-gray-50 dark:bg-navy-900 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                            <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-accent-purple" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-heading">Our Mission</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                To provide Bareilly with a trusted, transparent, and technology-driven real estate platform that simplifies property search, workspace solutions, and property management.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                            <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6">
                                <Eye className="w-7 h-7 text-accent-purple" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-heading">Our Vision</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                To become the most trusted real estate brand in Bareilly, setting the gold standard for verified listings, premium workspace solutions, and professional property management.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                            <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6">
                                <Award className="w-7 h-7 text-accent-purple" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-heading">Our Values</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                Transparency, trust, and commitment to quality. We believe in admin-verified listings, honest pricing, and putting our clients&apos; needs first in every interaction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { number: '500+', label: 'Properties Listed', icon: MapPin },
                            { number: '200+', label: 'Happy Clients', icon: Users },
                            { number: '10+', label: 'Bareilly Areas Covered', icon: Target },
                            { number: '100%', label: 'Verified Listings', icon: ShieldCheck },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/10 hover:scale-105 transition-all duration-300 group">
                                <stat.icon className="w-8 h-8 text-accent-purple mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-heading">{stat.number}</p>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-20 bg-gray-50 dark:bg-navy-900 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 font-heading">
                        What Makes Us <span className="gradient-text">Different</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {[
                            'Admin-approved properties — no fake listings',
                            'Dedicated focus on Bareilly & Civil Lines',
                            'Workspace solutions — office, co-working, meeting rooms',
                            'Transparent pricing with no hidden charges',
                            'End-to-end property management services',
                            'Virtual office services for GST registration',
                            'Secure inquiry system with SSL encryption',
                            'Fast, mobile-first, premium design',
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
            <StickyMobileCTA />
        </div>
    );
}
