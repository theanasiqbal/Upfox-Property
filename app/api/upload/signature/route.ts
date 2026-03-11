import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getUserFromCookies } from '@/lib/jwt';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
    try {
        const payload = await getUserFromCookies();
        if (!payload && process.env.NODE_ENV !== 'development') {
            // Only require auth in production to allow local testing easily
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const timestamp = Math.round(new Date().getTime() / 1000);

        // Default params for video upload direct from client
        const paramsToSign = {
            timestamp: timestamp,
            folder: 'upfoxx-properties',
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (err) {
        console.error('[GET /api/upload/signature]', err);
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}
