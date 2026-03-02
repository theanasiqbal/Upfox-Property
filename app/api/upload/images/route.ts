import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUserFromCookies } from '@/lib/jwt';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// POST /api/upload/images — authenticated
export async function POST(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();
        const files = formData.getAll('images') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }
        if (files.length > 10) {
            return NextResponse.json({ error: 'Max 10 images allowed' }, { status: 400 });
        }

        const uploads = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

                const result = await cloudinary.uploader.upload(base64, {
                    folder: 'upfoxx-properties',
                    resource_type: 'image',
                    quality: 'auto:good',
                    fetch_format: 'auto',
                });

                return {
                    url: result.secure_url,
                    publicId: result.public_id,
                };
            })
        );

        return NextResponse.json({ images: uploads });
    } catch (err) {
        console.error('[POST /api/upload/images]', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
