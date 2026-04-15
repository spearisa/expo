import { create } from 'zustand';
import { User } from '@/types';
import { MOCK_BUYER } from '@/services/mock';

type AuthState = {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  signOut: () => void;
};

/**
 * Mock auth store. Always seeded as a buyer so the app is immediately demoable.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_BUYER,
  isAuthenticated: true,
  setUser: (user) => set({ user, isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));
