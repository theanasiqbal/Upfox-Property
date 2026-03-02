import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';

export type AuthedRequest = NextRequest & { user: JWTPayload };

type Handler = (req: AuthedRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>;

export function withAuth(handler: Handler, { adminOnly = false } = {}) {
    return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized — no token' }, { status: 401 });
        }

        let user: JWTPayload;
        try {
            user = await verifyToken(token);
        } catch {
            return NextResponse.json({ error: 'Unauthorized — invalid token' }, { status: 401 });
        }

        if (adminOnly && user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
        }

        (req as AuthedRequest).user = user;
        return handler(req as AuthedRequest, ctx);
    };
}
