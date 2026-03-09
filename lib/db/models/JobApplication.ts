import mongoose, { Schema, models } from 'mongoose';

export interface IJobApplication {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    resumeUrl: string;
    status: 'new' | 'contacted' | 'assigned' | 'approved' | 'rejected';
    assignedTo?: mongoose.Types.ObjectId;
    assignedName?: string;
    createdAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'contacted', 'assigned', 'approved', 'rejected'],
        default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedName: { type: String },
}, {
    timestamps: true,
});

jobApplicationSchema.index({ assignedTo: 1 });

export const JobApplication = models.JobApplication ?? mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
