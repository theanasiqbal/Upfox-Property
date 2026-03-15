import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BasicCalculator } from '@/components/calculator/basic-calculator';
import { AreaCalculator } from '@/components/calculator/area-calculator';

import { Suspense } from 'react';

export const metadata = {
  title: 'Calculators | Upfoxx Floors',
  description: 'Smart calculators for property area measurements and basic arithmetic operations.',
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-900 transition-colors">
      <Suspense fallback={<div className="h-16 bg-white dark:bg-navy-800 animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1">
        {/* Hero Section (Matching Contact Page Design) */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-blue to-navy-800 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                    Smart <span className="text-gold">Calculators</span>
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    Use our built-in tools for basic mathematics and property area calculations. Fully responsive and accurate for all your measurement needs.
                </p>
            </div>
        </section>

        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Basic Calculator - Takes up 5 cols on large screens */}
            <div className="lg:col-span-4 xl:col-span-5 w-full flex flex-col">
              <div className="mb-8 text-center lg:text-left pl-2">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Calculator</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Quick daily arithmetic calculations</p>
              </div>
              <BasicCalculator />
            </div>

            {/* Area Calculator - Takes up 7 cols on large screens */}
            <div className="lg:col-span-8 xl:col-span-7 w-full flex flex-col">
               <div className="mb-8 text-center lg:text-left mt-12 lg:mt-0 pl-2">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Property Area Calculator</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Convert between multiple measurement units</p>
               </div>
              <AreaCalculator />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
