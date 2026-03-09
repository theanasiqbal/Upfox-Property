import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Service from '@/lib/db/models/Service';
import { SERVICES as defaultServices } from '@/lib/constants';

// GET all services (same as public route but admin might want to see all including hidden in future)
export async function GET(req: Request) {
    try {
        await connectDB();
        const services = await Service.find().sort({ order: 1, createdAt: 1 });
        return NextResponse.json({ services }, { status: 200 });
    } catch (error) {
        console.error('Error fetching admin services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// POST: Create a new service or Seed default services
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Normal create
        const { title, shortDescription, description, features, image, order } = body;

        // Generate an identifier from the title if not provided
        const identifier = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const newService = new Service({
            identifier,
            title,
            shortDescription,
            description,
            features,
            image,
            order: order || 0,
        });

        await newService.save();
        return NextResponse.json({ service: newService }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating service:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'A service with a similar title already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

// PATCH: Update a service
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, title, shortDescription, description, features, image, order } = body;

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { title, shortDescription, description, features, image, order },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ service: updatedService }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

// DELETE: Remove a service
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
