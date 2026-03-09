import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload/resume — unauthenticated (public applicants)
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('resume') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
        }

        // Validate file type (PDF, DOC, DOCX)
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only PDF and DOC/DOCX are allowed.' }, { status: 400 });
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extension = file.name.split('.').pop() || 'pdf';
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const publicId = `${safeName}_${Date.now()}.${extension}`;

        const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'upfoxx-resumes',
                    resource_type: 'raw',
                    access_mode: 'public',
                    public_id: publicId,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            originalName: file.name
        });
    } catch (err) {
        console.error('[POST /api/upload/resume]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
