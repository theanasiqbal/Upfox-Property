import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/User';
import { getUserFromCookies } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(payload.userId).select('-passwordHash');
        if (!user || !user.isActive) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
                registrationDate: user.registrationDate,
            },
        });
    } catch (err) {
        console.error('[auth/me]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
