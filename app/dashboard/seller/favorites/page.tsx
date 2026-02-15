'use client';

import { useState } from 'react';
import { PropertyCard } from '@/components/property-card';
import { MOCK_PROPERTIES } from '@/lib/data';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // For demo, show all approved properties
  const favoriteProperties = MOCK_PROPERTIES.filter(
    (p) => p.status === 'approved' && favorites.includes(p.id)
  );

  // Also add some sample favorites for demo
  const demoFavorites = MOCK_PROPERTIES.filter(
    (p) => p.status === 'approved'
  ).slice(0, 3);

  const handleRemoveFavorite = (propertyId: string) => {
    setFavorites(favorites.filter((id) => id !== propertyId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{demoFavorites.length} properties saved</p>
      </div>

      {demoFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoFavorites.map((property) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={property} showSaveButton={true} />
              <button
                onClick={() => handleRemoveFavorite(property.id)}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 px-6 py-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No saved properties yet</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">Start exploring properties and save your favorites</p>
        </div>
      )}
    </div>
  );
}
