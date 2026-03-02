import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';
import { getUserFromCookies } from '@/lib/jwt';

// GET /api/reviews — returns approved reviews (public)
export async function GET() {
    try {
        await connectDB();
        const reviews = await Review.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        return NextResponse.json({ reviews });
    } catch (err) {
        console.error('[GET /api/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/reviews — public submission
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, rating, message } = await req.json();

        if (!name || !rating || !message) {
            return NextResponse.json({ error: 'Name, rating, and message are required' }, { status: 400 });
        }
        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const review = await Review.create({ name, rating, message, isApproved: false });
        return NextResponse.json({ success: true, id: review._id }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/reviews — admin approves/rejects a review
export async function PATCH(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
        }
        await connectDB();
        const { id, isApproved } = await req.json();
        const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
        if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        return NextResponse.json({ review });
    } catch (err) {
        console.error('[PATCH /api/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
