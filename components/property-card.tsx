'use client';

import Link from 'next/link';
import { Property } from '@/lib/types';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  showSaveButton?: boolean;
}

export function PropertyCard({ property, showSaveButton = true }: PropertyCardProps) {
  const priceDisplay =
    property.listingType === 'rent'
      ? `₹${property.price.toLocaleString('en-IN')}/mo`
      : `₹${property.price.toLocaleString('en-IN')}`;

  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl dark:hover:shadow-accent-purple/10 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-3 py-1 text-xs font-semibold text-white bg-accent-purple/90 backdrop-blur-sm rounded-full capitalize">
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full capitalize">
              {property.propertyType}
            </span>
          </div>

          {/* Price on image */}
          <div className="absolute bottom-3 right-3">
            <span className="px-4 py-1.5 bg-white/95 dark:bg-navy-800/90 dark:backdrop-blur-sm text-accent-purple dark:text-accent-cyan font-bold text-lg rounded-full shadow-lg">
              {priceDisplay}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent-purple dark:group-hover:text-accent-purple-light transition-colors line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4 text-accent-purple flex-shrink-0" />
            <span className="text-sm truncate">{property.location}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
