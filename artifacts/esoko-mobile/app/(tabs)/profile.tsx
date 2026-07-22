import React from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp, SmsAlert } from '@/context/AppContext';

const ALERT_TYPE_ICONS: Record<string, { icon: string; color: string }> = {};

function AlertItem({ alert, onRead }: { alert: SmsAlert; onRead: () => void }) {
  const colors = useColors();
  const iconMap: Record<SmsAlert['type'], { icon: any; color: string }> = {
    advisory: { icon: 'leaf', color: colors.primary },
    market: { icon: 'trending-up', color: colors.secondary },
    weather: { icon: 'cloud-rain', color: '#4A90D9' },
    survey: { icon: 'clipboard', color: colors.brand },
    pest: { icon: 'alert-triangle', color: '#E8543A' },
  };
  const iconInfo = iconMap[alert.type] ?? { icon: 'bell', color: colors.mutedForeground };

  return (
    <TouchableOpacity
      style={[
        styles.alertItem,
        { backgroundColor: colors.card, borderColor: alert.read ? colors.cardBorder : colors.primary + '40' }
      ]}
      onPress={onRead}
      activeOpacity={0.7}
    >
      <View style={[styles.alertIcon, { backgroundColor: iconInfo.color + '18' }]}>
        <Feather name={iconInfo.icon} size={16} color={iconInfo.color} />
      </View>
      <View style={styles.alertBody}>
        <Text
          style={[styles.alertMsg, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          numberOfLines={2}
        >
          {alert.message}
        </Text>
        <Text style={[styles.alertTime, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {new Date(alert.timestamp).toLocaleDateString('en-GH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {!alert.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, smsAlerts, unreadAlerts, markAlertRead, updateProfile } = useApp();

  const initials = userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPadding + 16, paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile card */}
      <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
        <View style={styles.avatarRing}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.initials, { fontFamily: 'PlusJakartaSans_700Bold' }]}>{initials}</Text>
          </View>
        </View>
        <Text style={[styles.profileName, { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold' }]}>
          {userProfile.name}
        </Text>
        <Text style={[styles.profileType, { color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' }]}>
          {userProfile.farmerType}
        </Text>
        <View style={styles.profileMeta}>
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={[styles.metaText, { fontFamily: 'Inter_400Regular' }]}>{userProfile.region}</Text>
          </View>
          <View style={styles.metaChip}>
            <Feather name="phone" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={[styles.metaText, { fontFamily: 'Inter_400Regular' }]}>{userProfile.phone}</Text>
          </View>
        </View>
        <Text style={[styles.joinDate, { color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' }]}>
          Member since {userProfile.joinedDate}
        </Text>
      </View>

      {/* SMS Alerts section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            SMS Alerts
          </Text>
          {unreadAlerts > 0 && (
            <View style={[styles.countBadge, { backgroundColor: colors.brand }]}>
              <Text style={[styles.countText, { fontFamily: 'Inter_500Medium' }]}>{unreadAlerts} new</Text>
            </View>
          )}
        </View>

        {smsAlerts.map(alert => (
          <AlertItem key={alert.id} alert={alert} onRead={() => markAlertRead(alert.id)} />
        ))}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold', marginBottom: 12 }]}>
          Notifications
        </Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="notifications" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>SMS Alerts</Text>
                <Text style={[styles.settingDesc, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>Receive SMS on your phone</Text>
              </View>
            </View>
            <Switch
              value={userProfile.alertsEnabled}
              onValueChange={v => updateProfile({ alertsEnabled: v })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary + '22' }]}>
                <MaterialCommunityIcons name="calendar-week" size={16} color={colors.secondary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>Weekly Digest</Text>
                <Text style={[styles.settingDesc, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>Summary every Monday morning</Text>
              </View>
            </View>
            <Switch
              value={userProfile.weeklyDigest}
              onValueChange={v => updateProfile({ weeklyDigest: v })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold', marginBottom: 12 }]}>
          About
        </Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {[
            { icon: 'globe', label: 'Website', value: 'esoko.com' },
            { icon: 'info', label: 'App Version', value: '1.0.0' },
            { icon: 'shield', label: 'Privacy Policy', value: '' },
          ].map((row, idx, arr) => (
            <React.Fragment key={row.label}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
                    <Feather name={row.icon as any} size={16} color={colors.mutedForeground} />
                  </View>
                  <Text style={[styles.settingLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>{row.label}</Text>
                </View>
                {row.value ? (
                  <Text style={[styles.settingValue, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>{row.value}</Text>
                ) : (
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                )}
              </View>
              {idx < arr.length - 1 && <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />}
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
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#1A2B3C', fontSize: 24 },
  profileName: { fontSize: 20, marginBottom: 4 },
  profileType: { fontSize: 13, marginBottom: 12 },
  profileMeta: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  joinDate: { fontSize: 11 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 17 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  countText: { color: '#fff', fontSize: 11 },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  alertIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  alertBody: { flex: 1 },
  alertMsg: { fontSize: 13, lineHeight: 19, marginBottom: 4 },
  alertTime: { fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  settingsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 14 },
  settingDesc: { fontSize: 12, marginTop: 1 },
  settingValue: { fontSize: 13 },
  settingDivider: { height: 1, marginHorizontal: 14 },
});
