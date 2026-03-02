import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Fetch up to 3 approved and explicitly featured reviews
        const reviews = await Review.find({
            isApproved: true,
            isFeatured: true
        })
            .sort({ createdAt: -1 })
            .limit(3);

        return NextResponse.json({ reviews });
    } catch (err) {
        console.error('[GET /api/reviews/featured]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
