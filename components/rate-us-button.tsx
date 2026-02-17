'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { RateUsDialog } from '@/components/rate-us-dialog';

export function RateUsButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold text-xs px-3 py-2.5 rounded-r-xl shadow-lg hover:shadow-xl transition-all hover:translate-x-0 -translate-x-0.5 group"
                aria-label="Rate Us"
            >
                <Star className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">Rate Us</span>
            </button>

            <RateUsDialog open={open} onOpenChange={setOpen} />
        </>
    );
}
