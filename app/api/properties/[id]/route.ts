import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/Property';
import { getUserFromCookies } from '@/lib/jwt';

// GET /api/properties/[id]
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const property = await Property.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        ).lean();

        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        return NextResponse.json({ property });
    } catch (err) {
        console.error('[GET /api/properties/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/properties/[id] — seller (owner) or admin
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { id } = await params;
        const property = await Property.findById(id);
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

        const isOwner = property.sellerId.toString() === payload.userId;
        if (!isOwner && payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        // Sellers cannot change status themselves
        if (payload.role !== 'admin') delete body.status;

        const updated = await Property.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json({ property: updated });
    } catch (err) {
        console.error('[PATCH /api/properties/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/properties/[id] — seller (owner) or admin (soft-delete)
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { id } = await params;
        const property = await Property.findById(id);
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

        const isOwner = property.sellerId.toString() === payload.userId;
        if (!isOwner && payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await Property.findByIdAndUpdate(id, { status: 'archived' });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/properties/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
