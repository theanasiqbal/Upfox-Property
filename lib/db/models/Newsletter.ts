import mongoose, { Schema, models } from 'mongoose';

export interface INewsletter {
    _id: string;
    email: string;
    isActive: boolean;
    subscribedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        isActive: { type: Boolean, default: true },
        subscribedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Newsletter =
    models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
