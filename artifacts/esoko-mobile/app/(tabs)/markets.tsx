import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp, MarketPrice } from '@/context/AppContext';

const COMMODITY_ICONS: Record<string, { icon: string; lib: 'mci' | 'feather' }> = {
  'Maize': { icon: 'corn', lib: 'mci' },
  'Tomatoes': { icon: 'food-apple', lib: 'mci' },
  'Cassava': { icon: 'sprout', lib: 'mci' },
  'Local Rice': { icon: 'rice', lib: 'mci' },
  'Cocoa': { icon: 'leaf', lib: 'mci' },
  'Groundnuts': { icon: 'peanut', lib: 'mci' },
  'Yam': { icon: 'carrot', lib: 'mci' },
  'Plantain': { icon: 'food-banana', lib: 'mci' },
  'Soybean': { icon: 'seed', lib: 'mci' },
  'Onion': { icon: 'food', lib: 'mci' },
};

function PriceItem({ price }: { price: MarketPrice }) {
  const colors = useColors();
  const iconKey = COMMODITY_ICONS[price.commodity] ?? { icon: 'leaf', lib: 'mci' };
  const trendColor = price.trend === 'up' ? colors.primary : price.trend === 'down' ? colors.destructive : colors.mutedForeground;
  const trendIcon = price.trend === 'up' ? 'trending-up' : price.trend === 'down' ? 'trending-down' : 'minus';

  return (
    <View style={[styles.priceCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
        <MaterialCommunityIcons name={iconKey.icon as any} size={22} color={colors.primary} />
      </View>

      <View style={styles.priceInfo}>
        <Text style={[styles.commodityName, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
          {price.commodity}
        </Text>
        <Text style={[styles.marketName, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {price.market}
        </Text>
        <Text style={[styles.unit, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          per {price.unit}
        </Text>
      </View>

      <View style={styles.priceRight}>
        <Text style={[styles.price, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
          {price.currency}{price.price.toFixed(price.price < 10 ? 2 : 0)}
        </Text>
        <View style={[styles.trendRow, { backgroundColor: trendColor + '18' }]}>
          <Feather name={trendIcon} size={11} color={trendColor} />
          <Text style={[styles.trendLabel, { color: trendColor, fontFamily: 'Inter_500Medium' }]}>
            {price.changePercent > 0 ? '+' : ''}{price.changePercent}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatCachedAt(iso: string | null): string {
  if (!iso) return 'Ghana markets';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MarketsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { marketPrices, isLoading, refresh, pricesCachedAt } = useApp();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = marketPrices.filter(p =>
    p.commodity.toLowerCase().includes(search.toLowerCase()) ||
    p.market.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            Market Prices
          </Text>
          <View style={[styles.liveBadge, { backgroundColor: colors.primary + '18' }]}>
            <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.liveText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>Live</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {pricesCachedAt ? `Updated ${formatCachedAt(pricesCachedAt)}` : 'Ghana markets'}
        </Text>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search commodity or market..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100 }
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        renderItem={({ item }) => <PriceItem price={item} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="search" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              No results for "{search}"
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { fontSize: 28 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 12 },
  subtitle: { fontSize: 13, marginBottom: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  list: { paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceInfo: { flex: 1 },
  commodityName: { fontSize: 15, marginBottom: 2 },
  marketName: { fontSize: 12, marginBottom: 1 },
  unit: { fontSize: 11 },
  priceRight: { alignItems: 'flex-end', gap: 6 },
  price: { fontSize: 17 },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendLabel: { fontSize: 11 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
});
