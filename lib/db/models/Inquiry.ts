import mongoose, { Schema, models } from 'mongoose';

export interface IInquiry {
    _id: string;
    propertyId: mongoose.Types.ObjectId;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    message: string;
    status: 'new' | 'contacted' | 'assigned' | 'closed';
    assignedTo?: mongoose.Types.ObjectId;
    assignedName?: string;
    createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
        buyerName: { type: String, required: true, trim: true },
        buyerEmail: { type: String, required: true, lowercase: true, trim: true },
        buyerPhone: { type: String, trim: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['new', 'contacted', 'assigned', 'closed'], default: 'new' },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
        assignedName: { type: String },
    },
    { timestamps: true }
);

InquirySchema.index({ propertyId: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ assignedTo: 1 });

export const Inquiry = models.Inquiry ?? mongoose.model<IInquiry>('Inquiry', InquirySchema);
