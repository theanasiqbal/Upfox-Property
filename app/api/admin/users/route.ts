import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/User';
import { getUserFromCookies } from '@/lib/jwt';

async function isAdmin() {
    const payload = await getUserFromCookies();
    return payload?.role === 'admin';
}

async function isAdminOrSubadmin() {
    const payload = await getUserFromCookies();
    return payload?.role === 'admin' || payload?.role === 'subadmin';
}

export async function GET(req: NextRequest) {
    try {
        if (!(await isAdminOrSubadmin())) return NextResponse.json({ error: 'Forbidden — admin/subadmin only' }, { status: 403 });

        await connectDB();
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(10000, parseInt(searchParams.get('limit') || '15'));
        const skip = (page - 1) * limit;

        const search = searchParams.get('search');
        const role = searchParams.get('role');
        const sortBy = searchParams.get('sortBy') || 'registrationDate';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        const filter: Record<string, unknown> = {};
        if (role && role !== 'all') filter.role = role;
        if (dateFrom || dateTo) {
            filter.registrationDate = {
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
            registrationDate: 'registrationDate',
            name: 'name',
            email: 'email',
        };
        const sortField = allowedSortFields[sortBy] || 'registrationDate';

        const [users, total] = await Promise.all([
            User.find(filter).select('-passwordHash').sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
            User.countDocuments(filter),
        ]);

        return NextResponse.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (err) {
        console.error('[GET /api/admin/users]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { id, role } = body;

        if (!id || !['admin', 'subadmin', 'user'].includes(role)) {
            return NextResponse.json({ error: 'Invalid ID or role' }, { status: 400 });
        }

        await connectDB();
        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, user });
    } catch (err) {
        console.error('[PATCH /api/admin/users]', err);
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
        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/users]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { name, email, password, phone, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const userRole = ['admin', 'subadmin', 'user'].includes(role) ? role : 'admin';

        await connectDB();
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            phone,
            passwordHash,
            role: userRole,
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    registrationDate: user.registrationDate,
                }
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('[POST /api/admin/users]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
