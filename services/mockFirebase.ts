
import { User, BookListing } from '../types';

// Mock storage keys
const USERS_KEY = 'bookswap_users';
const LISTINGS_KEY = 'bookswap_listings';
const AUTH_KEY = 'bookswap_current_user';

// Initial Seed Data to make the site look populated for everyone
const INITIAL_LISTINGS: BookListing[] = [
  {
    id: 'seed-1',
    title: 'Concepts of Physics Vol 1',
    author: 'H.C. Verma',
    subject: 'Science',
    condition: 'Good',
    price: 350,
    contactPhone: '01712345678',
    description: 'Essential for JEE and HSC preparation. Minimal markings on pages.',
    sellerId: 'system',
    sellerName: 'Academic Store',
    location: { divisionId: '3', districtId: '301', upazilaId: 'u30101' },
    createdAt: Date.now() - 100000
  },
  {
    id: 'seed-2',
    title: 'Pather Panchali',
    author: 'Bibhutibhushan Bandyopadhyay',
    subject: 'Fiction',
    condition: 'Like New',
    price: 180,
    contactPhone: '01887654321',
    description: 'A classic masterpiece. Hardcover edition in perfect condition.',
    sellerId: 'system',
    sellerName: 'Niaz Ahmed',
    location: { divisionId: '3', districtId: '301', upazilaId: 'u30102' },
    createdAt: Date.now() - 200000
  },
  {
    id: 'seed-3',
    title: 'Higher Mathematics 1st Paper',
    author: 'S.U. Ahmed',
    subject: 'Science',
    condition: 'Fair',
    price: 220,
    contactPhone: '01999888777',
    description: 'Well used but all pages intact. Great for practice problems.',
    sellerId: 'system',
    sellerName: 'Rahat Islam',
    location: { divisionId: '2', districtId: '201', upazilaId: 'u20101' },
    createdAt: Date.now() - 300000
  }
];

// Helper to get from local storage
const getStore = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  if (!data && key === LISTINGS_KEY) {
    // If no data exists, initialize with seed data
    setStore(LISTINGS_KEY, INITIAL_LISTINGS);
    return INITIAL_LISTINGS as unknown as T[];
  }
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
  getListings: async (): Promise<BookListing[]> => {
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
    // Dispatch event so Home page knows to update
    window.dispatchEvent(new Event('listingsChange'));
    return newList;
  },
  updateListing: async (id: string, updates: Partial<BookListing>): Promise<void> => {
    const listings = getStore<BookListing>(LISTINGS_KEY);
    const updated = listings.map(l => l.id === id ? { ...l, ...updates } : l);
    setStore(LISTINGS_KEY, updated);
    window.dispatchEvent(new Event('listingsChange'));
  },
  deleteListing: async (id: string): Promise<void> => {
    const listings = getStore<BookListing>(LISTINGS_KEY);
    setStore(LISTINGS_KEY, listings.filter(l => l.id !== id));
    window.dispatchEvent(new Event('listingsChange'));
  },
  getUserProfile: async (uid: string): Promise<User | undefined> => {
    return getStore<User>(USERS_KEY).find(u => u.uid === uid);
  }
};
