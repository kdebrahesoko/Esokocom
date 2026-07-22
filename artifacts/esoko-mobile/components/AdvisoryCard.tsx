import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { Advisory, AdvisoryCategory, useApp } from '@/context/AppContext';

const CATEGORY_CONFIG: Record<AdvisoryCategory, {
  icon: React.ReactNode;
  label: string;
  bg: string;
  text: string;
}> = {
  weather: {
    icon: null,
    label: 'Weather',
    bg: '#4A90D9',
    text: '#fff',
  },
  pest: {
    icon: null,
    label: 'Pest Alert',
    bg: '#E8543A',
    text: '#fff',
  },
  market: {
    icon: null,
    label: 'Market',
    bg: '#F5B300',
    text: '#1A2B3C',
  },
  nutrition: {
    icon: null,
    label: 'Nutrition',
    bg: '#16A149',
    text: '#fff',
  },
  climate: {
    icon: null,
    label: 'Climate',
    bg: '#0B6A39',
    text: '#fff',
  },
};

const CATEGORY_ICONS: Record<AdvisoryCategory, React.ReactNode> = {
  weather: <Feather name="cloud-rain" size={14} color="#fff" />,
  pest: <MaterialCommunityIcons name="bug" size={14} color="#fff" />,
  market: <Feather name="trending-up" size={14} color="#1A2B3C" />,
  nutrition: <Ionicons name="nutrition" size={14} color="#fff" />,
  climate: <MaterialCommunityIcons name="sprout" size={14} color="#fff" />,
};

interface Props {
  advisory: Advisory;
  compact?: boolean;
}

export function AdvisoryCard({ advisory, compact = false }: Props) {
  const colors = useColors();
  const { markAdvisoryRead } = useApp();
  const cfg = CATEGORY_CONFIG[advisory.category];

  const handlePress = () => {
    Haptics.selectionAsync();
    markAdvisoryRead(advisory.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: advisory.read ? colors.cardBorder : colors.primary + '40',
        },
        compact && styles.cardCompact,
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Unread indicator */}
      {!advisory.read && (
        <View style={[styles.unreadBar, { backgroundColor: colors.primary }]} />
      )}

      <View style={compact ? styles.bodyCompact : styles.body}>
        {/* Category chip */}
        <View style={styles.topRow}>
          <View style={[styles.chip, { backgroundColor: cfg.bg }]}>
            {CATEGORY_ICONS[advisory.category]}
            <Text style={[styles.chipLabel, { color: cfg.text, fontFamily: 'Inter_500Medium' }]}>
              {cfg.label}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {advisory.date}
          </Text>
        </View>

        <Text
          style={[styles.title, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}
          numberOfLines={compact ? 2 : undefined}
        >
          {advisory.title}
        </Text>

        {!compact && (
          <Text style={[styles.body2, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {advisory.body}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardCompact: {},
  unreadBar: {
    height: 3,
    width: '100%',
  },
  body: { padding: 16 },
  bodyCompact: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipLabel: { fontSize: 11 },
  date: { fontSize: 11 },
  title: { fontSize: 15, marginBottom: 8 },
  body2: { fontSize: 14, lineHeight: 21 },
});
