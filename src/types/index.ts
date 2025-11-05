export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'seller' | 'admin';
  createdAt: string;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: string;
  price: number;
  currency: string;
  listingType: 'sale' | 'rent';
  category: string;
  monthlyRevenue?: number;
  monthlyTraffic?: number;
  domainAge?: number;
  domainAuthority?: number;
  technologies: string[];
  images: string[];
  featuredImage: string;
  status: 'active' | 'pending' | 'sold' | 'inactive';
  featured: boolean;
  views: number;
  createdAt: string;
  user?: User;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  listing?: Listing;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  listing?: Listing;
}

export interface Filters {
  search: string;
  category: string[];
  minPrice: number;
  maxPrice: number;
  listingType: 'all' | 'sale' | 'rent';
  minRevenue: number;
  maxRevenue: number;
  minTraffic: number;
  maxTraffic: number;
  technologies: string[];
  sortBy: 'newest' | 'price-low' | 'price-high' | 'revenue' | 'traffic';
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateListingData {
  title: string;
  domain: string;
  category: string;
  description: string;
  shortDescription: string;
  monthlyRevenue?: number;
  monthlyTraffic?: number;
  domainAge?: number;
  domainAuthority?: number;
  technologies: string[];
  listingType: 'sale' | 'rent';
  price: number;
  currency: string;
  images: string[];
  featuredImage: string;
}

export interface HandlerRegistration {
  id: string;
  userId: string;
  name: string;
  email: string;
  serviceType: 'transfer' | 'maintenance' | 'optimization';
  hourlyRate: number;
  experience: string;
  skills: string[];
  bio: string;
  portfolio?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}