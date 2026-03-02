import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Upfoxx Floors',
    description: 'Review the Terms of Service for Upfoxx Floors — guidelines governing the use of our real estate and workspace platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-navy-800">
            <Suspense fallback={null}>
                <Header />
            </Suspense>

            <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-blue to-navy-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white font-heading mb-3">Terms of Service</h1>
                    <p className="text-white/70">Last updated: February 2026</p>
                </div>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-8 text-gray-600 dark:text-gray-400">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">1. Acceptance of Terms</h2>
                            <p className="leading-relaxed">
                                By accessing and using the Upfoxx Floors website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">2. Use of Services</h2>
                            <p className="leading-relaxed">
                                You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others. You must not misuse our platform by submitting false property listings, fraudulent inquiries, or spam submissions.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">3. Property Listings</h2>
                            <p className="leading-relaxed">
                                All property listings on Upfoxx Floors are subject to admin approval. We reserve the right to remove or reject any listing that does not meet our quality standards or violates our policies. Listings must be accurate and not misleading.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">4. Partnership Terms</h2>
                            <p className="leading-relaxed">
                                Partner registrations are subject to verification and approval by Upfoxx Floors management. Commission structures and partnership terms are agreed upon separately and in writing. Upfoxx Floors reserves the right to terminate partnerships at its discretion.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">5. Intellectual Property</h2>
                            <p className="leading-relaxed">
                                All content on the Upfoxx Floors website, including text, images, logos, and design, is the property of Upfoxx Floors and is protected by applicable intellectual property laws. You may not reproduce or distribute our content without prior written permission.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">6. Limitation of Liability</h2>
                            <p className="leading-relaxed">
                                Upfoxx Floors acts as a platform connecting property owners and seekers. We are not responsible for the accuracy of third-party listings, disputes between parties, or any losses arising from property transactions facilitated through our platform.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">7. Contact Us</h2>
                            <p className="leading-relaxed">
                                For any questions regarding these Terms of Service, please contact us at{' '}
                                <a href="mailto:info@upfoxxmedia.com" className="text-accent-purple hover:underline">info@upfoxxmedia.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
