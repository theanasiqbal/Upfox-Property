// User Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  registrationDate: string;
  bio?: string;
}

// Property Types
export type PropertyType = 'apartment' | 'house' | 'villa' | 'plot' | 'commercial';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface Amenity {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  location: string;
  city: string;
  state: string;
  zipcode: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  amenities: Amenity[];
  images: string[];
  listingDate: string;
  viewCount: number;
  sellerId: string;
  status: PropertyStatus;
  rejectionReason?: string;
}

// Inquiry Types
export interface Inquiry {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerEmail: string;
  sellerPhone: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

// Auth Context Types
export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
