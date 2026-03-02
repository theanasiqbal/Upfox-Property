import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Inquiry } from '@/lib/db/models/Inquiry';
import { Property } from '@/lib/db/models/Property';
import { getUserFromCookies } from '@/lib/jwt';

// PATCH /api/inquiries/[id] — seller updates status
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { id } = await params;
        const { status } = await req.json();

        if (!['new', 'contacted', 'closed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });

        // Verify ownership (seller must own the related property) or admin
        if (payload.role !== 'admin') {
            const property = await Property.findById(inquiry.propertyId).lean();
            if (!property || property.sellerId.toString() !== payload.userId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        inquiry.status = status;
        await inquiry.save();
        return NextResponse.json({ inquiry });
    } catch (err) {
        console.error('[PATCH /api/inquiries/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
