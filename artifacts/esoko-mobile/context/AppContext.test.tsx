import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestRenderer, { act } from 'react-test-renderer';

const mocks = vi.hoisted(() => ({
  storageValues: new Map<string, string>(),
  getItem: vi.fn(async (key: string) => mocks.storageValues.get(key) ?? null),
  setItem: vi.fn(async () => undefined),
  useListAdvisories: vi.fn(),
  useListMarketPrices: vi.fn(),
  useListSmsAlerts: vi.fn(),
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: mocks.getItem,
    setItem: mocks.setItem,
  },
}));

vi.mock('@workspace/api-client-react', () => ({
  getListAdvisoriesQueryKey: () => ['/api/advisories'],
  getListMarketPricesQueryKey: () => ['/api/market-prices'],
  getListSmsAlertsQueryKey: () => ['/api/sms-alerts'],
  useListAdvisories: mocks.useListAdvisories,
  useListMarketPrices: mocks.useListMarketPrices,
  useListSmsAlerts: mocks.useListSmsAlerts,
}));

import {
  AppProvider,
  getAdvisoryReadKey,
  getAlertReadKey,
  invalidateFarmDataQueries,
  loadCachedCollection,
  useApp,
} from './AppContext';

type AppState = ReturnType<typeof useApp>;

const cachedPrice = {
  id: 'cached-p1',
  commodity: 'Maize',
  price: 275,
  unit: '50kg bag',
  currency: 'GH₵',
  trend: 'up',
  changePercent: 4,
  market: 'Kumasi Central',
  updatedAt: '2026-08-01',
};

const refreshedPrice = {
  ...cachedPrice,
  id: 'live-p1',
  price: 310,
};

const cachedAdvisory = {
  id: 'cached-a1',
  category: 'weather',
  title: 'Cached rainfall guidance',
  body: 'Prepare drainage before the next storm.',
  date: '2026-08-01',
  read: false,
};

function queryError() {
  return { data: undefined, error: new Error('API unavailable'), isFetching: false, isError: true };
}

function emptyQuery() {
  return { data: undefined, error: null, isFetching: false, isError: false };
}

function configureQueries() {
  mocks.useListAdvisories.mockReturnValue(queryError());
  mocks.useListMarketPrices.mockReturnValue(queryError());
  mocks.useListSmsAlerts.mockReturnValue(queryError());
}

describe('mobile farm-data resilience', () => {
  let renderer: TestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    mocks.storageValues.clear();
    mocks.getItem.mockClear();
    mocks.setItem.mockClear();
    mocks.useListAdvisories.mockReset();
    mocks.useListMarketPrices.mockReset();
    mocks.useListSmsAlerts.mockReset();
    configureQueries();
  });

  afterEach(() => {
    renderer?.unmount();
    renderer = undefined;
  });

  it('serves the AsyncStorage snapshot when the API returns an error', async () => {
    mocks.storageValues.set('@esoko:v1:prices-cache', JSON.stringify([cachedPrice]));
    mocks.storageValues.set('@esoko:v1:advisories-cache', JSON.stringify([cachedAdvisory]));
    let app: AppState | undefined;
    function Probe() {
      app = useApp();
      return null;
    }

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await act(async () => {
      renderer = TestRenderer.create(
        <QueryClientProvider client={client}>
          <AppProvider><Probe /></AppProvider>
        </QueryClientProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(app?.marketPrices).toEqual([cachedPrice]);
    expect(app?.advisories).toEqual([cachedAdvisory]);
    expect(app?.marketPrices).not.toEqual(expect.arrayContaining([{ price: 250 }]));
    expect(mocks.getItem).toHaveBeenCalledWith('@esoko:v1:prices-cache');
  });

  it('pull-to-refresh invalidates every live query and displays refreshed data', async () => {
    let app: AppState | undefined;
    function Probe() {
      app = useApp();
      return null;
    }

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    function ProviderTree() {
      return (
        <QueryClientProvider client={client}>
          <AppProvider><Probe /></AppProvider>
        </QueryClientProvider>
      );
    }

    await act(async () => {
      renderer = TestRenderer.create(<ProviderTree />);
      await Promise.resolve();
    });

    const refreshClient = new QueryClient();
    const invalidateQueries = vi.spyOn(refreshClient, 'invalidateQueries').mockResolvedValue();
    await invalidateFarmDataQueries(refreshClient);
    expect(invalidateQueries.mock.calls.map(([options]) => options)).toEqual([
      { queryKey: ['/api/advisories'] },
      { queryKey: ['/api/market-prices'] },
      { queryKey: ['/api/sms-alerts'] },
    ]);

    mocks.useListAdvisories.mockReturnValue(emptyQuery());
    mocks.useListMarketPrices.mockReturnValue({ data: [refreshedPrice], error: null, isFetching: false, isError: false });
    mocks.useListSmsAlerts.mockReturnValue(emptyQuery());
    await act(async () => {
      renderer?.update(<ProviderTree />);
      await Promise.resolve();
    });

    expect(app?.marketPrices).toEqual([refreshedPrice]);
  });

  it('shows seed data when there is no cache and the API is unreachable', async () => {
    let app: AppState | undefined;
    function Probe() {
      app = useApp();
      return null;
    }

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await act(async () => {
      renderer = TestRenderer.create(
        <QueryClientProvider client={client}>
          <AppProvider><Probe /></AppProvider>
        </QueryClientProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(app?.marketPrices[0]).toMatchObject({
      id: 'seed-p1',
      commodity: 'Maize',
      price: 250,
    });
    expect(app?.advisories[0]).toMatchObject({
      id: 'seed-a1',
      category: 'weather',
    });
  });

  it('ignores malformed cache entries and falls back to seed data', async () => {
    const seedPrice = { id: 'seed-p1', commodity: 'Maize', price: 250 };
    const storage = {
      getItem: vi.fn(async () => '{not valid json'),
    };

    await expect(
      loadCachedCollection(storage, '@esoko:v1:prices-cache', [seedPrice]),
    ).resolves.toEqual([seedPrice]);
  });

  it('keeps advisory read state tied to content instead of a recycled server ID', async () => {
    const firstAdvisory = {
      id: 42,
      category: 'weather' as const,
      title: 'Original advisory',
      body: 'Original guidance.',
      date: '2026-08-01',
    };
    const replacementAdvisory = {
      ...firstAdvisory,
      title: 'Replacement advisory',
      body: 'New guidance after the record was recreated.',
      date: '2026-08-15',
    };
    mocks.useListAdvisories.mockReturnValue({
      data: [firstAdvisory],
      error: null,
      isFetching: false,
      isError: false,
    });
    mocks.storageValues.set(
      '@esoko:v1:advisories-cache',
      JSON.stringify([{ ...firstAdvisory, id: '42', read: false }]),
    );
    let app: AppState | undefined;
    function Probe() {
      app = useApp();
      return null;
    }
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await act(async () => {
      renderer = TestRenderer.create(
        <QueryClientProvider client={client}>
          <AppProvider><Probe /></AppProvider>
        </QueryClientProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(async () => {
      app?.markAdvisoryRead('42');
    });
    expect(app?.advisories[0].read).toBe(true);
    expect(mocks.setItem).toHaveBeenCalledWith(
      '@esoko:v2:read-advisory-keys',
      JSON.stringify([getAdvisoryReadKey({ ...firstAdvisory, id: '42' })]),
    );

    mocks.useListAdvisories.mockReturnValue({
      data: [replacementAdvisory],
      error: null,
      isFetching: false,
      isError: false,
    });
    await act(async () => {
      renderer?.update(
        <QueryClientProvider client={client}>
          <AppProvider><Probe /></AppProvider>
        </QueryClientProvider>,
      );
      await Promise.resolve();
    });

    expect(app?.advisories[0]).toMatchObject({
      id: '42',
      title: 'Replacement advisory',
      read: false,
    });
  });

  it('uses the alert content when persisting alert read state', async () => {
    const alert = {
      id: 7,
      message: 'Heavy rain expected.',
      type: 'weather' as const,
      timestamp: '2026-08-15T09:00:00Z',
    };
    mocks.useListSmsAlerts.mockReturnValue({
      data: [alert],
      error: null,
      isFetching: false,
      isError: false,
    });
    mocks.storageValues.set(
      '@esoko:v1:alerts-cache',
      JSON.stringify([{ ...alert, id: '7', read: false }]),
    );
    let app: AppState | undefined;
    function Probe() {
      app = useApp();
      return null;
    }
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    await act(async () => {
      renderer = TestRenderer.create(
        <QueryClientProvider client={client}>
          <AppProvider><Probe /></AppProvider>
        </QueryClientProvider>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(async () => {
      app?.markAlertRead('7');
    });

    expect(mocks.setItem).toHaveBeenCalledWith(
      '@esoko:v2:read-alert-keys',
      JSON.stringify([getAlertReadKey({ ...alert, id: '7' })]),
    );
  });
});