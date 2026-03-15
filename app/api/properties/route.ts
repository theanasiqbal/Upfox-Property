import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/Property';
import { User } from '@/lib/db/models/User';
import { getUserFromCookies } from '@/lib/jwt';

// GET /api/properties — public, filtered
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '12'));
        const skip = (page - 1) * limit;

        // Admin can see all, everyone else sees only approved
        const payload = await getUserFromCookies();
        const isAdmin = payload?.role === 'admin' || payload?.role === 'subadmin';
        const sellerOnly = searchParams.get('seller') === 'me' && payload;

        // Build filter
        const filter: Record<string, unknown> = {};

        if (sellerOnly) {
            filter.sellerId = payload!.userId;
        } else if (!isAdmin || searchParams.get('status')) {
            filter.status = searchParams.get('status') || 'approved';
        }

        if (searchParams.get('city')) filter.city = { $regex: searchParams.get('city'), $options: 'i' };
        if (searchParams.get('type')) filter.propertyType = searchParams.get('type');
        if (searchParams.get('listingType')) filter.listingType = searchParams.get('listingType');
        if (searchParams.get('availability')) filter.availability = searchParams.get('availability');
        if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
            filter.price = {};
            if (searchParams.get('minPrice')) (filter.price as any).$gte = Number(searchParams.get('minPrice'));
            if (searchParams.get('maxPrice')) (filter.price as any).$lte = Number(searchParams.get('maxPrice'));
        }

        const [properties, total] = await Promise.all([
            Property.find(filter).sort({ listingDate: -1 }).skip(skip).limit(limit).lean(),
            Property.countDocuments(filter),
        ]);

        return NextResponse.json({
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[GET /api/properties]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/properties — authenticated
export async function POST(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const body = await req.json();
        const seller = await User.findById(payload.userId).lean();
        if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });

        const isAdmin = payload.role === 'admin' || payload.role === 'subadmin';

        const property = await Property.create({
            ...body,
            length: body.length || undefined,
            breadth: body.breadth || undefined,
            sellerId: payload.userId,
            ownerName: seller.name,
            ownerPhone: seller.phone || '',
            ownerEmail: seller.email,
            status: isAdmin ? 'approved' : 'pending',
        });


        return NextResponse.json({ property }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/properties]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
