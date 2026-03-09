import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    identifier: string; // e.g., 'office-space'
    title: string;
    shortDescription: string;
    description: string;
    features: string[];
    image?: string; // We'll store an image URL here eventually
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        identifier: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
            default: [],
        },
        image: {
            type: String,
            default: null,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
