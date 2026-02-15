'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function InquiryForm({ propertyId, propertyTitle }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in "${propertyTitle}". Please provide more details.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Inquiry submitted:', { propertyId, ...formData });
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData((prev) => ({ ...prev, name: '', email: '', phone: '' }));
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Inquiry Sent!</h3>
        <p className="text-gray-600 dark:text-gray-400">We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Send Inquiry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all"
        />
        <input
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all"
        />
        <textarea
          placeholder="Your Message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-sm transition-all resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 btn-gradient font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
