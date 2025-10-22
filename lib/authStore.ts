// lib/authStore.ts
import { create }from 'zustand';
import { persist } from 'zustand/middleware';
import { BackendUser } from '@/types'; // We will create this type next

interface AuthState {
  token: string | null;
  user: BackendUser | null;
  login: (token: string, user: BackendUser) => void;
  logout: () => void;
  setUser: (user: BackendUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user) => set((state) => ({ ...state, user })),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
    }
  )
);