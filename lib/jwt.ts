import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
    userId: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    [key: string]: any;
}

export async function signToken(payload: Omit<JWTPayload, '[key: string]'>): Promise<string> {
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
}

export async function getTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value ?? null;
}

export async function getUserFromCookies(): Promise<JWTPayload | null> {
    try {
        const token = await getTokenFromCookies();
        if (!token) return null;
        return await verifyToken(token);
    } catch {
        return null;
    }
}

export function setAuthCookie(token: string): Record<string, string | boolean | number> {
    return {
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    };
}

export function clearAuthCookie(): Record<string, string | boolean | number> {
    return {
        name: 'token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    };
}
