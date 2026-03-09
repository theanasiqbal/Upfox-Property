import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Contact } from '@/lib/db/models/Contact';
import { getUserFromCookies } from '@/lib/jwt';

async function getPayload() {
    return getUserFromCookies();
}

export async function GET(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(10000, parseInt(searchParams.get('limit') || '15'));
        const skip = (page - 1) * limit;

        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const inquiryType = searchParams.get('inquiryType');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        const filter: Record<string, unknown> = {};

        // Subadmin sees only their assigned items
        if (payload.role === 'subadmin') {
            filter.assignedTo = payload.userId;
        }

        if (status && status !== 'all') filter.status = status;
        if (inquiryType && inquiryType !== 'all') filter.inquiryType = inquiryType;
        if (dateFrom || dateTo) {
            filter.createdAt = {
                ...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
                ...(dateTo ? { $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 999)) } : {}),
            };
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const allowedSortFields: Record<string, string> = {
            createdAt: 'createdAt',
            status: 'status',
            name: 'name',
        };
        const sortField = allowedSortFields[sortBy] || 'createdAt';

        const [contacts, total] = await Promise.all([
            Contact.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
            Contact.countDocuments(filter),
        ]);

        return NextResponse.json({
            contacts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[GET /api/admin/contacts]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { id, status, assignedTo, assignedName } = body;

        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await connectDB();

        // Assignment — admin only
        if (assignedTo !== undefined) {
            if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            const update: Record<string, unknown> = assignedTo
                ? { assignedTo, assignedName, status: 'assigned' }
                : { $unset: { assignedTo: '', assignedName: '' }, status: 'new' };
            const contact = await Contact.findByIdAndUpdate(id, update, { new: true });
            if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            return NextResponse.json({ success: true, contact });
        }

        const validStatuses = ['new', 'contacted', 'assigned', 'closed'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const contact = await Contact.findByIdAndUpdate(id, { status, isRead: true }, { new: true });
        if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, contact });
    } catch (err) {
        console.error('[PATCH /api/admin/contacts]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, phone, inquiryType, propertyInterest, message, assignedTo, assignedName } = body;

        if (!name || !email || !phone || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const newContact = await Contact.create({
            name,
            email,
            phone,
            inquiryType: inquiryType || undefined,
            propertyInterest: propertyInterest || undefined,
            message,
            status: assignedTo ? 'assigned' : 'new',
            assignedTo: assignedTo || undefined,
            assignedName: assignedName || undefined,
        });

        return NextResponse.json({ success: true, contact: newContact }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/admin/contacts]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await connectDB();
        await Contact.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/contacts]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
