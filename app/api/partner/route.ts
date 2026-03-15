import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Partner } from '@/lib/db/models/Partner';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { fullName, email, phone, organization, partnershipType, message, fileName } = body;

        if (!fullName || !email || !phone || !partnershipType || !message) {
            return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
        }

        const partner = await Partner.create({ fullName, email, phone, organization, partnershipType, message, fileName });

        return NextResponse.json({ success: true, id: partner._id }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/partner]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
