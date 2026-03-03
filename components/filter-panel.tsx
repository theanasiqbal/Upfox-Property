'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { CONDITIONS, PROPERTY_TYPES } from '@/lib/constants';
import { CityAutocomplete } from '@/components/city-autocomplete';

export interface FilterState {
  cities: string[];
  propertyTypes: string[];
  listingTypes: string[];
  priceRange: { min: number; max: number } | null;
  conditions: string[];
  amenities: string[];
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function FilterPanel({ onFilterChange, className = '' }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    propertyTypes: [],
    listingTypes: [],
    priceRange: null,
    conditions: [],
    amenities: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Get unique values from data
  const cities: string[] = [];
  const listingTypes: string[] = ['buy', 'rent'];

  const updateAndNotify = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayValue = <T,>(arr: T[], value: T) => {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  };

  const handleClearAll = () => {
    const cleared: FilterState = {
      cities: [],
      propertyTypes: [],
      listingTypes: [],
      priceRange: null,
      conditions: [],
      amenities: [],
    };
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    updateAndNotify(cleared);
  };

  const handleApplyPrice = () => {
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    updateAndNotify({ ...filters, priceRange: min || max !== Infinity ? { min, max } : null });
  };

  const checkboxClass = (checked: boolean) =>
    `w-4 h-4 rounded border-gray-300 dark:border-white/20 text-accent-purple focus:ring-accent-purple dark:bg-white/5`;

  return (
    <div className={`bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-6 sticky top-20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-accent-purple hover:text-accent-purple-dark dark:hover:text-accent-purple-light transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Location</label>
        <div className="relative">
          <CityAutocomplete
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              updateAndNotify({ ...filters, cities: val ? [val] : [] });
            }}
            placeholder="Search location..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-gray-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Listing Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Listing Type</h3>
        <div className="space-y-2.5">
          {listingTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.listingTypes.includes(type)}
                onChange={() =>
                  updateAndNotify({ ...filters, listingTypes: toggleArrayValue(filters.listingTypes, type) })
                }
                className={checkboxClass(filters.listingTypes.includes(type))}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white capitalize transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-white/10 mb-6" />

      {/* Property Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Property Type</h3>
        <div className="space-y-2.5">
          {PROPERTY_TYPES.map((type) => (
            <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type.id)}
                onChange={() =>
                  updateAndNotify({ ...filters, propertyTypes: toggleArrayValue(filters.propertyTypes, type.id) })
                }
                className={checkboxClass(filters.propertyTypes.includes(type.id))}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-white/10 mb-6" />

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Price Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple text-sm transition-all"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-purple text-sm transition-all"
          />
        </div>
        <button
          onClick={handleApplyPrice}
          className="w-full mt-3 px-4 py-2.5 btn-gradient text-sm font-semibold rounded-xl"
        >
          Apply Price
        </button>
      </div>

      {/* Conditions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Condition</h3>
        <div className="space-y-2.5">
          {CONDITIONS.map((cond) => (
            <label key={cond.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.conditions.includes(cond.value)}
                onChange={() =>
                  updateAndNotify({ ...filters, conditions: toggleArrayValue(filters.conditions, cond.value) })
                }
                className={checkboxClass(filters.conditions.includes(cond.value))}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white capitalize transition-colors">{cond.value}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
