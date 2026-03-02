import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Inquiry } from '@/lib/db/models/Inquiry';
import { getUserFromCookies } from '@/lib/jwt';

async function isAdmin() {
    const payload = await getUserFromCookies();
    return payload?.role === 'admin';
}

export async function GET(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(10000, parseInt(searchParams.get('limit') || '15'));
        const skip = (page - 1) * limit;

        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        const filter: Record<string, unknown> = {};
        if (status && status !== 'all') filter.status = status;
        if (dateFrom || dateTo) {
            filter.createdAt = {
                ...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
                ...(dateTo ? { $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 999)) } : {}),
            };
        }
        if (search) {
            filter.$or = [
                { buyerName: { $regex: search, $options: 'i' } },
                { buyerEmail: { $regex: search, $options: 'i' } },
                { buyerPhone: { $regex: search, $options: 'i' } },
            ];
        }

        const allowedSortFields: Record<string, string> = {
            createdAt: 'createdAt',
            status: 'status',
            buyerName: 'buyerName',
        };
        const sortField = allowedSortFields[sortBy] || 'createdAt';

        const [inquiries, total] = await Promise.all([
            Inquiry.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
            Inquiry.countDocuments(filter),
        ]);

        return NextResponse.json({
            inquiries,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[GET /api/admin/enquiries]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { id, status } = body;

        if (!id || !['new', 'contacted', 'closed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid ID or status' }, { status: 400 });
        }

        await connectDB();
        const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });

        if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });

        return NextResponse.json({ success: true, inquiry });
    } catch (err) {
        console.error('[PATCH /api/admin/enquiries]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await connectDB();
        await Inquiry.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/enquiries]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
