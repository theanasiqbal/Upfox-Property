import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Contact Upfoxx Floors for property inquiries, workspace bookings, or to schedule a tour. Call us, WhatsApp, or fill in the inquiry form.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
