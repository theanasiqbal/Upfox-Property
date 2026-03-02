import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property } from '@/lib/db/models/Property';
import { User } from '@/lib/db/models/User';
import { Inquiry } from '@/lib/db/models/Inquiry';
import { Contact } from '@/lib/db/models/Contact';
import { Partner } from '@/lib/db/models/Partner';
import { Newsletter } from '@/lib/db/models/Newsletter';
import { Review } from '@/lib/db/models/Review';
import { getUserFromCookies } from '@/lib/jwt';

export async function GET() {
    try {
        const payload = await getUserFromCookies();
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
        }

        await connectDB();
        const [
            pendingProperties,
            approvedProperties,
            totalUsers,
            totalInquiries,
            unreadContacts,
            newPartners,
            totalNewsletterSubs,
            pendingReviews,
            approvedReviews,
        ] = await Promise.all([
            Property.countDocuments({ status: 'pending' }),
            Property.countDocuments({ status: 'approved' }),
            User.countDocuments({ role: 'user' }),
            Inquiry.countDocuments(),
            Contact.countDocuments({ isRead: false }),
            Partner.countDocuments({ status: 'pending' }),
            Newsletter.countDocuments({ isActive: true }),
            Review.countDocuments({ isApproved: false }),
            Review.countDocuments({ isApproved: true }),
        ]);

        return NextResponse.json({
            stats: {
                pendingProperties,
                approvedProperties,
                totalUsers,
                totalInquiries,
                unreadContacts,
                newPartnerApplications: newPartners,
                newsletterSubscribers: totalNewsletterSubs,
                pendingReviews,
                approvedReviews,
            },
        });
    } catch (err) {
        console.error('[GET /api/admin/stats]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
