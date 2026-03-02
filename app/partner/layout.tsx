import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Partner With Us',
    description: 'Partner with Upfoxx Floors as a real estate agent, broker, or vendor. Submit your partnership query and earn competitive commissions in the growing property market.',
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
    return children;
}
