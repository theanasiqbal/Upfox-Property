import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/User';
import { signToken, setAuthCookie } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email, phone, password, role } = await req.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Only allow user during self-registration (admin must be set manually in DB)
        const userRole = role === 'admin' ? role : 'user';

        // Check if email already exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            passwordHash,
            role: userRole,
        });

        // Sign JWT
        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.name);

        const res = NextResponse.json(
            {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    registrationDate: user.registrationDate,
                },
            },
            { status: 201 }
        );
        const cookie = setAuthCookie(token);
        res.cookies.set(cookie.name as string, cookie.value as string, cookie as any);
        return res;
    } catch (err) {
        console.error('[auth/register]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
