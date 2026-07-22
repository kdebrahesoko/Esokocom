import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useApp, AdvisoryCategory } from '@/context/AppContext';
import { AdvisoryCard } from '@/components/AdvisoryCard';

const FILTERS: { key: 'all' | AdvisoryCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'weather', label: 'Weather' },
  { key: 'pest', label: 'Pests' },
  { key: 'market', label: 'Market' },
  { key: 'climate', label: 'Climate' },
  { key: 'nutrition', label: 'Nutrition' },
];

export default function AdvisoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { advisories } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | AdvisoryCategory>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = activeFilter === 'all'
    ? advisories
    : advisories.filter(a => a.category === activeFilter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
          Advisory
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Personalized farm intelligence
        </Text>

        {/* Filter chips */}
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          keyExtractor={f => f.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                {
                  backgroundColor: activeFilter === item.key ? colors.primary : colors.muted,
                  borderColor: activeFilter === item.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text style={[
                styles.chipText,
                {
                  color: activeFilter === item.key ? colors.primaryForeground : colors.mutedForeground,
                  fontFamily: 'Inter_500Medium',
                }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Advisory list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100 }
        ]}
        scrollEnabled={filtered.length > 0}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AdvisoryCard advisory={item} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              No advisories in this category
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, marginBottom: 2 },
  subtitle: { fontSize: 13, marginBottom: 16 },
  filtersContainer: { gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13 },
  listContent: { paddingHorizontal: 20, paddingTop: 8 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15 },
});
