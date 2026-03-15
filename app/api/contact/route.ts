import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Contact } from '@/lib/db/models/Contact';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, phone, email, message, propertyInterest, inquiryType } = body;

        if (!name || !phone || !email || !message) {
            return NextResponse.json({ error: 'Name, phone, email and message are required' }, { status: 400 });
        }

        const contact = await Contact.create({ name, phone, email, message, propertyInterest, inquiryType });

        return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/contact]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
