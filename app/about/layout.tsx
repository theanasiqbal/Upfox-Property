import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Upfoxx Floors — trusted commercial real estate and workspace solutions company. Verified listings, transparent pricing, prime locations.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
