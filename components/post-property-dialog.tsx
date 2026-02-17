'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiStepForm } from '@/components/multi-step-form';
import { ImageUpload } from '@/components/image-upload';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, CITIES } from '@/lib/constants';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface PropertyFormData {
    title: string;
    description: string;
    propertyType: string;
    listingType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    price: number;
    selectedAmenities: string[];
    address: string;
    city: string;
    state: string;
    zipcode: string;
    images: any[];
}

const steps = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'location', label: 'Location' },
    { id: 'images', label: 'Images' },
    { id: 'review', label: 'Review' },
];

interface PostPropertyDialogProps {
    trigger?: React.ReactNode;
}

export function PostPropertyDialog({ trigger }: PostPropertyDialogProps) {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<PropertyFormData>({
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
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Property submitted from modal:', formData);
        setIsSubmitting(false);
        setSubmitted(true);
    };

    const toggleAmenity = (amenityId: string) => {
        const current = formData.selectedAmenities || [];
        const updated = current.includes(amenityId)
            ? current.filter((id) => id !== amenityId)
            : [...current, amenityId];
        setValue('selectedAmenities', updated);
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset form when dialog closes
            setTimeout(() => {
                setCurrentStep(0);
                setSubmitted(false);
                reset();
            }, 300);
        }
    };

    return (
        <>
            {trigger ? (
                <div onClick={() => setOpen(true)} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="px-6 py-2.5 btn-gradient text-sm font-bold rounded-full flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Post Property
                </button>
            )}

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="px-6 pt-6 pb-0">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
                            Post Your Property
                        </DialogTitle>
                        <DialogDescription>
                            List your property in 5 easy steps. It will be reviewed and approved by our team.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 pb-6">
                        {submitted ? (
                            /* Success State */
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                                    Property Submitted Successfully!
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Your property has been submitted for review. Our admin team will verify and approve it within 24 hours.
                                </p>
                                <button
                                    onClick={() => handleOpenChange(false)}
                                    className="px-8 py-3 btn-gradient font-semibold rounded-xl"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            /* Multi-Step Form */
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
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property Title</label>
                                            <input
                                                type="text"
                                                {...register('title', { required: 'Title is required' })}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                placeholder="e.g., Modern Apartment in Downtown"
                                            />
                                            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                                            <textarea
                                                {...register('description', { required: 'Description is required' })}
                                                rows={3}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                placeholder="Describe your property..."
                                            />
                                            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property Type</label>
                                                <select
                                                    {...register('propertyType', { required: 'Property type is required' })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.propertyType ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                >
                                                    <option value="">Select a type...</option>
                                                    {PROPERTY_TYPES.map((type) => (
                                                        <option key={type.id} value={type.id}>{type.label}</option>
                                                    ))}
                                                </select>
                                                {errors.propertyType && <p className="text-red-600 text-sm mt-1">{errors.propertyType.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Listing Type</label>
                                                <select
                                                    {...register('listingType', { required: 'Listing type is required' })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.listingType ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                >
                                                    <option value="">Select a type...</option>
                                                    {LISTING_TYPES.map((type) => (
                                                        <option key={type.id} value={type.id}>{type.label}</option>
                                                    ))}
                                                </select>
                                                {errors.listingType && <p className="text-red-600 text-sm mt-1">{errors.listingType.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Details */}
                                {currentStep === 1 && (
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h2>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bedrooms</label>
                                                <input type="number" min="1" {...register('bedrooms', { required: true, min: 1 })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bathrooms</label>
                                                <input type="number" min="1" {...register('bathrooms', { required: true, min: 1 })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Area (sqft)</label>
                                                <input type="number" min="100" {...register('area', { required: true, min: 100 })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
                                            <input type="number" min="0" {...register('price', { required: true, min: 0 })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {AMENITIES.map((amenity) => (
                                                    <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.selectedAmenities?.includes(amenity.id) || false}
                                                            onChange={() => toggleAmenity(amenity.id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-accent-purple focus:ring-accent-purple"
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
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h2>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                                            <input
                                                type="text"
                                                {...register('address', { required: 'Address is required' })}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                placeholder="Full address"
                                            />
                                            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                                            <select
                                                {...register('city', { required: 'City is required' })}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                            >
                                                <option value="">Select a city...</option>
                                                {CITIES.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State</label>
                                                <input
                                                    type="text"
                                                    {...register('state', { required: 'State is required' })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                    placeholder="Uttar Pradesh"
                                                />
                                                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Zipcode</label>
                                                <input
                                                    type="text"
                                                    {...register('zipcode', { required: 'Zipcode is required' })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.zipcode ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                    placeholder="243001"
                                                />
                                                {errors.zipcode && <p className="text-red-600 text-sm mt-1">{errors.zipcode.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Images */}
                                {currentStep === 3 && (
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Images</h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Add up to 10 images of your property (JPG, PNG)</p>
                                        <ImageUpload
                                            onImagesChange={(images) => setValue('images', images)}
                                            maxImages={10}
                                            existingImages={formData.images}
                                        />
                                    </div>
                                )}

                                {/* Step 5: Review */}
                                {currentStep === 4 && (
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Review & Submit</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Title</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{formData.title || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Property Type</p>
                                                <p className="font-semibold text-gray-900 dark:text-white capitalize text-sm">{formData.propertyType || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Bedrooms / Bathrooms</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{formData.bedrooms} / {formData.bathrooms}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">₹{formData.price?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Area</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{formData.area?.toLocaleString()} sqft</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{formData.city || '—'}, {formData.state || '—'}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20 rounded-lg">
                                            <p className="text-sm text-blue-900 dark:text-blue-200">
                                                Your property will be submitted for approval. An admin will review it within 24 hours.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </MultiStepForm>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
