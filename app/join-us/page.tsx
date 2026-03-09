'use client';

import { Suspense, useState, useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { CONTACT } from '@/lib/constants';
import {
    Users, Building2, Upload, Send, CheckCircle,
    Phone, Mail, ArrowRight, Briefcase, Star, Lightbulb, TrendingUp
} from 'lucide-react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// ─── Form Component ────────────────────────────────────────────────────────
function JoinUsForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const fileRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Please enter a valid email address.';
        const digits = formData.phone.replace(/\D/g, '');
        if (digits.length !== 10) errs.phone = 'Phone number must be 10 digits.';
        if (!formData.message.trim()) errs.message = 'Please enter your cover letter or message.';
        if (!resumeFile) errs.resume = 'Please upload your resume.';
        else {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(resumeFile.type)) {
                errs.resume = 'Only PDF and DOC/DOCX files are allowed.';
            }
            if (resumeFile.size > 10 * 1024 * 1024) {
                errs.resume = 'File size must be under 10MB.';
            }
        }
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        try {
            // 1. Upload Resume
            const resumeFormData = new FormData();
            resumeFormData.append('resume', resumeFile as File);

            const uploadRes = await fetch('/api/upload/resume', {
                method: 'POST',
                body: resumeFormData
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload resume');

            const resumeUrl = uploadData.url;

            // 2. Submit Application
            let gRecaptchaToken = '';
            if (executeRecaptcha) {
                gRecaptchaToken = await executeRecaptcha('join_form');
            }

            const res = await fetch('/api/join-us', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, resumeUrl, gRecaptchaToken }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');

            setSubmitted(true);
            setFormData({ fullName: '', email: '', phone: '', message: '' });
            setResumeFile(null);
        } catch (err: any) {
            setErrors({ general: err.message || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const field = (name: keyof typeof formData) => ({
        value: formData[name],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setFormData({ ...formData, [name]: e.target.value }),
        className: `w-full px-4 py-3 bg-white dark:bg-white/5 border ${errors[name] ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all`,
    });

    if (submitted) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-heading">Application Submitted!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Thank you for applying to join Upfoxx Floors. Our HR team will review your application and resume, and get back to you shortly.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 btn-gradient font-semibold rounded-full"
                >
                    Submit Another Application
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            {errors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 text-sm">
                    {errors.general}
                </div>
            )}

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
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cover Letter / Message *</label>
                <textarea
                    rows={4}
                    required
                    placeholder="Tell us about yourself and why you'd be a great fit..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border ${errors.message ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {/* Resume Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Upload Resume (PDF, DOC) *</label>
                <div
                    className={`border-2 border-dashed ${errors.resume ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} rounded-xl p-6 text-center cursor-pointer hover:border-accent-purple transition-colors bg-white dark:bg-white/5`}
                    onClick={() => fileRef.current?.click()}
                >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    {resumeFile ? (
                        <p className="text-sm text-accent-purple font-medium">{resumeFile.name}</p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload your resume</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                        </>
                    )}
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setResumeFile(file);
                        if (errors.resume) setErrors({ ...errors, resume: '' });
                    }}
                />
                {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
            </div>

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
                {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                Protected by Google reCAPTCHA. Your data is safe with us.
            </p>
        </form>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function JoinUsPage() {
    const benefits = [
        { icon: Lightbulb, title: 'Innovative Culture', desc: 'Work in an environment that values fresh ideas and out-of-the-box thinking.' },
        { icon: TrendingUp, title: 'Career Growth', desc: 'We invest in our team members with continuous learning and promotion opportunities.' },
        { icon: Star, title: 'Competitive Perks', desc: 'Enjoy industry-leading compensation, flexible hours, and health benefits.' },
        { icon: Users, title: 'Great Team', desc: 'Collaborate with a passionate, diverse team dedicated to revolutionizing real estate.' },
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
                        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Careers</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                            Join the Upfoxx Team
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Are you passionate about real estate, workspaces, or technology? Come build the future with us. We're always looking for talented individuals to join our growing team.
                        </p>
                    </div>
                </section>

                {/* Why Join Us */}
                <section className="py-20 bg-gray-50 dark:bg-navy-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                                Why Work With <span className="gradient-text">Us?</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Build a rewarding career while transforming how people work and live.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {benefits.map((b, idx) => {
                                const Icon = b.icon;
                                return (
                                    <div key={idx} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-center shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 group">
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

                {/* Join Us Form */}
                <section className="py-20 bg-white dark:bg-navy-700">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                                Apply <span className="gradient-text">Now</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Send us your resume and tell us why you'd be a great addition to Upfoxx Floors.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
                            <JoinUsForm />
                        </div>
                    </div>
                </section>

                <Footer />
                <WhatsAppButton />
            </div>
        </GoogleReCaptchaProvider>
    );
}
