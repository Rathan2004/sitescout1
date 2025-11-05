import { create } from 'zustand';

interface FavoriteState {
  favorites: string[];
  addFavorite: (listingId: string) => void;
  removeFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  
  addFavorite: (listingId) => {
    set((state) => {
      const newFavorites = [...state.favorites, listingId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  removeFavorite: (listingId) => {
    set((state) => {
      const newFavorites = state.favorites.filter((id) => id !== listingId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  isFavorite: (listingId) => {
    return get().favorites.includes(listingId);
  },
}));
