'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export interface CitySuggestion {
    City: string;
    State: string;
    District: string;
    formattedText: string;
}

interface CityAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (suggestion: CitySuggestion) => void;
    placeholder?: string;
    className?: string;
    selectMode?: 'city' | 'full';
    icon?: React.ReactNode;
}

export function CityAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "Enter city name...",
    className = "",
    selectMode = "city",
    icon = <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
}: CityAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounce API calls
    useEffect(() => {
        if (!value || value.length < 2) {
            setSuggestions(prev => prev.length === 0 ? prev : []);
            return;
        }

        const timer = setTimeout(async () => {
            // Don't search if the user just selected a suggestion (value matches a formattedText)
            if (suggestions.some(s => s.formattedText === value || s.City === value)) {
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/cities?q=${encodeURIComponent(value)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                    setIsOpen(data.length > 0);
                }
            } catch (error) {
                console.error("Failed to fetch cities", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleSelect = (suggestion: CitySuggestion) => {
        onChange(selectMode === 'city' ? suggestion.City : suggestion.formattedText);
        setIsOpen(false);
        if (onSelect) {
            onSelect(suggestion);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {icon}
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    if (e.target.value.length > 1) {
                        setIsOpen(true);
                    } else {
                        setIsOpen(false);
                    }
                }}
                onFocus={() => {
                    if (suggestions.length > 0 && value.length > 1) {
                        setIsOpen(true);
                    }
                }}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-gray-900 dark:text-white transition-all ${className}`}
                autoComplete="off"
            />

            {/* Loading Spinner Indicator (Optional small dot) */}
            {isLoading && value.length > 1 && (
                <div className="absolute right-3 top-3.5 w-3 h-3 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
            )}

            {/* Autocomplete Dropdown Menu */}
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-[100] w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl translate-y-1">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={`${suggestion.City}-${index}`}
                            onClick={() => handleSelect(suggestion)}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 text-sm transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {suggestion.City}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {suggestion.State}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
