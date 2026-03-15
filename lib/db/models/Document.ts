import mongoose, { Schema, models } from 'mongoose';

export interface IDocument {
    _id: string;
    title: string;
    type: 'pdf' | 'link';
    url: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
    {
        title: { type: String, required: true, trim: true },
        type: { type: String, enum: ['pdf', 'link'], required: true },
        url: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Document = models.Document ?? mongoose.model<IDocument>('Document', DocumentSchema);
