'use client';

import { MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export function WhatsAppButton() {
    return (
        <a
            href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent('Hi, I am interested in a property listed on Upfoxx Floors. Please share more details.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-7 h-7" />
            {/* Tooltip */}
            <span className="absolute right-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat on WhatsApp
            </span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        </a>
    );
}
