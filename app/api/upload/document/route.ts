import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUserFromCookies } from '@/lib/jwt';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload || !['admin', 'subadmin'].includes(payload.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64, {
            folder: 'upfoxx-properties/documents',
            resource_type: 'auto', // Auto handles pdfs nicely
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (err) {
        console.error('[POST /api/upload/document]', err);
        return NextResponse.json({ error: 'Document upload failed' }, { status: 500 });
    }
}
