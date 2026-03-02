import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/Property';
import { getUserFromCookies } from '@/lib/jwt';

async function isAdmin() {
    const payload = await getUserFromCookies();
    return payload?.role === 'admin';
}

export async function GET(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '15'));
        const skip = (page - 1) * limit;

        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const city = searchParams.get('city');
        const propertyType = searchParams.get('propertyType');
        const sortBy = searchParams.get('sortBy') || 'listingDate';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        const filter: Record<string, unknown> = {};
        if (status && status !== 'all') filter.status = status;
        if (city) filter.city = { $regex: city, $options: 'i' };
        if (propertyType) filter.propertyType = propertyType;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ];
        }

        const allowedSortFields: Record<string, string> = {
            listingDate: 'listingDate',
            price: 'price',
            title: 'title',
            status: 'status',
        };
        const sortField = allowedSortFields[sortBy] || 'listingDate';

        const [properties, total] = await Promise.all([
            Property.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            Property.countDocuments(filter),
        ]);

        return NextResponse.json({
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[GET /api/admin/properties]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { id, status, rejectionReason, featured } = body;

        if (!id) return NextResponse.json({ error: 'Missing property ID' }, { status: 400 });

        await connectDB();

        const updateData: Record<string, unknown> = {};
        if (status) {
            const allowedStatuses = ['pending', 'approved', 'rejected', 'archived'];
            if (!allowedStatuses.includes(status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }
            updateData.status = status;
        }
        if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
        if (typeof featured === 'boolean') updateData.featured = featured;

        const property = await Property.findByIdAndUpdate(id, updateData, { new: true });
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

        return NextResponse.json({ success: true, property });
    } catch (err) {
        console.error('[PATCH /api/admin/properties]', err);
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
        await Property.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/properties]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
