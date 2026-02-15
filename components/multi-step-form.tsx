'use client';

import { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface MultiStepFormProps {
  steps: string[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  children: ReactNode;
  isSubmitting?: boolean;
}

export function MultiStepForm({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  children,
  isSubmitting = false,
}: MultiStepFormProps) {
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center px-2 md:px-0">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm transition-all ${index < currentStep
                  ? 'bg-green-500 dark:bg-green-500 text-white'
                  : index === currentStep
                    ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30'
                    : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`mt-2 text-[10px] md:text-xs font-medium hidden sm:block ${index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                }`}>
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-20 h-0.5 mx-1 md:mx-2 transition-colors ${index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-white/10'
                }`} />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5">
        <div
          className="h-full bg-gradient-to-r from-accent-purple to-accent-purple-dark rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 p-6 md:p-8">
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 btn-gradient font-semibold rounded-xl disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Property'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 btn-gradient font-semibold rounded-xl"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}
