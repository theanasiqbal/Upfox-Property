import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    role: 'user' | 'admin' | 'subadmin';
    avatar?: string;
    bio?: string;
    isActive: boolean;
    registrationDate: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin', 'subadmin'], default: 'user' },
        avatar: { type: String },
        bio: { type: String },
        isActive: { type: Boolean, default: true },
        registrationDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = models.User ?? mongoose.model<IUser>('User', UserSchema);
