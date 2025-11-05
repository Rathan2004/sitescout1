import { create } from 'zustand';
import { Listing, CreateListingData, Filters } from '@/types';
import { mockListings, mockApiCall } from '@/utils/mockData';

interface ListingState {
  listings: Listing[];
  currentListing: Listing | null;
  loading: boolean;
  fetchListings: (filters?: Partial<Filters>) => Promise<void>;
  fetchListingById: (id: string) => Promise<void>;
  createListing: (data: CreateListingData) => Promise<void>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  incrementViews: (id: string) => void;
}

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  currentListing: null,
  loading: false,
  
  fetchListings: async (filters) => {
    set({ loading: true });
    let filtered = [...mockListings];
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(searchLower) ||
        l.domain.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.category && filters.category.length > 0) {
      filtered = filtered.filter((l) => filters.category!.includes(l.category));
    }
    
    if (filters?.listingType && filters.listingType !== 'all') {
      filtered = filtered.filter((l) => l.listingType === filters.listingType);
    }
    
    const result = await mockApiCall(filtered, 800);
    set({ listings: result, loading: false });
  },
  
  fetchListingById: async (id) => {
    set({ loading: true });
    const listing = mockListings.find((l) => l.id === id);
    const result = await mockApiCall(listing || null, 500);
    set({ currentListing: result, loading: false });
  },
  
  createListing: async (data) => {
    await mockApiCall(null, 500);
    const newListing: Listing = {
      ...data,
      id: String(Date.now()),
      userId: '1',
      status: 'active',
      featured: false,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ listings: [newListing, ...state.listings] }));
  },
  
  updateListing: async (id, data) => {
    await mockApiCall(null, 500);
    set((state) => ({
      listings: state.listings.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
  },
  
  deleteListing: async (id) => {
    await mockApiCall(null, 500);
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== id),
    }));
  },
  
  incrementViews: (id) => {
    set((state) => ({
      listings: state.listings.map((l) =>
        l.id === id ? { ...l, views: l.views + 1 } : l
      ),
      currentListing:
        state.currentListing?.id === id
          ? { ...state.currentListing, views: state.currentListing.views + 1 }
          : state.currentListing,
    }));
  },
}));
