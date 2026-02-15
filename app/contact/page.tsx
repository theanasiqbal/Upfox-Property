'use client';

import { Suspense, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { StickyMobileCTA } from '@/components/sticky-mobile-cta';
import { CONTACT } from '@/lib/constants';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        propertyInterest: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', phone: '', email: '', message: '', propertyInterest: '' });
    };

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
                        Contact <span className="text-gold">Us</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Get in touch with our team for any property inquiries, service requests, or just to say hello.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info + Map */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-heading">Get In Touch</h2>

                            <div className="space-y-6 mb-10">
                                <a href={`tel:${CONTACT.phone}`} className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5 text-accent-purple" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">+91 {CONTACT.phone}</p>
                                    </div>
                                </a>

                                <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Mail className="w-5 h-5 text-accent-purple" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{CONTACT.email}</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-accent-purple" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{CONTACT.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-accent-purple" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Business Hours</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">Mon - Sat: 9:00 AM - 7:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mb-10">
                                <a
                                    href={`tel:${CONTACT.phone}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-dark-blue hover:bg-dark-blue-dark text-white font-semibold rounded-full text-sm transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Now
                                </a>
                                <a
                                    href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I would like to inquire about a property.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full text-sm transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            </div>

                            {/* Google Map */}
                            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.3!2d79.42!3d28.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDIxJzM2LjAiTiA3OcKwMjUnMTIuMCJF!5e0!3m2!1sen!2sin!4v1"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Upfoxx Floors Location - Civil Lines, Bareilly"
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/10">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading">Send Us a Message</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Fill in the form and our team will get back to you within 24 hours.</p>

                                {submitted && (
                                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                                        ✓ Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your full name"
                                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property Interested In</label>
                                        <select
                                            value={formData.propertyInterest}
                                            onChange={(e) => setFormData({ ...formData, propertyInterest: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="dark:bg-navy-700">Select a type...</option>
                                            <option value="office" className="dark:bg-navy-700">Office Space</option>
                                            <option value="co-working" className="dark:bg-navy-700">Co-Working Space</option>
                                            <option value="meeting-room" className="dark:bg-navy-700">Meeting Room</option>
                                            <option value="residential" className="dark:bg-navy-700">Residential Property</option>
                                            <option value="commercial" className="dark:bg-navy-700">Commercial Property</option>
                                            <option value="virtual-office" className="dark:bg-navy-700">Virtual Office</option>
                                            <option value="property-management" className="dark:bg-navy-700">Property Management</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us about your requirements..."
                                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 btn-gradient font-semibold rounded-xl flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
            <StickyMobileCTA />
        </div>
    );
}
