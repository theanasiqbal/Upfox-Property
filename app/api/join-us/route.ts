import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { JobApplication } from '@/lib/db/models/JobApplication';

// Verify Google reCAPTCHA
async function verifyRecaptcha(token: string) {
    const secret = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    if (!secret) return true; // Skip if not configured

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json();
    return data.success && data.score >= 0.5;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { fullName, email, phone, message, resumeUrl, gRecaptchaToken } = body;

        if (!fullName || !email || !phone || !message || !resumeUrl) {
            return NextResponse.json({ error: 'All fields including resume are required' }, { status: 400 });
        }

        // Verify captcha if token is provided
        if (gRecaptchaToken) {
            const isValid = await verifyRecaptcha(gRecaptchaToken);
            if (!isValid) {
                return NextResponse.json({ error: 'Failed captcha verification. Please try again.' }, { status: 400 });
            }
        }

        const application = await JobApplication.create({
            fullName,
            email,
            phone,
            message,
            resumeUrl,
            status: 'new',
        });

        return NextResponse.json({ success: true, application });
    } catch (err) {
        console.error('[POST /api/join-us]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
