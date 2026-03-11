'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { MultiStepForm } from '@/components/multi-step-form';
import { ImageUpload } from '@/components/image-upload';
import { VideoUpload } from '@/components/video-upload';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, CITIES, CONDITIONS, INDIA_STATES } from '@/lib/constants';
import { Amenity } from '@/lib/types';

interface PropertyFormData {
  // Step 1
  title: string;
  description: string;
  propertyType: string;
  listingType: string;

  // Step 2
  condition: string;
  bdaApproved: boolean;
  area: number;
  length?: number;
  breadth?: number;
  price: number;
  selectedAmenities: string[];

  // Step 3
  address: string;
  city: string;
  state: string;
  zipcode: string;

  // Step 4
  images: any[];
  video: string;
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
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, watch, setValue, trigger: validateFormStep, formState: { errors } } = useForm<PropertyFormData>({
    mode: 'onChange',
    defaultValues: {
      condition: '',
      bdaApproved: false,
      area: 1000,
      price: 200000,
      selectedAmenities: [],
      images: [],
      video: '',
    },
  });

  const STEP_FIELDS = [
    ['title', 'description', 'propertyType', 'listingType'],
    ['condition', 'area', 'price', 'length', 'breadth'],
    ['address', 'city', 'state', 'zipcode'],
    ['images']
  ] as const;

  const handleNext = async () => {
    if (currentStep < STEP_FIELDS.length) {
      const fieldsToValidate = STEP_FIELDS[currentStep];
      const isStepValid = await validateFormStep(fieldsToValidate as any);
      if (isStepValid) {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      }
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const formData = watch();

  const prevListingType = useRef(formData.listingType);
  useEffect(() => {
    if (formData.listingType === 'rent' && prevListingType.current !== 'rent') {
      setValue('price', 1000, { shouldValidate: true });
    }
    prevListingType.current = formData.listingType;
  }, [formData.listingType, setValue]);

  useEffect(() => {
    if (formData.length && formData.breadth) {
      setValue('area', formData.length * formData.breadth, { shouldValidate: true });
    }
  }, [formData.length, formData.breadth, setValue]);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        condition: formData.condition,
        bdaApproved: formData.bdaApproved,
        area: formData.area,
        length: formData.length,
        breadth: formData.breadth,
        price: formData.price,
        amenities: formData.selectedAmenities,
        location: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        images: formData.images as string[], // Cloudinary URLs from ImageUpload
        video: formData.video, // Cloudinary URL from VideoUpload
      };
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit property');

      router.push('/dashboard/user/properties');
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setIsSubmitting(false);
    }
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
          onNext={handleNext}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Title <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  {...register('description', {
                    required: 'Description is required'
                  })}
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                  placeholder="Describe your property..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Listing Type <span className="text-red-500">*</span></label>
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

              {/* BDA Approved */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 dark:border-white/20 rounded-lg bg-gray-50 dark:bg-white/5">
                  <input
                    type="checkbox"
                    {...register('bdaApproved')}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">BDA/RERA Approved Property</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Property Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition <span className="text-red-500">*</span></label>
                  <select
                    {...register('condition', { required: 'Condition is required' })}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.condition ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                      }`}
                  >
                    <option value="">Select condition...</option>
                    {CONDITIONS.map((cond) => (
                      <option key={cond.value} value={cond.value}>{cond.value}</option>
                    ))}
                  </select>
                  {errors.condition && <p className="text-red-600 text-sm mt-1">{errors.condition.message}</p>}
                  {formData.condition && !errors.condition && (
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {CONDITIONS.find(c => c.value === formData.condition)?.description}
                    </p>
                  )}
                </div>

                {/* Dimensions and Area */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Length <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                      <input type="number" min="0" {...register('length', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ft" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Breadth <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                      <input type="number" min="0" {...register('breadth', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ft" />
                    </div>
                  </div>
                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area (sqft) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="0"
                      {...register('area', { required: true, min: 0, valueAsNumber: true })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formData.listingType === 'rent' ? 'Rent per month (₹)' : 'Price (₹)'} <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                    }`}
                  placeholder="e.g. Bareilly"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>

              {/* State and Zip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State <span className="text-red-500">*</span></label>
                  <select
                    {...register('state', { required: 'State is required' })}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-white/20'
                      }`}
                  >
                    <option value="">Select a state...</option>
                    {INDIA_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                </div>

                {/* Zipcode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zipcode <span className="text-red-500">*</span></label>
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upload Images <span className="text-red-500">*</span></h2>
              <p className="text-gray-600 dark:text-gray-400">Add up to 10 images of your property (JPG, PNG)</p>
              <ImageUpload
                onImagesChange={(images) => setValue('images', images, { shouldValidate: true })}
                maxImages={10}
                existingImages={formData.images}
              />
              <input type="hidden" {...register('images', { validate: val => val && val.length > 0 || 'At least one image is required' })} />
              {errors.images && <p className="text-red-600 text-sm mt-1">{errors.images.message}</p>}

              <div className="pt-6 border-t border-gray-100 dark:border-white/10 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cover Video <span className="text-gray-400 text-sm font-normal">(Optional)</span></h3>
                <VideoUpload
                  onVideoChange={(url) => setValue('video', url)}
                  existingVideo={formData.video}
                />
              </div>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Condition</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formData.condition || '—'}
                    {formData.bdaApproved && <span className="ml-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">BDA/RERA Approved</span>}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.listingType === 'rent' ? 'Rent/mo' : 'Price'}
                  </p>
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

              {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                </div>
              )}
            </div>
          )}
        </MultiStepForm>
      </div>
    </div>
  );
}
