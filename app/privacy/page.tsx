import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Upfoxx Floors',
    description: 'Read the Privacy Policy for Upfoxx Floors — learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-navy-800">
            <Suspense fallback={null}>
                <Header />
            </Suspense>

            <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-blue to-navy-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white font-heading mb-3">Privacy Policy</h1>
                    <p className="text-white/70">Last updated: February 2026</p>
                </div>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
                    <div className="space-y-8 text-gray-600 dark:text-gray-400">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">1. Information We Collect</h2>
                            <p className="leading-relaxed">
                                We collect information you provide directly to us when you fill out contact forms, inquiry forms, or partner registration forms. This may include your name, email address, phone number, organization name, and any messages or documents you choose to submit.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">2. How We Use Information</h2>
                            <p className="leading-relaxed">
                                We use the information collected to respond to your inquiries, process partnership requests, send property listings and workspace updates (if subscribed), improve our services, and communicate with you about your requirements.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">3. Information Sharing</h2>
                            <p className="leading-relaxed">
                                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your information may be shared with trusted third parties who assist us in operating our website, provided that those parties agree to keep this information confidential.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">4. Data Security</h2>
                            <p className="leading-relaxed">
                                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. We strive to use commercially acceptable means to protect your information.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">5. Cookies</h2>
                            <p className="leading-relaxed">
                                Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings, but this may affect some functionality of the website.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-3">6. Contact Us</h2>
                            <p className="leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:support@upfoxxfloors.co.in" className="text-accent-purple hover:underline">support@upfoxxfloors.co.in</a> or call us at +91 7534835937.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
