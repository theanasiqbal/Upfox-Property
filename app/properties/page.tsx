'use client';

import { useState, useMemo, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PropertyCard } from '@/components/property-card';
import { FilterPanel, FilterState } from '@/components/filter-panel';
import { MOCK_PROPERTIES } from '@/lib/data';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    propertyTypes: [],
    listingTypes: [],
    priceRange: null,
    bedrooms: [],
    bathrooms: [],
    amenities: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // Filter properties
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((prop) => {
      if (prop.status !== 'approved') return false;
      if (filters.cities.length > 0 && !filters.cities.includes(prop.location)) return false;
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType))
        return false;
      if (filters.listingTypes.length > 0 && !filters.listingTypes.includes(prop.listingType))
        return false;
      if (
        filters.priceRange &&
        (prop.price < filters.priceRange.min || prop.price > filters.priceRange.max)
      )
        return false;
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(prop.bedrooms))
        return false;
      if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(prop.bathrooms))
        return false;
      if (filters.amenities.length > 0) {
        const propAmenityIds = prop.amenities.map((a) => a.id);
        if (!filters.amenities.every((a) => propAmenityIds.includes(a as string))) return false;
      }
      return true;
    });
  }, [filters]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
    });
  }, [filteredProperties, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const currentProperties = sortedProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-800">
      <Suspense fallback={<div className="h-16 bg-white dark:bg-navy-800" />}>
        <Header />
      </Suspense>

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Browse Properties
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Showing {filteredProperties.length} properties
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r border-gray-100 dark:border-white/10 w-[300px] sm:w-[350px] overflow-y-auto">
                  <div className="p-4">
                    <FilterPanel
                      onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                        setCurrentPage(1);
                        setIsFilterOpen(false); // Close sheet after applying filters
                      }}
                      className="border-none shadow-none p-0 sticky-none"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/20 transition-all cursor-pointer dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {sortedProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4 py-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                <p className="text-xl text-gray-600 dark:text-gray-300">No properties found matching your criteria.</p>
                <button
                  onClick={() => {
                    setFilters({
                      cities: [],
                      propertyTypes: [],
                      listingTypes: [],
                      priceRange: null,
                      bedrooms: [],
                      bathrooms: [],
                      amenities: [],
                    });
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-accent-purple hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div >
  );
}
