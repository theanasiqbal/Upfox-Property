import mongoose, { Schema, models } from 'mongoose';

export interface IPartner {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    organization?: string;
    partnershipType: string;
    message: string;
    fileName?: string;
    status: 'pending' | 'contacted' | 'assigned' | 'closed';
    assignedTo?: mongoose.Types.ObjectId;
    assignedName?: string;
    createdAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        organization: { type: String, trim: true },
        partnershipType: { type: String, required: true },
        message: { type: String, required: true },
        fileName: { type: String },
        status: { type: String, enum: ['pending', 'contacted', 'assigned', 'closed'], default: 'pending' },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
        assignedName: { type: String },
    },
    { timestamps: true }
);

PartnerSchema.index({ assignedTo: 1 });

export const Partner = models.Partner ?? mongoose.model<IPartner>('Partner', PartnerSchema);
