import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';
import { getUserFromCookies } from '@/lib/jwt';

/** GET /api/reviews/pending — admin only, fetch all unapproved reviews */
export async function GET() {
    try {
        const payload = await getUserFromCookies();
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
        }

        await connectDB();
        const reviews = await Review.find({ isApproved: false })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({ reviews });
    } catch (err) {
        console.error('[GET /api/reviews/pending]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
