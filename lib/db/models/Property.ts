import mongoose, { Schema, models } from 'mongoose';

export interface IProperty {
    _id: string;
    title: string;
    description: string;
    propertyType: string;
    listingType: 'buy' | 'sale' | 'rent';
    price: number;
    location: string;
    city: string;
    state: string;
    zipcode: string;
    condition: string;
    area: number;
    bdaApproved: boolean;
    amenities: string[];
    images: string[]; // Cloudinary URLs
    sellerId: mongoose.Types.ObjectId;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    rejectionReason?: string;
    featured: boolean;
    viewCount: number;
    queryCount: number;
    listingDate: Date;
    availability?: 'available' | 'coming-soon';
}

const PropertySchema = new Schema<IProperty>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        propertyType: { type: String, required: true },
        listingType: { type: String, enum: ['buy', 'sale', 'rent'], required: true },
        price: { type: Number, required: true, min: 0 },
        location: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
        condition: { type: String, required: true },
        area: { type: Number, required: true },
        bdaApproved: { type: Boolean, default: false },
        amenities: [{ type: String }],
        images: [{ type: String }],
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        ownerName: { type: String, required: true },
        ownerPhone: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'archived'],
            default: 'pending',
        },
        rejectionReason: { type: String },
        featured: { type: Boolean, default: false },
        viewCount: { type: Number, default: 0 },
        queryCount: { type: Number, default: 0 },
        listingDate: { type: Date, default: Date.now },
        availability: { type: String, enum: ['available', 'coming-soon'], default: 'available' },
    },
    { timestamps: true }
);

PropertySchema.index({ status: 1 });
PropertySchema.index({ city: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ sellerId: 1 });
PropertySchema.index({ featured: 1, status: 1 });

export const Property = models.Property || mongoose.model<IProperty>('Property', PropertySchema);
