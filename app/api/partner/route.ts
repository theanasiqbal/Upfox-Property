import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Partner } from '@/lib/db/models/Partner';
import { sendPartnerAutoReply, sendPartnerAdminAlert } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { fullName, email, phone, organization, partnershipType, message, fileName } = body;

        if (!fullName || !email || !phone || !partnershipType || !message) {
            return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
        }

        const partner = await Partner.create({ fullName, email, phone, organization, partnershipType, message, fileName });

        // Brevo emails (non-blocking)
        sendPartnerAutoReply(email, fullName);
        sendPartnerAdminAlert({ fullName, email, organization: organization || 'N/A', partnershipType });

        return NextResponse.json({ success: true, id: partner._id }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/partner]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
