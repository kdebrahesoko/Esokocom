import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListAdvisories,
  useListMarketPrices,
  useListSmsAlerts,
  getListAdvisoriesQueryKey,
  getListMarketPricesQueryKey,
  getListSmsAlertsQueryKey,
} from '@workspace/api-client-react';

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
  latitude?: number;
  longitude?: number;
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
  isLoading: boolean;
  refresh: () => Promise<void>;
  markAdvisoryRead: (id: string) => void;
  markAlertRead: (id: string) => void;
  submitSurvey: (data: Omit<SurveySubmission, 'id' | 'submittedAt'>) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// ─── AsyncStorage Keys ────────────────────────────────────────────────────────

const KEYS = {
  surveys: '@esoko:surveys',
  profile: '@esoko:profile',
  advisoriesCache: '@esoko:advisories-cache',
  pricesCache: '@esoko:prices-cache',
  alertsCache: '@esoko:alerts-cache',
  readAdvisoryIds: '@esoko:read-advisory-ids',
  readAlertIds: '@esoko:read-alert-ids',
} as const;

// ─── Fallback seed data (shown when API is unreachable and no cache exists) ───

const SEED_ADVISORIES: Advisory[] = [
  {
    id: 'seed-a1',
    category: 'weather',
    title: 'Heavy Rains Expected — Northern Region',
    body: 'Heavy rains are expected across the Northern Region next week. Prepare drainage channels and consider delaying fertilizer application to avoid runoff and nutrient loss.',
    date: '2026-07-22',
    read: false,
  },
  {
    id: 'seed-a2',
    category: 'pest',
    title: 'Fall Armyworm Alert — Brong-Ahafo',
    body: 'Fall Armyworm has been detected in Brong-Ahafo. Scout your maize fields early morning. Apply recommended pesticides (Emamectin Benzoate) immediately if infestation is confirmed.',
    date: '2026-07-21',
    read: false,
  },
  {
    id: 'seed-a3',
    category: 'climate',
    title: 'Optimal Planting Window — Volta Region',
    body: 'Soil moisture levels are ideal in the Volta Region this week. Conditions are optimal for planting maize. Aim for 75cm row spacing with 25cm between plants.',
    date: '2026-07-20',
    read: true,
  },
];

const SEED_PRICES: MarketPrice[] = [
  { id: 'seed-p1', commodity: 'Maize', price: 250, unit: '50kg bag', currency: 'GH₵', trend: 'up', changePercent: 8, market: 'Kumasi Central', updatedAt: '2026-07-22' },
  { id: 'seed-p2', commodity: 'Tomatoes', price: 120, unit: 'crate', currency: 'GH₵', trend: 'up', changePercent: 20, market: 'Accra Makola', updatedAt: '2026-07-22' },
  { id: 'seed-p3', commodity: 'Cassava', price: 80, unit: '50kg bag', currency: 'GH₵', trend: 'stable', changePercent: 0, market: 'Kumasi Central', updatedAt: '2026-07-22' },
  { id: 'seed-p4', commodity: 'Local Rice', price: 320, unit: '50kg bag', currency: 'GH₵', trend: 'down', changePercent: -5, market: 'Accra Makola', updatedAt: '2026-07-22' },
  { id: 'seed-p5', commodity: 'Cocoa', price: 1200, unit: '64kg bag', currency: 'GH₵', trend: 'up', changePercent: 12, market: 'COCOBOD Rate', updatedAt: '2026-07-22' },
];

const SEED_ALERTS: SmsAlert[] = [
  { id: 'seed-s1', message: 'ESOKO: Your weekly advisory digest is ready. 3 new tips for your farm this week.', type: 'advisory', timestamp: '2026-07-22T07:00:00Z', read: false },
  { id: 'seed-s2', message: 'ESOKO MARKET: Tomato prices up 20% in Kumasi & Accra. Sell your harvest now for best returns.', type: 'market', timestamp: '2026-07-21T14:30:00Z', read: false },
  { id: 'seed-s3', message: 'ESOKO WEATHER: Heavy rains expected Wed-Fri in Northern Region. Prepare drainage. Check full advisory.', type: 'weather', timestamp: '2026-07-21T09:00:00Z', read: true },
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
  const queryClient = useQueryClient();

  // ── Local state (immediately hydrated from cache) ──────────────────────────
  const [advisories, setAdvisories] = useState<Advisory[]>(SEED_ADVISORIES);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(SEED_PRICES);
  const [smsAlerts, setSmsAlerts] = useState<SmsAlert[]>(SEED_ALERTS);
  const [surveys, setSurveys] = useState<SurveySubmission[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Local sets of read IDs (stored in AsyncStorage, not on server)
  const readAdvisoryIds = useRef<Set<string>>(new Set());
  const readAlertIds = useRef<Set<string>>(new Set());

  // ── API queries ────────────────────────────────────────────────────────────
  const advisoriesQuery = useListAdvisories();
  const pricesQuery = useListMarketPrices();
  const alertsQuery = useListSmsAlerts();

  const isLoading = advisoriesQuery.isFetching || pricesQuery.isFetching || alertsQuery.isFetching;

  // ── Hydrate local state from AsyncStorage on mount ─────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [rawAdvisories, rawPrices, rawAlerts, rawSurveys, rawProfile, rawReadAdvisory, rawReadAlerts] =
          await Promise.all([
            AsyncStorage.getItem(KEYS.advisoriesCache),
            AsyncStorage.getItem(KEYS.pricesCache),
            AsyncStorage.getItem(KEYS.alertsCache),
            AsyncStorage.getItem(KEYS.surveys),
            AsyncStorage.getItem(KEYS.profile),
            AsyncStorage.getItem(KEYS.readAdvisoryIds),
            AsyncStorage.getItem(KEYS.readAlertIds),
          ]);

        if (rawReadAdvisory) {
          readAdvisoryIds.current = new Set(JSON.parse(rawReadAdvisory));
        }
        if (rawReadAlerts) {
          readAlertIds.current = new Set(JSON.parse(rawReadAlerts));
        }
        if (rawAdvisories) {
          const cached: Advisory[] = JSON.parse(rawAdvisories);
          setAdvisories(cached.map(a => ({ ...a, read: readAdvisoryIds.current.has(a.id) })));
        }
        if (rawPrices) {
          setMarketPrices(JSON.parse(rawPrices));
        }
        if (rawAlerts) {
          const cached: SmsAlert[] = JSON.parse(rawAlerts);
          setSmsAlerts(cached.map(a => ({ ...a, read: readAlertIds.current.has(a.id) })));
        }
        if (rawSurveys) {
          setSurveys(JSON.parse(rawSurveys));
        }
        if (rawProfile) {
          setUserProfile(p => ({ ...p, ...JSON.parse(rawProfile) }));
        }
      } catch (_) {}
    })();
  }, []);

  // ── Sync API responses → local state + cache ───────────────────────────────
  useEffect(() => {
    if (!advisoriesQuery.data) return;
    const merged: Advisory[] = advisoriesQuery.data.map(a => ({
      id: String(a.id),
      category: a.category as AdvisoryCategory,
      title: a.title,
      body: a.body,
      date: a.date,
      read: readAdvisoryIds.current.has(String(a.id)),
    }));
    setAdvisories(merged);
    // Cache for offline use (without read state — read state is kept separately)
    AsyncStorage.setItem(KEYS.advisoriesCache, JSON.stringify(merged)).catch(() => {});
  }, [advisoriesQuery.data]);

  useEffect(() => {
    if (!pricesQuery.data) return;
    const merged: MarketPrice[] = pricesQuery.data.map(p => ({
      id: String(p.id),
      commodity: p.commodity,
      price: p.price,
      unit: p.unit,
      currency: p.currency,
      trend: p.trend as 'up' | 'down' | 'stable',
      changePercent: p.changePercent,
      market: p.market,
      updatedAt: p.updatedAt,
    }));
    setMarketPrices(merged);
    AsyncStorage.setItem(KEYS.pricesCache, JSON.stringify(merged)).catch(() => {});
  }, [pricesQuery.data]);

  useEffect(() => {
    if (!alertsQuery.data) return;
    const merged: SmsAlert[] = alertsQuery.data.map(a => ({
      id: String(a.id),
      message: a.message,
      type: a.type as SmsAlert['type'],
      timestamp: a.timestamp,
      read: readAlertIds.current.has(String(a.id)),
    }));
    setSmsAlerts(merged);
    AsyncStorage.setItem(KEYS.alertsCache, JSON.stringify(merged)).catch(() => {});
  }, [alertsQuery.data]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const unreadAlerts = smsAlerts.filter(a => !a.read).length;

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getListAdvisoriesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListMarketPricesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListSmsAlertsQueryKey() }),
    ]);
  }, [queryClient]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const markAdvisoryRead = useCallback((id: string) => {
    readAdvisoryIds.current.add(id);
    AsyncStorage.setItem(KEYS.readAdvisoryIds, JSON.stringify([...readAdvisoryIds.current])).catch(() => {});
    setAdvisories(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    readAlertIds.current.add(id);
    AsyncStorage.setItem(KEYS.readAlertIds, JSON.stringify([...readAlertIds.current])).catch(() => {});
    setSmsAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const submitSurvey = useCallback(async (data: Omit<SurveySubmission, 'id' | 'submittedAt'>) => {
    const submission: SurveySubmission = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      submittedAt: new Date().toISOString(),
    };
    setSurveys(prev => {
      const next = [submission, ...prev];
      AsyncStorage.setItem(KEYS.surveys, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...data };
      AsyncStorage.setItem(KEYS.profile, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      advisories,
      marketPrices,
      surveys,
      smsAlerts,
      userProfile,
      unreadAlerts,
      isLoading,
      refresh,
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
