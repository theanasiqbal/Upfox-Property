import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Services',
    description: 'Explore Upfoxx Floors services: Office Space, Co-Working, Meeting Rooms, Residential Rentals, Commercial Properties, Virtual Office, and Property Management.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
