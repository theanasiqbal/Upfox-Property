import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/User';
import { signToken, setAuthCookie } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is deactivated. Contact support.' }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        const res = NextResponse.json({
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
        const cookie = setAuthCookie(token);
        res.cookies.set(cookie.name as string, cookie.value as string, cookie as any);
        return res;
    } catch (err) {
        console.error('[auth/login]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
