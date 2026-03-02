'use client';

import { Suspense, useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { CONTACT } from '@/lib/constants';
import {
    Users, Building2, Handshake, Upload, Send, CheckCircle,
    Phone, Mail, ArrowRight, Briefcase, Star,
} from 'lucide-react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// ─── Form component (needs recaptcha context) ─────────────────────────────────
function PartnerForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const fileRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        partnershipType: '',
        message: '',
    });
    const [fileName, setFileName] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Please enter a valid email address.';
        const digits = formData.phone.replace(/\D/g, '');
        if (digits.length !== 10) errs.phone = 'Phone number must be 10 digits.';
        if (!formData.partnershipType) errs.partnershipType = 'Please select a partnership type.';
        if (!formData.message.trim()) errs.message = 'Please enter your query or message.';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        try {
            if (executeRecaptcha) {
                await executeRecaptcha('partner_form');
            }
            const res = await fetch('/api/partner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, fileName }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setSubmitted(true);
            setFormData({ fullName: '', email: '', phone: '', organization: '', partnershipType: '', message: '' });
            setFileName('');
        } catch {
            // silently continue
        } finally {
            setLoading(false);
        }
    };

    const field = (name: keyof typeof formData) => ({
        value: formData[name],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setFormData({ ...formData, [name]: e.target.value }),
        className: `w-full px-4 py-3 bg-white dark:bg-white/5 border ${errors[name] ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all`,
    });

    if (submitted) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-heading">Query Submitted!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Thank you for your interest in partnering with Upfoxx Floors. Our team will review your query and get back to you within 48 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 btn-gradient font-semibold rounded-full"
                >
                    Submit Another Query
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                    <input type="text" placeholder="Your full name" required {...field('fullName')} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                    <input type="email" placeholder="your@email.com" required {...field('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label>
                    <input type="tel" placeholder="10-digit mobile number" required {...field('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                {/* Organization */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Organization / Company Name</label>
                    <input type="text" placeholder="Your company or agency name" {...field('organization')} />
                </div>
            </div>

            {/* Partnership Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Partnership Type *</label>
                <select
                    required
                    value={formData.partnershipType}
                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border ${errors.partnershipType ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all appearance-none cursor-pointer`}
                >
                    <option value="" className="dark:bg-navy-700">Select a type...</option>
                    <option value="agent" className="dark:bg-navy-700">Real Estate Agent</option>
                    <option value="broker" className="dark:bg-navy-700">Property Broker</option>
                    <option value="vendor" className="dark:bg-navy-700">Vendor / Supplier</option>
                    <option value="other" className="dark:bg-navy-700">Other</option>
                </select>
                {errors.partnershipType && <p className="text-red-500 text-xs mt-1">{errors.partnershipType}</p>}
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Query / Message *</label>
                <textarea
                    rows={4}
                    required
                    placeholder="Tell us how you'd like to partner with us..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border ${errors.message ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {/* File Upload */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Upload Documents (optional)</label>
                <div
                    className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-accent-purple transition-colors"
                    onClick={() => fileRef.current?.click()}
                >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    {fileName ? (
                        <p className="text-sm text-accent-purple font-medium">{fileName}</p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, JPG up to 10MB</p>
                        </>
                    )}
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
            </div> */}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 btn-gradient font-semibold rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 hover:scale-[1.02] transition-all duration-300"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <Send className="w-4 h-4" />
                )}
                {loading ? 'Submitting...' : 'Submit Partnership Query'}
            </button>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                Protected by Google reCAPTCHA. Your data is safe with us.
            </p>
        </form>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PartnerPage() {
    const benefits = [
        { icon: Star, title: 'Competitive Commissions', desc: 'Earn attractive commissions on every successful property deal or workspace booking.' },
        { icon: Briefcase, title: 'Long-Term Partnership', desc: 'We believe in building lasting relationships — not one-time transactions.' },
        { icon: Building2, title: 'Exclusive Listings Access', desc: 'Get early access to exclusive listings and premium inventory before they go public.' },
        { icon: Handshake, title: 'Dedicated Support', desc: 'A dedicated relationship manager handles all your queries and co-ordination.' },
    ];

    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || ''}>
            <div className="min-h-screen bg-white dark:bg-navy-800">
                <Suspense fallback={null}>
                    <Header />
                </Suspense>

                {/* Hero */}
                <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-blue via-dark-blue-dark to-navy-900 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Collaborate With Us</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                            Partner With Upfoxx Floors
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Are you a real estate agent, property broker, or business partner? Submit your query to collaborate with us. We offer competitive commissions and long-term partnerships.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href={`tel:${CONTACT.phone}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-sm transition-all"
                            >
                                <Phone className="w-4 h-4" />
                                +91 {CONTACT.phone}
                            </a>
                            <a
                                href={`mailto:${CONTACT.email}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-sm transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                {CONTACT.email}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Why Partner */}
                <section className="py-20 bg-gray-50 dark:bg-navy-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                                Why Partner With <span className="gradient-text">Us?</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">We grow together — your success is our success</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {benefits.map((b, idx) => {
                                const Icon = b.icon;
                                return (
                                    <div key={idx} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-center hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 group">
                                        <div className="w-14 h-14 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-7 h-7 text-accent-purple" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 font-heading">{b.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Partner Form */}
                <section className="py-20 bg-white dark:bg-navy-700">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                                Submit Your <span className="gradient-text">Partnership Query</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fill in the form below and our partnership team will get back to you within 48 hours.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                            <PartnerForm />
                        </div>
                    </div>
                </section>

                {/* Partner Types */}
                <section className="py-16 bg-gray-50 dark:bg-navy-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-heading">Who Can Partner With Us?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { emoji: '🏡', label: 'Real Estate Agents' },
                                { emoji: '🤝', label: 'Property Brokers' },
                                { emoji: '📦', label: 'Vendors & Suppliers' },
                                { emoji: '💼', label: 'Business Partners' },
                            ].map((item) => (
                                <div key={item.label} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
                                    <div className="text-4xl mb-3">{item.emoji}</div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
                <WhatsAppButton />
            </div>
        </GoogleReCaptchaProvider>
    );
}
