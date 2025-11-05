import { create } from 'zustand';
import { User, RegisterData } from '@/types';
import { mockUsers, mockApiCall } from '@/utils/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    await mockApiCall(null, 500);
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  
  register: async (data: RegisterData) => {
    await mockApiCall(null, 500);
    const newUser: User = {
      id: String(Date.now()),
      email: data.email,
      name: data.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    set({ user: newUser, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('auth_user');
    set({ user: null, isAuthenticated: false });
  },
  
  updateProfile: (data: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));
