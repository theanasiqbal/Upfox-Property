import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/User';
import { getUserFromCookies } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
        }

        await connectDB();
        const { mode, role, userIds, singleUserId, subject, htmlBody } = await req.json();

        if (!subject || !htmlBody) {
            return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
        }

        let targetEmails: string[] = [];

        if (mode === 'individual') {
            if (!singleUserId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
            const user = await User.findById(singleUserId).select('email').lean();
            if (user?.email) targetEmails.push(user.email);
        } else if (mode === 'selected') {
            if (!userIds || !Array.isArray(userIds)) return NextResponse.json({ error: 'User IDs array required' }, { status: 400 });
            const users = await User.find({ _id: { $in: userIds } }).select('email').lean();
            targetEmails = users.map(u => u.email).filter(Boolean);
        } else if (mode === 'all') {
            const filter: any = {};
            if (role && role !== 'all') filter.role = role;
            const users = await User.find(filter).select('email').lean();
            targetEmails = users.map(u => u.email).filter(Boolean);
        }

        if (targetEmails.length === 0) {
            return NextResponse.json({ error: 'No recipients found' }, { status: 404 });
        }

        // Batch sending (Brevo limit 50 per request)
        const BATCH_SIZE = 50;
        const results = [];
        const BREVO_API_KEY = process.env.BREVO_API_KEY;

        if (!BREVO_API_KEY) {
            return NextResponse.json({ error: 'SMTP configuration missing' }, { status: 500 });
        }

        for (let i = 0; i < targetEmails.length; i += BATCH_SIZE) {
            const batch = targetEmails.slice(i, i + BATCH_SIZE);
            const brevoPayload = {
                sender: {
                    email: process.env.BREVO_FROM_EMAIL || 'support@upfoxxfloors.co.in',
                    name: process.env.BREVO_FROM_NAME || 'Upfoxx Floors',
                },
                to: batch.map(email => ({ email })),
                subject: subject,
                htmlContent: htmlBody,
            };

            const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': BREVO_API_KEY,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(brevoPayload),
            });

            if (res.ok) {
                results.push({ batch: i / BATCH_SIZE + 1, success: true });
            } else {
                const err = await res.text();
                results.push({ batch: i / BATCH_SIZE + 1, success: false, error: err });
                console.error(`[AdminEmail] Batch ${i / BATCH_SIZE + 1} failed:`, err);
            }
        }

        const successCount = results.filter(r => r.success).length;
        const totalBatches = results.length;

        return NextResponse.json({
            success: successCount > 0,
            sent: targetEmails.length,
            batches: results
        });

    } catch (err) {
        console.error('[POST /api/admin/email]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
