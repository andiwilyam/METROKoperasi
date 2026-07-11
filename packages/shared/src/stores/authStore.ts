import { create } from 'zustand';
import { StorageAdapter } from '../api/storage.js';
import { login as apiLogin, setToken, getToken, initApiClient } from '../api/client.js';

let currentStorage: StorageAdapter | null = null;

export function initAuthStore(storage: StorageAdapter) {
  currentStorage = storage;
  initApiClient(storage);
  const token = storage.getItem('token');
  const userStr = storage.getItem('user');
  if (token) {
    setToken(token);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        useAuthStore.setState({ user, token, isLoading: false, error: null });
      } catch {
        useAuthStore.setState({ token, isLoading: false, error: null });
      }
    }
  }
}

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await apiLogin(username, password);
      if (currentStorage) currentStorage.setItem('user', JSON.stringify(user));
      set({ user, token: getToken(), isLoading: false });
      return user;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    setToken(null);
    if (currentStorage) {
      currentStorage.removeItem('user');
    }
    set({ user: null, token: null });
  },

  isAuthenticated: () => {
    return !!get().token && !!get().user;
  },
}));
