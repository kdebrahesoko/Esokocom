import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AdvisoryCategory = 'weather' | 'pest' | 'market' | 'nutrition' | 'climate';

export interface Advisory {
  id: string;
  category: AdvisoryCategory;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  currency: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  market: string;
  updatedAt: string;
}

export interface SurveySubmission {
  id: string;
  farmName: string;
  location: string;
  sizeAcres: string;
  mainCrop: string;
  cropHealth: string;
  irrigationMethod: string;
  usesFertilizer: boolean;
  estimatedYieldBags: string;
  notes: string;
  submittedAt: string;
}

export interface SmsAlert {
  id: string;
  message: string;
  type: 'advisory' | 'market' | 'weather' | 'survey' | 'pest';
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  region: string;
  farmerType: string;
  joinedDate: string;
  alertsEnabled: boolean;
  weeklyDigest: boolean;
}

interface AppContextValue {
  advisories: Advisory[];
  marketPrices: MarketPrice[];
  surveys: SurveySubmission[];
  smsAlerts: SmsAlert[];
  userProfile: UserProfile;
  unreadAlerts: number;
  markAdvisoryRead: (id: string) => void;
  markAlertRead: (id: string) => void;
  submitSurvey: (data: Omit<SurveySubmission, 'id' | 'submittedAt'>) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_ADVISORIES: Advisory[] = [
  {
    id: 'a1',
    category: 'weather',
    title: 'Heavy Rains Expected — Northern Region',
    body: 'Heavy rains are expected across the Northern Region next week. Prepare drainage channels and consider delaying fertilizer application to avoid runoff and nutrient loss.',
    date: '2026-07-22',
    read: false,
  },
  {
    id: 'a2',
    category: 'pest',
    title: 'Fall Armyworm Alert — Brong-Ahafo',
    body: 'Fall Armyworm has been detected in Brong-Ahafo. Scout your maize fields early morning. Apply recommended pesticides (Emamectin Benzoate) immediately if infestation is confirmed.',
    date: '2026-07-21',
    read: false,
  },
  {
    id: 'a3',
    category: 'climate',
    title: 'Optimal Planting Window — Volta Region',
    body: 'Soil moisture levels are ideal in the Volta Region this week. Conditions are optimal for planting maize. Aim for 75cm row spacing with 25cm between plants.',
    date: '2026-07-20',
    read: true,
  },
  {
    id: 'a4',
    category: 'market',
    title: 'Tomato Prices Rising — Sell Now',
    body: 'Tomato prices in Kumasi and Accra markets have risen 20% this week due to supply shortages. If you have harvest-ready tomatoes, this is a good time to sell.',
    date: '2026-07-19',
    read: true,
  },
  {
    id: 'a5',
    category: 'nutrition',
    title: 'Diversify with Orange-Fleshed Sweet Potato',
    body: 'Add orange-fleshed sweet potato to your crop rotation. It matures in 3-4 months, is drought-tolerant, and commands premium prices in urban markets.',
    date: '2026-07-18',
    read: true,
  },
  {
    id: 'a6',
    category: 'climate',
    title: 'Dry Spell Forecast — Southern Belt',
    body: 'A 2-week dry spell is forecast for the Southern Belt. Irrigate crops now and apply mulch to conserve soil moisture. Prioritize vegetable crops over maize.',
    date: '2026-07-17',
    read: true,
  },
];

const SEED_PRICES: MarketPrice[] = [
  { id: 'p1', commodity: 'Maize', price: 250, unit: '50kg bag', currency: 'GH₵', trend: 'up', changePercent: 8, market: 'Kumasi Central', updatedAt: '2026-07-22' },
  { id: 'p2', commodity: 'Tomatoes', price: 120, unit: 'crate', currency: 'GH₵', trend: 'up', changePercent: 20, market: 'Accra Makola', updatedAt: '2026-07-22' },
  { id: 'p3', commodity: 'Cassava', price: 80, unit: '50kg bag', currency: 'GH₵', trend: 'stable', changePercent: 0, market: 'Kumasi Central', updatedAt: '2026-07-22' },
  { id: 'p4', commodity: 'Local Rice', price: 320, unit: '50kg bag', currency: 'GH₵', trend: 'down', changePercent: -5, market: 'Accra Makola', updatedAt: '2026-07-22' },
  { id: 'p5', commodity: 'Cocoa', price: 1200, unit: '64kg bag', currency: 'GH₵', trend: 'up', changePercent: 12, market: 'COCOBOD Rate', updatedAt: '2026-07-22' },
  { id: 'p6', commodity: 'Groundnuts', price: 180, unit: '50kg bag', currency: 'GH₵', trend: 'stable', changePercent: 0, market: 'Tamale Market', updatedAt: '2026-07-22' },
  { id: 'p7', commodity: 'Yam', price: 45, unit: 'tuber (large)', currency: 'GH₵', trend: 'up', changePercent: 6, market: 'Kumasi Central', updatedAt: '2026-07-22' },
  { id: 'p8', commodity: 'Plantain', price: 2.50, unit: 'finger', currency: 'GH₵', trend: 'stable', changePercent: 1, market: 'Accra Makola', updatedAt: '2026-07-22' },
  { id: 'p9', commodity: 'Soybean', price: 220, unit: '50kg bag', currency: 'GH₵', trend: 'up', changePercent: 4, market: 'Tamale Market', updatedAt: '2026-07-21' },
  { id: 'p10', commodity: 'Onion', price: 95, unit: 'bag', currency: 'GH₵', trend: 'down', changePercent: -8, market: 'Accra Makola', updatedAt: '2026-07-21' },
];

const SEED_ALERTS: SmsAlert[] = [
  { id: 's1', message: 'ESOKO: Your weekly advisory digest is ready. 3 new tips for your farm this week.', type: 'advisory', timestamp: '2026-07-22T07:00:00Z', read: false },
  { id: 's2', message: 'ESOKO MARKET: Tomato prices up 20% in Kumasi & Accra. Sell your harvest now for best returns.', type: 'market', timestamp: '2026-07-21T14:30:00Z', read: false },
  { id: 's3', message: 'ESOKO WEATHER: Heavy rains expected Wed-Fri in Northern Region. Prepare drainage. Check full advisory.', type: 'weather', timestamp: '2026-07-21T09:00:00Z', read: true },
  { id: 's4', message: 'ESOKO SURVEY: Please submit your Q3 crop assessment by July 25. Your data helps improve advisories.', type: 'survey', timestamp: '2026-07-20T10:00:00Z', read: true },
  { id: 's5', message: 'ESOKO ALERT: Fall Armyworm detected near your district. Scout your maize fields today.', type: 'pest', timestamp: '2026-07-19T16:00:00Z', read: true },
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Kwame Mensah',
  phone: '+233 24 000 0001',
  region: 'Ashanti Region',
  farmerType: 'Smallholder Farmer',
  joinedDate: 'January 2024',
  alertsEnabled: true,
  weeklyDigest: true,
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [advisories, setAdvisories] = useState<Advisory[]>(SEED_ADVISORIES);
  const [marketPrices] = useState<MarketPrice[]>(SEED_PRICES);
  const [surveys, setSurveys] = useState<SurveySubmission[]>([]);
  const [smsAlerts, setSmsAlerts] = useState<SmsAlert[]>(SEED_ALERTS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@esoko:surveys');
        if (raw) setSurveys(JSON.parse(raw));
        const rawProfile = await AsyncStorage.getItem('@esoko:profile');
        if (rawProfile) setUserProfile(p => ({ ...p, ...JSON.parse(rawProfile) }));
        const rawAlerts = await AsyncStorage.getItem('@esoko:alerts');
        if (rawAlerts) setSmsAlerts(JSON.parse(rawAlerts));
      } catch (_) {}
    })();
  }, []);

  const unreadAlerts = smsAlerts.filter(a => !a.read).length;

  const markAdvisoryRead = (id: string) => {
    setAdvisories(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAlertRead = (id: string) => {
    setSmsAlerts(prev => {
      const next = prev.map(a => a.id === id ? { ...a, read: true } : a);
      AsyncStorage.setItem('@esoko:alerts', JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const submitSurvey = async (data: Omit<SurveySubmission, 'id' | 'submittedAt'>) => {
    const submission: SurveySubmission = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      submittedAt: new Date().toISOString(),
    };
    const next = [submission, ...surveys];
    setSurveys(next);
    await AsyncStorage.setItem('@esoko:surveys', JSON.stringify(next));
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const next = { ...userProfile, ...data };
    setUserProfile(next);
    await AsyncStorage.setItem('@esoko:profile', JSON.stringify(next));
  };

  return (
    <AppContext.Provider value={{
      advisories,
      marketPrices,
      surveys,
      smsAlerts,
      userProfile,
      unreadAlerts,
      markAdvisoryRead,
      markAlertRead,
      submitSurvey,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
