import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Use a global cache to prevent multiple connections during hot reload in dev
declare global {
    // eslint-disable-next-line no-var
    var _mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<mongoose.Connection> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, { bufferCommands: false })
            .then((m) => m.connection);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
