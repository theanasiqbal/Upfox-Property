import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Document } from '@/lib/db/models/Document';

// GET /api/documents (Public endpoint)
export async function GET() {
    try {
        await connectDB();
        
        // Only return documents marked as active
        const documents = await Document.find({ isActive: true }).sort({ createdAt: -1 });

        return NextResponse.json({ documents });
    } catch (err) {
        console.error('[GET /api/documents]', err);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}
