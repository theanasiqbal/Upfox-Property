'use client';

import { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface RateUsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RateUsDialog({ open, onOpenChange }: RateUsDialogProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !rating || !review) return;

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Save to localStorage
        const existingReviews = JSON.parse(localStorage.getItem('upfoxx_user_reviews') || '[]');
        const newReview = {
            name,
            role: role || 'Upfoxx Customer',
            text: review,
            rating,
            date: new Date().toISOString(),
        };
        existingReviews.push(newReview);
        localStorage.setItem('upfoxx_user_reviews', JSON.stringify(existingReviews));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleClose = (isOpen: boolean) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setTimeout(() => {
                setRating(0);
                setHoveredRating(0);
                setName('');
                setRole('');
                setReview('');
                setIsSubmitted(false);
            }, 300);
        }
    };

    const displayRating = hoveredRating || rating;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-dark-blue to-navy-800 px-6 pt-6 pb-8 text-center relative">
                    <button
                        onClick={() => handleClose(false)}
                        className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white font-heading">
                            Rate Your Experience
                        </DialogTitle>
                        <DialogDescription className="text-white/60 text-sm mt-1">
                            Your feedback helps us improve and helps others find us
                        </DialogDescription>
                    </DialogHeader>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mt-5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    className={`w-9 h-9 transition-colors ${star <= displayRating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-white/30'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {displayRating > 0 && (
                        <p className="text-white/70 text-xs mt-2">
                            {displayRating === 1 && 'Poor'}
                            {displayRating === 2 && 'Fair'}
                            {displayRating === 3 && 'Good'}
                            {displayRating === 4 && 'Very Good'}
                            {displayRating === 5 && 'Excellent!'}
                        </p>
                    )}
                </div>

                {/* Form */}
                <div className="px-6 py-5">
                    {isSubmitted ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg font-heading">
                                Thank You! ⭐
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Your review has been posted on our homepage.
                            </p>
                            <button
                                onClick={() => handleClose(false)}
                                className="mt-5 px-6 py-2.5 btn-gradient text-sm font-bold rounded-xl"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Role (e.g., Homeowner, Business Owner)"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Write your review *"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-white/15 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !rating}
                                className="w-full py-2.5 btn-gradient text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Review
                                    </>
                                )}
                            </button>
                            {!rating && (
                                <p className="text-xs text-center text-gray-400">Please select a star rating above</p>
                            )}
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
