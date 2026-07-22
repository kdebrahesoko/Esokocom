import React, { useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { AdvisoryCard } from '@/components/AdvisoryCard';

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { advisories, marketPrices, unreadAlerts, surveys, refresh } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const featuredAdvisories = advisories.slice(0, 2);
  const topPrices = marketPrices.slice(0, 3);
  const unreadAdvisories = advisories.filter(a => !a.read).length;

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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoChip, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="sprout" size={14} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            esoko
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bellBtn, { backgroundColor: colors.muted }]}
          onPress={() => router.push('/(tabs)/profile')}
          testID="home-alerts-btn"
        >
          <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
          {unreadAlerts > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.brand }]}>
              <Text style={styles.badgeText}>{unreadAlerts}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBlock}>
        <Text style={[styles.greetingLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Good morning
        </Text>
        <Text style={[styles.greetingName, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
          Kwame Mensah
        </Text>
        <Text style={[styles.greetingRegion, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Ashanti Region · July 22, 2026
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard
          icon={<MaterialCommunityIcons name="sprout" size={18} color={colors.primary} />}
          label="Advisory"
          value={`${unreadAdvisories}`}
          color={colors.primary}
        />
        <StatCard
          icon={<Feather name="clipboard" size={18} color={colors.secondary} />}
          label="Surveys"
          value={`${surveys.length}`}
          color={colors.secondary}
        />
        <StatCard
          icon={<Ionicons name="notifications" size={18} color={colors.brand} />}
          label="Alerts"
          value={`${unreadAlerts}`}
          color={colors.brand}
        />
      </View>

      {/* Advisory Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            Today's Advisory
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/advisory')}>
            <Text style={[styles.seeAll, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {featuredAdvisories.map(advisory => (
          <AdvisoryCard key={advisory.id} advisory={advisory} compact />
        ))}
      </View>

      {/* Market Snapshot */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            Market Snapshot
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/markets')}>
            <Text style={[styles.seeAll, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.marketCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {topPrices.map((price, idx) => (
            <React.Fragment key={price.id}>
              <View style={styles.priceRow}>
                <Text style={[styles.commodity, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
                  {price.commodity}
                </Text>
                <View style={styles.priceRight}>
                  <Text style={[styles.priceVal, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                    {price.currency}{price.price}
                  </Text>
                  <View style={[
                    styles.trendBadge,
                    { backgroundColor: price.trend === 'up' ? colors.primary + '18' : price.trend === 'down' ? '#EF444418' : colors.muted }
                  ]}>
                    <Feather
                      name={price.trend === 'up' ? 'trending-up' : price.trend === 'down' ? 'trending-down' : 'minus'}
                      size={12}
                      color={price.trend === 'up' ? colors.primary : price.trend === 'down' ? colors.destructive : colors.mutedForeground}
                    />
                    <Text style={[
                      styles.trendText,
                      {
                        color: price.trend === 'up' ? colors.primary : price.trend === 'down' ? colors.destructive : colors.mutedForeground,
                        fontFamily: 'Inter_500Medium'
                      }
                    ]}>
                      {price.changePercent > 0 ? '+' : ''}{price.changePercent}%
                    </Text>
                  </View>
                </View>
              </View>
              {idx < topPrices.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 18 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold' as any },
  greetingBlock: { marginBottom: 24 },
  greetingLabel: { fontSize: 13, marginBottom: 2 },
  greetingName: { fontSize: 26, marginBottom: 4 },
  greetingRegion: { fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 11 },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17 },
  seeAll: { fontSize: 13 },
  marketCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  commodity: { fontSize: 15 },
  priceRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priceVal: { fontSize: 15 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendText: { fontSize: 11 },
  divider: { height: 1, marginHorizontal: 16 },
});
