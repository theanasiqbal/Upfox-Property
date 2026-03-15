'use client';

import { useState, useMemo } from 'react';
import { Square } from 'lucide-react';

const UNITS = {
  meters: { name: 'Meters', factor: 1 }, // Base unit: meters
  cm: { name: 'Centimeters', factor: 0.01 },
  feet: { name: 'Feet', factor: 0.3048 },
  inch: { name: 'Inches', factor: 0.0254 },
  yard: { name: 'Yards', factor: 0.9144 },
  km: { name: 'Kilometers', factor: 1000 },
};

export function AreaCalculator() {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [lengthUnit, setLengthUnit] = useState<keyof typeof UNITS>('feet');
  const [widthUnit, setWidthUnit] = useState<keyof typeof UNITS>('feet');

  const results = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);

    if (isNaN(l) || isNaN(w)) return null;

    // Convert lengths to meters first
    const lMeters = l * UNITS[lengthUnit].factor;
    const wMeters = w * UNITS[widthUnit].factor;

    // Area in square meters
    const sqMeters = lMeters * wMeters;

    // Return area in various units
    return {
      sqMeters,
      sqFeet: sqMeters / (0.3048 * 0.3048),
      sqYards: sqMeters / (0.9144 * 0.9144),
      acres: sqMeters / 4046.86,
      hectares: sqMeters / 10000,
      gaj: sqMeters * 1.19599, // 1 sq meter = ~1.19599 sq yards (gaj)
    };
  }, [length, width, lengthUnit, widthUnit]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-navy-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-white/10 transition-all">
      
      {/* Inputs Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Length</label>
          <div className="flex gap-2 relative">
            <input 
              type="number" 
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="e.g. 50"
              className="flex-1 w-full px-4 py-3.5 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white transition-all shadow-sm"
            />
            <select
              value={lengthUnit}
              onChange={(e) => setLengthUnit(e.target.value as keyof typeof UNITS)}
              className="w-32 sm:w-40 px-3 py-3.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white font-semibold cursor-pointer transition-all shadow-sm"
            >
              {Object.entries(UNITS).map(([key, unit]) => (
                <option key={key} value={key} className="dark:bg-navy-800 font-medium">{unit.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Breadth / Width</label>
           <div className="flex gap-2 relative">
            <input 
              type="number" 
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g. 30"
              className="flex-1 w-full px-4 py-3.5 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white transition-all shadow-sm"
            />
            <select
              value={widthUnit}
              onChange={(e) => setWidthUnit(e.target.value as keyof typeof UNITS)}
              className="w-32 sm:w-40 px-3 py-3.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:text-white font-semibold cursor-pointer transition-all shadow-sm"
            >
              {Object.entries(UNITS).map(([key, unit]) => (
                <option key={key} value={key} className="dark:bg-navy-800 font-medium">{unit.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 relative">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <div className="p-2 bg-accent-purple/10 rounded-lg">
            <Square className="w-5 h-5 text-accent-purple" />
          </div>
          Area Calculations
        </h3>

        {results ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
             <ResultCard label="Sq. Feet" value={results.sqFeet} />
             <ResultCard label="Sq. Meters" value={results.sqMeters} />
             <ResultCard label="Sq. Yards" value={results.sqYards} />
             <ResultCard label="Gaj" value={results.gaj} />
             <ResultCard label="Acres" value={results.acres} />
             <ResultCard label="Hectares" value={results.hectares} />
          </div>
        ) : (
          <div className="bg-gray-50/80 dark:bg-navy-900/50 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2">
            <Square className="w-8 h-8 text-gray-300 dark:text-gray-600 opacity-50" />
            <p>Enter length and width above to see area calculations.</p>
          </div>
        )}
      </div>

    </div>
  );
}

function ResultCard({ label, value }: { label: string, value: number }) {
  // Format numbers to look cleaner
  const formattedValue = value >= 1000 
    ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value.toLocaleString('en-US', { maximumFractionDigits: 4 });

  return (
    <div className="bg-white dark:bg-navy-900 border border-purple-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm group cursor-default">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5 uppercase tracking-wider">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-accent-purple dark:group-hover:text-accent-purple-light transition-colors" title={String(value)}>{formattedValue}</p>
    </div>
  );
}
