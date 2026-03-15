import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/Property';
import { User } from '@/lib/db/models/User';
import { getUserFromCookies } from '@/lib/jwt';

// PATCH /api/properties/[id]/status — admin only
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const { status, rejectionReason } = await req.json();

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Use approved or rejected.' }, { status: 400 });
        }

        const property = await Property.findByIdAndUpdate(
            id,
            { status, ...(rejectionReason && { rejectionReason }) },
            { new: true }
        );
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });


        return NextResponse.json({ property });
    } catch (err) {
        console.error('[PATCH /api/properties/[id]/status]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
