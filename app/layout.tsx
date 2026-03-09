import type { Metadata } from 'next'
import { Inter, Poppins, Open_Sans } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { EnquiryPopup } from '@/components/enquiry-popup'
import { RateUsButton } from '@/components/rate-us-button'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Upfoxx Floors – Commercial & Residential Real Estate | Managed Workspaces | Property Management',
    template: '%s | Upfoxx Floors',
  },
  description: 'Find premium office spaces, co-working hubs, meeting rooms, rental homes & commercial properties in prime locations. Verified listings, transparent pricing, admin-approved properties.',
  keywords: [
    'office space', 'co-working', 'meeting rooms',
    'property management', 'commercial real estate',
    'residential properties', 'Upfoxx Floors',
    'workspace', 'partner real estate',
  ],
  icons: {
    icon: '/upfoxx%20logo.png',
    shortcut: '/upfoxx%20logo.png',
    apple: '/upfoxx%20logo.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/upfoxx%20logo.png',
    },
  },
  openGraph: {
    title: 'Upfoxx Floors – Commercial Real Estate | Managed Workspaces | Property Management',
    description: 'Premium office spaces, co-working, meeting rooms, property management & partnership opportunities.',
    url: 'https://upfoxxfloors.co.in',
    siteName: 'Upfoxx Floors',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upfoxx Floors – Real Estate & Workspace Solutions',
    description: 'Premium office spaces, co-working, meeting rooms & property management.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://upfoxxfloors.co.in'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${openSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <EnquiryPopup />
            <RateUsButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
