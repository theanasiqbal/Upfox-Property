import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';

export async function GET() {
    try {
        await connectDB();

        // Use native MongoDB collection update to bypass Mongoose schema cache
        await Review.collection.updateMany(
            { name: 'Vikram Singh' },
            { $set: { role: 'Business Owner, Civil Lines', isFeatured: true, isApproved: true, rating: 5 } }
        );

        await Review.collection.updateMany(
            { name: 'Neha Agarwal' },
            { $set: { role: 'Startup Founder', isFeatured: true, isApproved: true, rating: 5 } }
        );

        await Review.collection.updateMany(
            { name: 'Rakesh & Meena Gupta' },
            { $set: { role: 'Family, Rajendra Nagar', isFeatured: true, isApproved: true, rating: 5 } }
        );

        return NextResponse.json({ success: true, message: 'Bypassed mongoose cache' });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
