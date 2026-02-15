// Color Constants
export const COLORS = {
  primary: '#1B2B5A', // Dark Blue (Trust)
  secondary: '#D4A843', // Gold (Premium)
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  error: '#EF4444', // Red
  pending: '#FBBF24', // Yellow
  approved: '#10B981', // Green
  rejected: '#EF4444', // Red
  archived: '#6B7280', // Gray
};

// Bareilly Areas / Locations
export const CITIES = [
  'Civil Lines',
  'Rajendra Nagar',
  'Kotwali',
  'Pilibhit Bypass',
  'CB Ganj',
  'Izatnagar',
  'Subhash Nagar',
  'Rampur Garden',
  'Deen Dayal Puram',
  'Satellite Township',
];

// Property Types
export const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'plot', label: 'Plot' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'office', label: 'Office Space' },
  { id: 'co-working', label: 'Co-Working Space' },
  { id: 'meeting-room', label: 'Meeting Room' },
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
  { id: 'wifi', name: 'WiFi' },
  { id: 'kitchen', name: 'Modular Kitchen' },
  { id: 'power-backup', name: 'Power Backup' },
  { id: 'cctv', name: 'CCTV' },
  { id: 'projector', name: 'Projector' },
  { id: 'tea-coffee', name: 'Tea/Coffee' },
  { id: 'reception', name: 'Reception' },
  { id: 'meeting-room', name: 'Meeting Room' },
  { id: 'pantry', name: 'Pantry' },
];

// Status Badge Colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  archived: 'bg-gray-100 text-gray-800 border-gray-300',
};

// Price ranges for filters (Indian Rupees)
export const PRICE_RANGES = [
  { min: 0, max: 10000, label: 'Under ₹10K' },
  { min: 10000, max: 50000, label: '₹10K - ₹50K' },
  { min: 50000, max: 100000, label: '₹50K - ₹1L' },
  { min: 100000, max: 500000, label: '₹1L - ₹5L' },
  { min: 500000, max: 1000000, label: '₹5L - ₹10L' },
  { min: 1000000, max: 5000000, label: '₹10L - ₹50L' },
  { min: 5000000, max: 10000000, label: '₹50L - ₹1Cr' },
  { min: 10000000, max: Infinity, label: '₹1Cr+' },
];

// Services
export const SERVICES = [
  {
    id: 'office-space',
    title: 'Office Space for Rent',
    shortDescription: 'Flexible leases in prime business areas',
    description: 'Find the perfect office space in Bareilly\'s prime business locations. We offer fully managed spaces with flexible lease terms, modern interiors, and all necessary infrastructure for your business.',
    features: ['Flexible leases', 'Prime business areas', 'Fully managed spaces', 'Modern interiors', 'High-speed internet'],
  },
  {
    id: 'co-working',
    title: 'Co-Working Spaces',
    shortDescription: 'Starting from ₹999/month',
    description: 'Affordable co-working spaces designed for startups, freelancers, and small teams. Enjoy a professional work environment with all amenities included.',
    features: ['Starting ₹999/month', 'Free WiFi', 'Tea/Coffee included', 'Electricity included', 'Networking opportunities'],
  },
  {
    id: 'meeting-rooms',
    title: 'Meeting Rooms',
    shortDescription: 'Hourly bookings with full AV setup',
    description: 'Professional meeting rooms available for hourly bookings. Perfect for client meetings, presentations, and team discussions.',
    features: ['Hourly bookings', 'Projector & screen', 'AC rooms', 'Whiteboard', 'Refreshments available'],
  },
  {
    id: 'residential',
    title: 'Residential Rental Properties',
    shortDescription: 'Quality homes for families in Bareilly',
    description: 'Browse through verified residential rental properties across Bareilly. From cozy flats to spacious houses, find the perfect home for your family.',
    features: ['Verified listings', 'All budget ranges', 'Family-friendly areas', 'Furnished & unfurnished', 'Pet-friendly options'],
  },
  {
    id: 'commercial',
    title: 'Commercial Properties',
    shortDescription: 'Shops, showrooms & commercial spaces',
    description: 'Premium commercial properties in high-traffic areas of Bareilly. Ideal for retail shops, showrooms, restaurants, and more.',
    features: ['High footfall areas', 'Flexible sizes', 'Ready to move in', 'Parking available', 'Prime locations'],
  },
  {
    id: 'virtual-office',
    title: 'Virtual Office Services',
    shortDescription: 'Professional business address & more',
    description: 'Get a prestigious business address in Civil Lines, Bareilly without the cost of a physical office. Perfect for GST registration and professional presence.',
    features: ['Business address', 'GST registration address', 'Mail handling', 'Professional presence', 'Phone answering service'],
  },
  {
    id: 'property-management',
    title: 'Property Management Services',
    shortDescription: 'Complete property care & management',
    description: 'End-to-end property management services for property owners. We handle everything from tenant screening to rent collection and maintenance.',
    features: ['Tenant handling', 'Rent collection', 'Maintenance support', 'Documentation', 'Property marketing'],
  },
];

// Contact Info
export const CONTACT = {
  phone: '7534835937',
  email: 'info@upfoxxmedia.com',
  address: 'Upfoxx Floors, Civil Lines, Bareilly, Uttar Pradesh',
  whatsappUrl: 'https://wa.me/917534835937',
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Date format
export const DATE_FORMAT = 'MMM DD, YYYY';
