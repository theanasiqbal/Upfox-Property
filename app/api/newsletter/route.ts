import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Newsletter } from '@/lib/db/models/Newsletter';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

        const existing = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existing) {
            // Don't reveal if subscribed, still return success
            return NextResponse.json({ success: true });
        }

        await Newsletter.create({ email });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/newsletter]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
