import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { JobApplication } from '@/lib/db/models/JobApplication';
import { getUserFromCookies } from '@/lib/jwt';

async function getPayload() {
    return getUserFromCookies();
}

export async function GET(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '15');
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search');
        const sortBy = url.searchParams.get('sortBy') || 'createdAt';
        const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

        const query: Record<string, unknown> = {};

        // Subadmin sees only assigned items
        if (payload.role === 'subadmin') {
            query.assignedTo = payload.userId;
        }

        if (status && status !== 'all') query.status = status;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const total = await JobApplication.countDocuments(query);
        const applications = await JobApplication.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            applications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit) || 1,
            }
        });
    } catch (err) {
        console.error('[GET /api/admin/join-us]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { id, status, assignedTo, assignedName } = body;

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        // Assignment — admin only
        if (assignedTo !== undefined) {
            if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            const update: Record<string, unknown> = assignedTo
                ? { assignedTo, assignedName, status: 'assigned' }
                : { $unset: { assignedTo: '', assignedName: '' }, status: 'new' };
            const application = await JobApplication.findByIdAndUpdate(id, update, { new: true });
            if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
            return NextResponse.json({ success: true, application });
        }

        const validStatuses = ['new', 'contacted', 'assigned', 'approved', 'rejected'];
        if (!id || !status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const application = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });
        if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

        return NextResponse.json({ success: true, application });
    } catch (err) {
        console.error('[PATCH /api/admin/join-us]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const payload = await getPayload();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const application = await JobApplication.findByIdAndDelete(id);
        if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/join-us]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
