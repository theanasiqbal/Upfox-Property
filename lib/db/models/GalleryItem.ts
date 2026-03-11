import mongoose, { Schema, models } from 'mongoose';

export interface IGalleryItem {
    _id: string;
    title: string;
    imageUrl: string;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
    {
        title: { type: String, required: true, trim: true },
        imageUrl: { type: String, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export const GalleryItem = models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
