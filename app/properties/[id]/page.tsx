import { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyCard } from '@/components/property-card';
import { PropertyDetailClient } from '@/components/property-detail-client';
import { MOCK_PROPERTIES, getUserById, getPropertiesBySeller } from '@/lib/data';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy-800">
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Property Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The property you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/properties" className="inline-block px-8 py-3 btn-gradient rounded-full font-medium">
            Back to Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const seller = getUserById(property.sellerId);
  const similarProperties = getPropertiesBySeller(property.sellerId)
    .filter((p) => p.id !== property.id && p.status === 'approved')
    .slice(0, 4);

  const priceDisplay =
    property.listingType === 'rent' ? `₹${property.price.toLocaleString('en-IN')}/mo` : `₹${property.price.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-white dark:bg-navy-800">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Use client component for interactive elements */}
        <PropertyDetailClient
          property={property}
          seller={seller}
          priceDisplay={priceDisplay}
          similarProperties={similarProperties}
        />
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-navy-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
