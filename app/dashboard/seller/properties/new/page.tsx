'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { MultiStepForm } from '@/components/multi-step-form';
import { ImageUpload } from '@/components/image-upload';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, CITIES } from '@/lib/constants';
import { Amenity } from '@/lib/types';

interface PropertyFormData {
  // Step 1
  title: string;
  description: string;
  propertyType: string;
  listingType: string;

  // Step 2
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  selectedAmenities: string[];

  // Step 3
  address: string;
  city: string;
  state: string;
  zipcode: string;

  // Step 4
  images: any[];
}

const steps = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Location' },
  { id: 'images', label: 'Images' },
  { id: 'review', label: 'Review' },
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PropertyFormData>({
    defaultValues: {
      bedrooms: 1,
      bathrooms: 1,
      area: 1000,
      price: 200000,
      selectedAmenities: [],
      images: [],
    },
  });

  const formData = watch();

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(formData);
    setIsSubmitting(false);
    router.push('/dashboard/seller/properties');
    // Show success message or toast here
  };

  const toggleAmenity = (amenityId: string) => {
    const current = formData.selectedAmenities || [];
    const updated = current.includes(amenityId)
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    setValue('selectedAmenities', updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Property</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">List your property in 5 easy steps</p>
      </div>

      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl p-8 rounded-lg shadow-sm border border-gray-200 dark:border-white/10">
        <MultiStepForm
          steps={steps.map(s => s.label)}
          currentStep={currentStep}
          onNext={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
          onPrevious={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
          onSubmit={handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
        >
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                  placeholder="e.g., Modern Apartment in Downtown"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                  placeholder="Describe your property..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
                <select
                  {...register('propertyType', { required: 'Property type is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.propertyType ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                >
                  <option value="">Select a type...</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.propertyType && <p className="text-red-600 text-sm mt-1">{errors.propertyType.message}</p>}
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Listing Type</label>
                <select
                  {...register('listingType', { required: 'Listing type is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.listingType ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                >
                  <option value="">Select a type...</option>
                  {LISTING_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.listingType && <p className="text-red-600 text-sm mt-1">{errors.listingType.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Property Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    {...register('bedrooms', { required: true, min: 1 })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    {...register('bathrooms', { required: true, min: 1 })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area (sqft)</label>
                  <input
                    type="number"
                    min="100"
                    {...register('area', { required: true, min: 100 })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  min="0"
                  {...register('price', { required: true, min: 0 })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES.map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedAmenities?.includes(amenity.id) || false}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Location</h2>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                  placeholder="123 Main St"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <select
                  {...register('city', { required: 'City is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                >
                  <option value="">Select a city...</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>

              {/* State and Zip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                      }`}
                    placeholder="NY"
                  />
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                </div>

                {/* Zipcode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zipcode</label>
                  <input
                    type="text"
                    {...register('zipcode', { required: 'Zipcode is required' })}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zipcode ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                      }`}
                    placeholder="10001"
                  />
                  {errors.zipcode && <p className="text-red-600 text-sm mt-1">{errors.zipcode.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upload Images</h2>
              <p className="text-gray-600 dark:text-gray-400">Add up to 10 images of your property (JPG, PNG)</p>
              <ImageUpload
                onImagesChange={(images) => setValue('images', images)}
                maxImages={10}
                existingImages={formData.images}
              />
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Review & Submit</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{formData.propertyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms/Bathrooms</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.bedrooms}/{formData.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                  <p className="font-semibold text-gray-900 dark:text-white">₹{formData.price.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Area</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.area.toLocaleString()} sqft</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formData.city}, {formData.state}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Your property will be submitted for approval. An admin will review it and notify you of approval or rejection within 24 hours.
                </p>
              </div>
            </div>
          )}
        </MultiStepForm>
      </div>
    </div>
  );
}
