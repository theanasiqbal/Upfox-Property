import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/jwt';

export async function POST() {
    const res = NextResponse.json({ success: true });
    const cookie = clearAuthCookie();
    res.cookies.set(cookie.name as string, cookie.value as string, cookie as any);
    return res;
}
