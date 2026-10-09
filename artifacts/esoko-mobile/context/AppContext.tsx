import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
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
  /** ISO timestamp of the last successful market-prices fetch (null = never fetched / seed data) */
  pricesCachedAt: string | null;
  /** ISO timestamp of the last successful advisories fetch (null = never fetched / seed data) */
  advisoriesCachedAt: string | null;
  refresh: () => Promise<void>;
  markAdvisoryRead: (id: string) => void;
  markAlertRead: (id: string) => void;
  submitSurvey: (data: Omit<SurveySubmission, 'id' | 'submittedAt'>) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// ─── AsyncStorage Keys ────────────────────────────────────────────────────────
// Cache keys are versioned (v1:) so that a schema change can safely bump the
// version and old incompatible entries will simply be ignored on next launch.

const KEYS = {
  surveys: '@esoko:surveys',
  profile: '@esoko:profile',
  advisoriesCache: '@esoko:v1:advisories-cache',
  pricesCache: '@esoko:v1:prices-cache',
  alertsCache: '@esoko:v1:alerts-cache',
  pricesCachedAt: '@esoko:v1:prices-cached-at',
  advisoriesCachedAt: '@esoko:v1:advisories-cached-at',
  // Versioned separately from the old ID-only values. A recycled server ID
  // must not make a newly-created record appear to have been read.
  readAdvisoryKeys: '@esoko:v2:read-advisory-keys',
  readAlertKeys: '@esoko:v2:read-alert-keys',
} as const;

/**
 * Build a deterministic identity for the version of an advisory the farmer
 * actually saw. The server currently exposes IDs without a per-user
 * read-state endpoint, so the ID alone is not safe when data is recreated.
 */
export function getAdvisoryReadKey(advisory: Pick<Advisory, 'id' | 'category' | 'title' | 'body' | 'date'>): string {
  return JSON.stringify([
    'advisory',
    String(advisory.id),
    advisory.category,
    advisory.title,
    advisory.body,
    advisory.date,
  ]);
}

/** Build the equivalent content-aware identity for an SMS alert. */
export function getAlertReadKey(alert: Pick<SmsAlert, 'id' | 'message' | 'type' | 'timestamp'>): string {
  return JSON.stringify([
    'alert',
    String(alert.id),
    alert.type,
    alert.message,
    alert.timestamp,
  ]);
}

export interface CacheStorage {
  getItem(key: string): Promise<string | null>;
}

/**
 * Read a cached collection without allowing malformed or unavailable storage
 * data to prevent the app from showing its built-in fallback.
 */
export async function loadCachedCollection<T>(
  storage: CacheStorage,
  key: string,
  fallback: T[],
): Promise<T[]> {
  try {
    const raw = await storage.getItem(key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : fallback;
  } catch (_) {
    return fallback;
  }
}

export async function invalidateFarmDataQueries(
  queryClient: Pick<QueryClient, 'invalidateQueries'>,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: getListAdvisoriesQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListMarketPricesQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListSmsAlertsQueryKey() }),
  ]);
}

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

  // ISO timestamps of the last successful API fetch (null = seed data, never fetched)
  const [pricesCachedAt, setPricesCachedAt] = useState<string | null>(null);
  const [advisoriesCachedAt, setAdvisoriesCachedAt] = useState<string | null>(null);

  // Local sets of content-aware read keys (stored in AsyncStorage, not on server)
  const readAdvisoryKeys = useRef<Set<string>>(new Set());
  const readAlertKeys = useRef<Set<string>>(new Set());

  // ── API queries ────────────────────────────────────────────────────────────
  const advisoriesQuery = useListAdvisories();
  const pricesQuery = useListMarketPrices();
  const alertsQuery = useListSmsAlerts();

  const isLoading = advisoriesQuery.isFetching || pricesQuery.isFetching || alertsQuery.isFetching;

  // ── Hydrate local state from AsyncStorage on mount ─────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [
          rawAdvisories, rawPrices, rawAlerts, rawSurveys, rawProfile,
          rawReadAdvisoryKeys, rawReadAlertKeys, rawPricesCachedAt, rawAdvisoriesCachedAt,
        ] = await Promise.all([
          loadCachedCollection(AsyncStorage, KEYS.advisoriesCache, SEED_ADVISORIES),
          loadCachedCollection(AsyncStorage, KEYS.pricesCache, SEED_PRICES),
          loadCachedCollection(AsyncStorage, KEYS.alertsCache, SEED_ALERTS),
          AsyncStorage.getItem(KEYS.surveys),
          AsyncStorage.getItem(KEYS.profile),
          AsyncStorage.getItem(KEYS.readAdvisoryKeys),
          AsyncStorage.getItem(KEYS.readAlertKeys),
          AsyncStorage.getItem(KEYS.pricesCachedAt),
          AsyncStorage.getItem(KEYS.advisoriesCachedAt),
        ]);

        if (rawReadAdvisoryKeys) {
          readAdvisoryKeys.current = new Set(JSON.parse(rawReadAdvisoryKeys));
        }
        if (rawReadAlertKeys) {
          readAlertKeys.current = new Set(JSON.parse(rawReadAlertKeys));
        }
        const cachedAdvisories = rawAdvisories as Advisory[];
        setAdvisories(cachedAdvisories.map(a => ({
          ...a,
          read: readAdvisoryKeys.current.has(getAdvisoryReadKey(a)),
        })));
        setMarketPrices(rawPrices as MarketPrice[]);
        const cachedAlerts = rawAlerts as SmsAlert[];
        setSmsAlerts(cachedAlerts.map(a => ({
          ...a,
          read: readAlertKeys.current.has(getAlertReadKey(a)),
        })));
        if (rawSurveys) {
          setSurveys(JSON.parse(rawSurveys));
        }
        if (rawProfile) {
          setUserProfile(p => ({ ...p, ...JSON.parse(rawProfile) }));
        }
        if (rawPricesCachedAt) {
          setPricesCachedAt(rawPricesCachedAt);
        }
        if (rawAdvisoriesCachedAt) {
          setAdvisoriesCachedAt(rawAdvisoriesCachedAt);
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
      read: false,
    }));
    for (const advisory of merged) {
      advisory.read = readAdvisoryKeys.current.has(getAdvisoryReadKey(advisory));
    }
    setAdvisories(merged);
    const now = new Date().toISOString();
    setAdvisoriesCachedAt(now);
    // Cache for offline use (without read state — read state is kept separately)
    AsyncStorage.setItem(KEYS.advisoriesCache, JSON.stringify(merged)).catch(() => {});
    AsyncStorage.setItem(KEYS.advisoriesCachedAt, now).catch(() => {});
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
    const now = new Date().toISOString();
    setPricesCachedAt(now);
    AsyncStorage.setItem(KEYS.pricesCache, JSON.stringify(merged)).catch(() => {});
    AsyncStorage.setItem(KEYS.pricesCachedAt, now).catch(() => {});
  }, [pricesQuery.data]);

  useEffect(() => {
    if (!alertsQuery.data) return;
    const merged: SmsAlert[] = alertsQuery.data.map(a => ({
      id: String(a.id),
      message: a.message,
      type: a.type as SmsAlert['type'],
      timestamp: a.timestamp,
      read: false,
    }));
    for (const alert of merged) {
      alert.read = readAlertKeys.current.has(getAlertReadKey(alert));
    }
    setSmsAlerts(merged);
    AsyncStorage.setItem(KEYS.alertsCache, JSON.stringify(merged)).catch(() => {});
  }, [alertsQuery.data]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const unreadAlerts = smsAlerts.filter(a => !a.read).length;

  // ── Pull-to-refresh ────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    await invalidateFarmDataQueries(queryClient);
  }, [queryClient]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const markAdvisoryRead = useCallback((id: string) => {
    const advisory = advisories.find(item => item.id === id);
    if (!advisory) return;
    readAdvisoryKeys.current.add(getAdvisoryReadKey(advisory));
    AsyncStorage.setItem(KEYS.readAdvisoryKeys, JSON.stringify([...readAdvisoryKeys.current])).catch(() => {});
    setAdvisories(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, [advisories]);

  const markAlertRead = useCallback((id: string) => {
    const alert = smsAlerts.find(item => item.id === id);
    if (!alert) return;
    readAlertKeys.current.add(getAlertReadKey(alert));
    AsyncStorage.setItem(KEYS.readAlertKeys, JSON.stringify([...readAlertKeys.current])).catch(() => {});
    setSmsAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, [smsAlerts]);

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
      pricesCachedAt,
      advisoriesCachedAt,
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
