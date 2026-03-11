import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/db/mongoose';
import { GalleryItem } from '@/lib/db/models/GalleryItem';
import { getUserFromCookies } from '@/lib/jwt';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the Cloudinary public_id from a secure_url.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v123/upfoxx-properties/abc.jpg"
 *      → "upfoxx-properties/abc"
 */
function extractPublicId(url: string): string | null {
    try {
        // Match everything after /upload/v<version>/ or /upload/ and strip the extension
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

// GET /api/gallery — public, returns all gallery items sorted newest first
export async function GET() {
    try {
        await connectDB();
        const items = await GalleryItem.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ items });
    } catch (err) {
        console.error('[GET /api/gallery]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/gallery — admin/subadmin only
export async function POST(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { title, imageUrl } = await req.json();

        if (!title || !imageUrl) {
            return NextResponse.json({ error: 'Title and imageUrl are required' }, { status: 400 });
        }

        const item = await GalleryItem.create({
            title,
            imageUrl,
            uploadedBy: payload.userId,
        });

        return NextResponse.json({ item }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/gallery]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/gallery?id=... — admin/subadmin only
export async function DELETE(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || (payload.role !== 'admin' && payload.role !== 'subadmin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await connectDB();

        // Fetch the item first so we have the imageUrl for Cloudinary deletion
        const item = await GalleryItem.findById(id);
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

        // Delete from Cloudinary (non-blocking — DB deletion still proceeds if this fails)
        const publicId = extractPublicId(item.imageUrl);
        if (publicId) {
            try {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            } catch (cdnErr) {
                console.error('[DELETE /api/gallery] Cloudinary deletion failed:', cdnErr);
            }
        }

        // Delete from DB
        await GalleryItem.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[DELETE /api/gallery]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

