
import { User, BookListing } from '../types';

// Mock storage keys
const USERS_KEY = 'bookswap_users';
const LISTINGS_KEY = 'bookswap_listings';
const AUTH_KEY = 'bookswap_current_user';

// Helper to get from local storage
const getStore = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStore = <T,>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockAuth = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  login: (email: string): User => {
    const users = getStore<User>(USERS_KEY);
    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        uid: Math.random().toString(36).substr(2, 9),
        email,
        displayName: email.split('@')[0],
      };
      setStore(USERS_KEY, [...users, user]);
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('authChange'));
    return user;
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event('authChange'));
  }
};

export const mockFirestore = {
  // bookListings collection
  getListings: async (): Promise<BookListing[]> => {
    // Return newest first
    return getStore<BookListing>(LISTINGS_KEY).sort((a, b) => b.createdAt - a.createdAt);
  },
  getListing: async (id: string): Promise<BookListing | undefined> => {
    return getStore<BookListing>(LISTINGS_KEY).find(l => l.id === id);
  },
  getUserListings: async (userId: string): Promise<BookListing[]> => {
    return getStore<BookListing>(LISTINGS_KEY).filter(l => l.sellerId === userId);
  },
  createListing: async (listing: Omit<BookListing, 'id' | 'createdAt'>): Promise<BookListing> => {
    const newList: BookListing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const listings = getStore<BookListing>(LISTINGS_KEY);
    setStore(LISTINGS_KEY, [...listings, newList]);
    return newList;
  },
  updateListing: async (id: string, updates: Partial<BookListing>): Promise<void> => {
    const listings = getStore<BookListing>(LISTINGS_KEY);
    const updated = listings.map(l => l.id === id ? { ...l, ...updates } : l);
    setStore(LISTINGS_KEY, updated);
  },
  deleteListing: async (id: string): Promise<void> => {
    const listings = getStore<BookListing>(LISTINGS_KEY);
    setStore(LISTINGS_KEY, listings.filter(l => l.id !== id));
  },
  // users collection
  getUserProfile: async (uid: string): Promise<User | undefined> => {
    return getStore<User>(USERS_KEY).find(u => u.uid === uid);
  }
};
