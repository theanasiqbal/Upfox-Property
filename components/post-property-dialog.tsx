'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MultiStepForm } from '@/components/multi-step-form';
import { ImageUpload } from '@/components/image-upload';
import { VideoUpload } from '@/components/video-upload';
import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, CITIES, CONDITIONS, INDIA_STATES } from '@/lib/constants';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { CityAutocomplete } from '@/components/city-autocomplete';

interface PropertyFormData {
    title: string;
    description: string;
    propertyType: string;
    listingType: string;
    condition: string;
    bdaApproved: boolean;
    area: number;
    length?: number;
    breadth?: number;
    price: number;
    selectedAmenities: string[];
    address: string;
    city: string;
    state: string;
    zipcode: string;
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

interface PostPropertyDialogProps {
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function PostPropertyDialog({ trigger, onSuccess }: PostPropertyDialogProps) {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { isAuthenticated, currentUser } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, reset, trigger: validateFormStep, formState: { errors } } = useForm<PropertyFormData>({
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
                video: formData.video,
            };
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit property');
            setSubmitted(true);
            onSuccess?.();
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

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push('/auth/signup');
        } else {
            setOpen(true);
        }
    };

    return (
        <>
            {trigger ? (
                <div onClick={handleTriggerClick} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <button
                    onClick={handleTriggerClick}
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
                                    {currentUser?.role === 'admin'
                                        ? "Your property has been instantly approved and is now live on the platform!"
                                        : "Your property has been submitted for review. Our admin team will verify and approve it within 24 hours."}
                                </p>
                                <button
                                    onClick={() => handleOpenChange(false)}
                                    className="px-8 py-3 btn-gradient font-semibold rounded-xl"
                                >
                                    {currentUser?.role === 'admin' ? "View Properties" : "Close"}
                                </button>
                            </div>
                        ) : (
                            /* Multi-Step Form */
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
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property Title <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                {...register('title', { required: 'Title is required' })}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                placeholder="e.g., Modern Apartment in Downtown"
                                            />
                                            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description <span className="text-red-500">*</span></label>
                                            <textarea
                                                {...register('description', {
                                                    required: 'Description is required'
                                                })}
                                                rows={3}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                placeholder="Describe your property..."
                                            />
                                            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property Type <span className="text-red-500">*</span></label>
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
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Listing Type <span className="text-red-500">*</span></label>
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
                                        <div>
                                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 dark:border-white/20 rounded-lg bg-gray-50 dark:bg-white/5">
                                                <input
                                                    type="checkbox"
                                                    {...register('bdaApproved')}
                                                    className="w-5 h-5 rounded border-gray-300 text-accent-purple focus:ring-accent-purple"
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">BDA/RERA Approved Property</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Details */}
                                {currentStep === 1 && (
                                    <div className="space-y-5">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Condition <span className="text-red-500">*</span></label>
                                                <select
                                                    {...register('condition', { required: 'Condition is required' })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.condition ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
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
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Length <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                                        <input type="number" min="0" {...register('length', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" placeholder="ft" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Breadth <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                                        <input type="number" min="0" {...register('breadth', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" placeholder="ft" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Area (sqft) <span className="text-red-500">*</span></label>
                                                    <input type="number" min="0" {...register('area', { required: true, min: 0, valueAsNumber: true })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                {formData.listingType === 'rent' ? 'Rent per month (₹)' : 'Price (₹)'} <span className="text-red-500">*</span>
                                            </label>
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                {...register('address', { required: 'Address is required' })}
                                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                placeholder="Full address"
                                            />
                                            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <CityAutocomplete
                                                    value={formData.city || ''}
                                                    onChange={(val) => {
                                                        // Fallback for manual typing where they don't select a suggestion
                                                        // By default we update city text so it doesn't stay blocked
                                                        setValue('city', val.split(',')[0], { shouldValidate: true });
                                                    }}
                                                    onSelect={(suggestion) => {
                                                        setValue('city', suggestion.City, { shouldValidate: true });
                                                        setValue('state', suggestion.State, { shouldValidate: true });
                                                    }}
                                                    placeholder="e.g. Bareilly"
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                    icon={null}
                                                />
                                            </div>
                                            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State <span className="text-red-500">*</span></label>
                                                <select
                                                    {...register('state', { required: 'State is required' })}
                                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-navy-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-purple ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-white/20'}`}
                                                >
                                                    <option value="">Select state...</option>
                                                    {INDIA_STATES.map((state) => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Zipcode <span className="text-red-500">*</span></label>
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
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Images <span className="text-red-500">*</span></h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Add up to 10 images of your property (JPG, PNG)</p>
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
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Condition</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {formData.condition || '—'}
                                                    {formData.bdaApproved && <span className="ml-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">BDA/RERA Approved</span>}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formData.listingType === 'rent' ? 'Rent/mo' : 'Price'}
                                                </p>
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
                                        <div className={`p-3 border rounded-lg ${currentUser?.role === 'admin' ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/20' : 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20'}`}>
                                            <p className={`text-sm ${currentUser?.role === 'admin' ? 'text-green-900 dark:text-green-200' : 'text-blue-900 dark:text-blue-200'}`}>
                                                {currentUser?.role === 'admin'
                                                    ? "As an admin, your property will be instantly approved and immediately visible to the public."
                                                    : "Your property will be submitted for approval. An admin will review it within 24 hours."}
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
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
