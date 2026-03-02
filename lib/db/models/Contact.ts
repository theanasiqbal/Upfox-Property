import mongoose, { Schema, models } from 'mongoose';

export interface IContact {
    _id: string;
    name: string;
    phone: string;
    email: string;
    propertyInterest?: string;
    inquiryType?: string;
    message: string;
    status: 'new' | 'contacted' | 'closed';
    isRead: boolean;
    createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        propertyInterest: { type: String },
        inquiryType: { type: String },
        message: { type: String, required: true },
        status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Contact = models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
