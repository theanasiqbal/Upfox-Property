'use client';

import { useState, useEffect } from 'react';
import { X, Send, User, Phone, MessageSquare, ChevronDown } from 'lucide-react';

const INTEREST_OPTIONS = [
    'Buy a Property',
    'Rent a Property',
    'Co-working Space',
    'Office Space',
    'Virtual Office',
    'Meeting Room',
    'Other',
];

export function EnquiryPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        interest: '',
        message: '',
    });

    useEffect(() => {
        // Don't show if already dismissed this session
        if (sessionStorage.getItem('enquiry_popup_dismissed')) return;

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('enquiry_popup_dismissed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.interest) return;

        setIsSubmitting(true);
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Enquiry submitted:', formData);
        setIsSubmitting(false);
        setIsSubmitted(true);

        // Auto-dismiss after success
        setTimeout(() => {
            handleDismiss();
        }, 3000);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] animate-in slide-in-from-bottom-5 fade-in duration-500">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-purple-dark rounded-2xl blur opacity-30 animate-pulse" />

            <div className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-dark-blue to-navy-800 px-5 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold font-heading text-sm">
                            Looking for a Property?
                        </h3>
                        <p className="text-white/60 text-xs mt-0.5">
                            Get a free consultation today
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {isSubmitted ? (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Thank You!</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                We&apos;ll reach out to you shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Name */}
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                                />
                            </div>

                            {/* Interest */}
                            <div className="relative">
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <select
                                    value={formData.interest}
                                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all appearance-none"
                                >
                                    <option value="">Interested In *</option>
                                    {INTEREST_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Message */}
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    placeholder="Message (optional)"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 btn-gradient text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Enquiry
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
