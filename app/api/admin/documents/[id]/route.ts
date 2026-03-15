import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/jwt';
import { connectDB } from '@/lib/db/mongoose';
import { Document } from '@/lib/db/models/Document';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/admin/documents/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || !['admin', 'subadmin'].includes(payload.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const doc = await Document.findById(id);

        if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

        return NextResponse.json({ document: doc });
    } catch (err) {
        console.error('[GET /api/admin/documents/[id]]', err);
        return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}

// DELETE /api/admin/documents/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || !['admin', 'subadmin'].includes(payload.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        await connectDB();
        const deletedDoc = await Document.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        if (deletedDoc.type === 'pdf' && deletedDoc.url.includes('cloudinary.com')) {
            try {
                // Example URL: https://res.cloudinary.com/domain/image/upload/v1234567/upfoxx-properties/documents/filename.pdf
                
                // 1. Identify resource type from URL (image, raw, video)
                const isRaw = deletedDoc.url.includes('/raw/upload/');
                const isImage = deletedDoc.url.includes('/image/upload/');
                const resourceType = isRaw ? 'raw' : (isImage ? 'image' : 'auto');

                // 2. Extract Public ID
                const uploadIndex = deletedDoc.url.indexOf('/upload/');
                if (uploadIndex !== -1) {
                    const pathAfterUpload = deletedDoc.url.substring(uploadIndex + 8);
                    
                    // Remove version tag
                    const parts = pathAfterUpload.split('/');
                    const hasVersion = parts[0].match(/^v\d+$/);
                    const pathWithoutVersion = hasVersion ? parts.slice(1).join('/') : pathAfterUpload;
                    
                    // IF it's an image resource type (which cloudinary uses for PDFs by default if 'auto' is used), 
                    // Cloudinary expects the public ID WITHOUT the .pdf extension to delete it.
                    // IF it's a raw resource type, Cloudinary expects the public ID WITH the extension.
                    
                    let publicId = pathWithoutVersion;
                    if (resourceType === 'image') {
                        publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));
                    }

                    if (publicId) {
                        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                        console.log(`[Cloudinary Delete] ${publicId} (${resourceType}):`, result);
                    }
                }
            } catch (cloudErr) {
                console.error('[Cloudinary Deletion Error]', cloudErr);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/admin/documents/[id]]', err);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}

// PATCH /api/admin/documents/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || !['admin', 'subadmin'].includes(payload.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        await connectDB();
        const updatedDoc = await Document.findByIdAndUpdate(id, body, { new: true });

        if (!updatedDoc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ document: updatedDoc });
    } catch (err) {
        console.error('[PATCH /api/admin/documents/[id]]', err);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}
