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
  ShieldCheck,
  Building2,
  PlayCircle
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
  const fallbackImages = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'];

  // Create a combined media array. If video exists, it becomes the first item (cover).
  const mediaItems = property.video
    ? [{ type: 'video', url: property.video }, ...fallbackImages.map((url: string) => ({ type: 'image', url }))]
    : fallbackImages.map((url: string) => ({ type: 'image', url }));

  const currentMedia = mediaItems[currentImageIndex] || mediaItems[0];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden h-[500px] bg-black group">
        {currentMedia.type === 'video' ? (
          <video
            src={currentMedia.url}
            className="w-full h-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={`${property.title} - Media ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* <button
            onClick={() => setIsSaved(!isSaved)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} /> */}
          {/* </button> */}
          <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {mediaItems.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                ? 'border-accent-purple shadow-lg scale-110'
                : 'border-white/20 hover:border-white/60 opacity-60 hover:opacity-100'
                }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-black relative flex items-center justify-center">
                  <video src={item.url} className="w-full h-full object-cover opacity-50" />
                  <PlayCircle className="w-5 h-5 text-white absolute" />
                </div>
              ) : (
                <img src={item.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-semibold text-white bg-accent-purple rounded-full capitalize">
                    {property.listingType === 'rent' ? 'For Rent' : property.listingType === 'sale' ? 'For Sale' : 'Buy'}
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
                { icon: Building2, label: 'Condition', value: property.condition || 'N/A' },
                { icon: ShieldCheck, label: 'BDA/RERA Approved', value: property.bdaApproved ? 'Yes' : 'No' },
                { icon: Maximize, label: 'Area', value: property.length && property.breadth ? `${property.area} sqft (${property.length}x${property.breadth} ft)` : `${property.area} sqft` },
              ].map((spec) => (
                <div key={spec.label} className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <spec.icon className="w-6 h-6 text-accent-purple mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize truncate">{spec.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{spec.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, idx) => {
                const name = typeof amenity === 'string' ? amenity : amenity?.name;
                return (
                  <div
                    key={name || idx}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10"
                  >
                    <CheckCircle className="w-4 h-4 text-accent-purple flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar className="w-5 h-5 text-accent-purple flex-shrink-0" />
                <span className="text-sm">Listed: {new Date(property.listingDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Maximize className="w-5 h-5 text-accent-purple flex-shrink-0" />
                <span className="text-sm">Area: {property.area} sqft</span>
              </div>
              {property.length && property.breadth && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Maximize className="w-5 h-5 text-accent-purple flex-shrink-0" />
                  <span className="text-sm">Dimensions: {property.length} x {property.breadth} ft</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Inquiry Form */}
        <div className="space-y-6">
          <div className="sticky top-20">
            <InquiryForm propertyId={property.id} propertyTitle={property.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
