// Color Constants
export const COLORS = {
  primary: '#3B82F6', // Blue
  secondary: '#F59E0B', // Orange
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  error: '#EF4444', // Red
  pending: '#FBBF24', // Yellow
  approved: '#10B981', // Green
  rejected: '#EF4444', // Red
  archived: '#6B7280', // Gray
};

// Cities
export const CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Seattle',
  'Miami',
  'Denver',
  'Boston',
];

// Property Types
export const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'plot', label: 'Plot' },
  { id: 'commercial', label: 'Commercial' },
];

// Listing Types
export const LISTING_TYPES = [
  { id: 'sale', label: 'For Sale' },
  { id: 'rent', label: 'For Rent' },
];

// Amenities
export const AMENITIES = [
  { id: 'ac', name: 'AC' },
  { id: 'parking', name: 'Parking' },
  { id: 'balcony', name: 'Balcony' },
  { id: 'pool', name: 'Swimming Pool' },
  { id: 'gym', name: 'Gym' },
  { id: 'security', name: '24/7 Security' },
  { id: 'garden', name: 'Garden' },
  { id: 'elevator', name: 'Elevator' },
  { id: 'laundry', name: 'Laundry' },
  { id: 'wifi', name: 'WiFi' },
  { id: 'kitchen', name: 'Modular Kitchen' },
  { id: 'fireplace', name: 'Fireplace' },
];

// Status Badge Colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  archived: 'bg-gray-100 text-gray-800 border-gray-300',
};

// Price ranges for filters
export const PRICE_RANGES = [
  { min: 0, max: 100000, label: 'Under $100k' },
  { min: 100000, max: 300000, label: '$100k - $300k' },
  { min: 300000, max: 500000, label: '$300k - $500k' },
  { min: 500000, max: 1000000, label: '$500k - $1M' },
  { min: 1000000, max: Infinity, label: '$1M+' },
];

// Pagination
export const ITEMS_PER_PAGE = 12;

// Date format
export const DATE_FORMAT = 'MMM DD, YYYY';
