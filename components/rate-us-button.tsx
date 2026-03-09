'use client';

import { usePathname } from 'next/navigation';
import { Star } from 'lucide-react';

export function RateUsButton() {
    const pathname = usePathname();

    if (pathname !== '/') {
        return null;
    }

    return (
        <a
            href="https://g.page/r/CZxK5Jh_bHwJEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold text-xs px-3 py-2.5 rounded-r-xl shadow-lg hover:shadow-xl transition-all hover:translate-x-0 -translate-x-0.5 group"
            aria-label="Rate Us"
        >
            <Star className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">Rate Us</span>
        </a>
    );
}
