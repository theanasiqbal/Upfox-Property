'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export function StickyMobileCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-navy-800 border-t border-gray-200 dark:border-white/10 px-4 py-3 flex gap-3">
            <a
                href={`tel:${CONTACT.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-dark-blue hover:bg-dark-blue-dark text-white font-semibold rounded-xl text-sm transition-all"
            >
                <Phone className="w-4 h-4" />
                Call Now
            </a>
            <a
                href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I am interested in a property listed on Upfoxx Floors.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-all"
            >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
            </a>
        </div>
    );
}
