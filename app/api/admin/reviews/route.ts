import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';
import { getUserFromCookies } from '@/lib/jwt';

async function isAdmin() {
    const payload = await getUserFromCookies();
    return payload?.role === 'admin' || payload?.role === 'subadmin';
}

export async function GET(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '15'));
        const skip = (page - 1) * limit;

        const isApprovedParam = searchParams.get('isApproved');
        const isFeaturedParam = searchParams.get('isFeatured');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        const filter: Record<string, unknown> = {};
        if (isApprovedParam !== null && isApprovedParam !== 'all') filter.isApproved = isApprovedParam === 'true';
        if (isFeaturedParam !== null && isFeaturedParam !== 'all') filter.isFeatured = isFeaturedParam === 'true';

        const allowedSortFields: Record<string, string> = {
            createdAt: 'createdAt',
            rating: 'rating',
            name: 'name',
        };
        const sortField = allowedSortFields[sortBy] || 'createdAt';

        const [reviews, total] = await Promise.all([
            Review.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
            Review.countDocuments(filter),
        ]);

        return NextResponse.json({
            reviews,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[GET /api/admin/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { name, rating, message, role = 'Customer', isFeatured = false } = body;

        if (!name || !rating || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        if (isFeatured) {
            const featuredCount = await Review.countDocuments({ isFeatured: true });
            if (featuredCount >= 3) {
                return NextResponse.json({ error: 'Maximum uniquely featured testimonials reached (3). Unfeature one first.' }, { status: 400 });
            }
        }

        const review = await Review.create({
            name,
            rating: Number(rating),
            message,
            role,
            isFeatured,
            isApproved: true,
        });

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/admin/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { id, isFeatured, isApproved } = body;

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await connectDB();

        if (isFeatured === true) {
            const featuredCount = await Review.countDocuments({ isFeatured: true, _id: { $ne: id } });
            if (featuredCount >= 3) {
                return NextResponse.json({ error: 'Maximum uniquely featured testimonials reached (3). Unfeature another first.' }, { status: 400 });
            }
        }

        const updateData: Record<string, unknown> = {};
        if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
        if (typeof isApproved === 'boolean') updateData.isApproved = isApproved;

        const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
        if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

        return NextResponse.json({ success: true, review });
    } catch (err) {
        console.error('[PATCH /api/admin/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await connectDB();
        await Review.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/reviews]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
