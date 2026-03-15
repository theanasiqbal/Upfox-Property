import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/jwt';
import { connectDB } from '@/lib/db/mongoose';
import { Document } from '@/lib/db/models/Document';

// GET /api/admin/documents
export async function GET(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || !['admin', 'subadmin'].includes(payload.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const documents = await Document.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ documents });
    } catch (err) {
        console.error('[GET /api/admin/documents]', err);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}

// POST /api/admin/documents
export async function POST(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || !['admin', 'subadmin'].includes(payload.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, type, url, isActive } = body;

        if (!title || !type || !url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['pdf', 'link'].includes(type)) {
            return NextResponse.json({ error: 'Invalid document type. Must be pdf or link.' }, { status: 400 });
        }

        await connectDB();
        const newDoc = await Document.create({ title, type, url, isActive: isActive ?? true });

        return NextResponse.json({ document: newDoc }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/admin/documents]', err);
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }
}
