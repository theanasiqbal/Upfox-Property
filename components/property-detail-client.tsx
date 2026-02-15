'use client';

import { useState } from 'react';
import { Property, User } from '@/lib/types';
import { InquiryForm } from '@/components/inquiry-form';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: Property;
  seller: User | undefined;
  priceDisplay: string;
  similarProperties: Property[];
}

export function PropertyDetailClient({
  property,
  seller,
  priceDisplay,
}: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'];

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden h-[500px] bg-gray-100 dark:bg-navy-700 group">
        <img
          src={images[currentImageIndex]}
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-semibold text-white bg-accent-purple rounded-full capitalize">
                    {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-accent-purple bg-accent-purple/10 dark:bg-accent-purple/20 rounded-full capitalize">
                    {property.propertyType}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-accent-purple" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-accent-purple dark:text-accent-cyan dark:text-glow-cyan">
                  {priceDisplay}
                </p>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                { icon: Maximize, label: 'Area', value: `${property.area} sqft` },
              ].map((spec) => (
                <div key={spec.label} className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <spec.icon className="w-6 h-6 text-accent-purple mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{spec.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{spec.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10"
                >
                  <CheckCircle className="w-4 h-4 text-accent-purple flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar className="w-5 h-5 text-accent-purple flex-shrink-0" />
                <span className="text-sm">Listed: {new Date(property.listingDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Maximize className="w-5 h-5 text-accent-purple flex-shrink-0" />
                <span className="text-sm">Area: {property.area} sqft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact / Inquiry */}
        <div className="space-y-6">
          {/* Owner / Direct Contact Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-heading">Contact Owner</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-dark-blue to-gold flex items-center justify-center text-white text-lg font-bold">
                {property.ownerName?.charAt(0) || 'O'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{property.ownerName || 'Owner'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Property Owner</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3 mb-5">
              {property.ownerPhone && (
                <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                  <Phone className="w-4 h-4" />
                  +91 {property.ownerPhone}
                </a>
              )}
              {property.ownerEmail && (
                <a href={`mailto:${property.ownerEmail}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                  <Mail className="w-4 h-4" />
                  {property.ownerEmail}
                </a>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href={`tel:${property.ownerPhone || ''}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-dark-blue hover:bg-dark-blue-dark text-white font-semibold rounded-xl text-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`https://wa.me/91${property.ownerPhone || ''}?text=${encodeURIComponent(`Hi, I am interested in: ${property.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Listed By (Seller from system) */}
          {seller && (
            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-heading">Listed By</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-purple-dark flex items-center justify-center text-white text-lg font-bold">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{seller.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property Seller</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <a href={`mailto:${seller.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                  <Mail className="w-4 h-4" />
                  {seller.email}
                </a>
                <a href={`tel:${seller.phone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-purple dark:hover:text-accent-purple-light transition-colors">
                  <Phone className="w-4 h-4" />
                  {seller.phone}
                </a>
              </div>
            </div>
          )}

          {/* Inquiry Form */}
          <div className="sticky top-20">
            <InquiryForm propertyId={property.id} propertyTitle={property.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
