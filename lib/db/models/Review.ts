import mongoose, { Schema, models } from 'mongoose';

export interface IReview {
    _id: string;
    name: string;
    rating: number;
    message: string;
    role: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        name: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        message: { type: String, required: true },
        role: { type: String, default: 'Customer' },
        isApproved: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Force schema re-compilation for HMR
if (models.Review) {
    delete models.Review;
}

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
