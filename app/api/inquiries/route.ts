import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Inquiry } from '@/lib/db/models/Inquiry';
import { Property } from '@/lib/db/models/Property';
import { User } from '@/lib/db/models/User';
import { getUserFromCookies } from '@/lib/jwt';
import { sendInquiryNotificationEmail } from '@/lib/email';

// POST /api/inquiries — public
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { propertyId, name: buyerName, email: buyerEmail, phone: buyerPhone, message } = await req.json();

        if (!propertyId || !buyerName || !buyerEmail || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const property = await Property.findById(propertyId).lean();
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

        const inquiry = await Inquiry.create({ propertyId, buyerName, buyerEmail, buyerPhone, message });

        // Increment Property queryCount directly
        await Property.findByIdAndUpdate(propertyId, { $inc: { queryCount: 1 } });

        return NextResponse.json({ inquiry }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/inquiries]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET /api/inquiries — seller sees their own, admin sees all
export async function GET(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        if (payload.role === 'admin' || payload.role === 'subadmin') {
            const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
            return NextResponse.json({ inquiries });
        }

        // Seller: get their property IDs first
        const sellerProperties = await Property.find({ sellerId: payload.userId }).select('_id').lean();
        const propertyIds = sellerProperties.map((p) => p._id);
        const inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ inquiries });
    } catch (err) {
        console.error('[GET /api/inquiries]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
