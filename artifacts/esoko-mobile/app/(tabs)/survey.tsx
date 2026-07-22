import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const CROPS = ['Maize', 'Cassava', 'Rice', 'Tomatoes', 'Yam', 'Cocoa', 'Groundnuts', 'Soybean', 'Plantain', 'Other'];
const HEALTH = ['Excellent', 'Good', 'Fair', 'Poor', 'Diseased'];
const IRRIGATION = ['Rainfed', 'Drip Irrigation', 'Sprinkler', 'Flood Irrigation', 'None'];

function SelectOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: selected ? colors.primary : colors.muted,
          borderColor: selected ? colors.primary : colors.border,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.optionText,
        { color: selected ? '#fff' : colors.foreground, fontFamily: 'Inter_500Medium' }
      ]}>
        {label}
      </Text>
      {selected && <Feather name="check" size={13} color="#fff" />}
    </TouchableOpacity>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.toggleRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={() => onChange(!value)}
    >
      <Text style={[styles.toggleLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>{label}</Text>
      <View style={[styles.toggle, { backgroundColor: value ? colors.primary : colors.border }]}>
        <View style={[styles.toggleThumb, { transform: [{ translateX: value ? 18 : 2 }] }]} />
      </View>
    </TouchableOpacity>
  );
}

type FormData = {
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
};

const INITIAL: FormData = {
  farmName: '',
  location: '',
  latitude: undefined,
  longitude: undefined,
  sizeAcres: '',
  mainCrop: '',
  cropHealth: '',
  irrigationMethod: '',
  usesFertilizer: false,
  estimatedYieldBags: '',
  notes: '',
};

export default function SurveyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { submitSurvey, surveys } = useApp();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locationFetching, setLocationFetching] = useState(false);
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const set = (key: keyof FormData) => (val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }));

  const captureLocation = async () => {
    setLocationFetching(true);
    try {
      let permission = locationPermission;
      if (!permission?.granted) {
        const result = await requestLocationPermission();
        permission = result;
      }
      if (!permission?.granted) {
        if (!permission?.canAskAgain && Platform.OS !== 'web') {
          Alert.alert(
            'Location Permission Required',
            'Please enable location access in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => { try { Linking.openSettings(); } catch (_) {} } },
            ]
          );
        }
        return;
      }
      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = coords.coords;

      // Attempt reverse geocode for a human-readable district name
      let locationLabel = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          const parts = [place.district || place.subregion || place.city, place.region, place.country]
            .filter(Boolean);
          if (parts.length > 0) locationLabel = parts.join(', ');
        }
      } catch (_) {
        // Fall back to raw coordinates — already set above
      }

      setForm(f => ({ ...f, location: locationLabel, latitude, longitude }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      Alert.alert('Location Error', 'Could not retrieve your location. Please try again or enter it manually.');
    } finally {
      setLocationFetching(false);
    }
  };

  const isValid = form.farmName.trim() && form.location.trim() && form.mainCrop && form.cropHealth;

  const handleSubmit = async () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);
    try {
      await submitSurvey(form);
      setSubmitted(true);
      setForm(INITIAL);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Error', 'Could not save survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.successContainer, { paddingTop: topPadding }]}>
          <View style={[styles.successIcon, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            Survey Submitted
          </Text>
          <Text style={[styles.successBody, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Thank you. Your field data has been saved and will help improve agricultural advisories across your region.
          </Text>
          <Text style={[styles.successCount, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Total surveys submitted: {surveys.length}
          </Text>
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={() => setSubmitted(false)}
          >
            <Text style={[styles.submitText, { fontFamily: 'PlusJakartaSans_700Bold' }]}>Submit Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPadding + 16, paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'PlusJakartaSans_700Bold' }]}>
            Field Survey
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Crop assessment · Q3 2026
          </Text>
          {surveys.length > 0 && (
            <View style={[styles.prevBadge, { backgroundColor: colors.secondary + '22' }]}>
              <Feather name="clipboard" size={13} color={colors.secondary} />
              <Text style={[styles.prevText, { color: colors.secondary, fontFamily: 'Inter_500Medium' }]}>
                {surveys.length} previous {surveys.length === 1 ? 'submission' : 'submissions'}
              </Text>
            </View>
          )}
        </View>

        {/* Farm Name */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Farm Name</Text>
          <TextInput
            value={form.farmName}
            onChangeText={set('farmName')}
            placeholder="e.g. Mensah Farm Block A"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Location / District</Text>
          <TextInput
            value={form.location}
            onChangeText={val => setForm(f => ({ ...f, location: val, latitude: undefined, longitude: undefined }))}
            placeholder="e.g. Ejura-Sekyedumase District"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
          <TouchableOpacity
            style={[
              styles.gpsBtn,
              {
                backgroundColor: locationFetching ? colors.muted : colors.primary + '18',
                borderColor: colors.primary + '44',
              },
            ]}
            onPress={captureLocation}
            disabled={locationFetching}
          >
            {locationFetching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="location-sharp" size={15} color={colors.primary} />
            )}
            <Text style={[styles.gpsBtnText, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
              {locationFetching ? 'Getting location…' : 'Use my location'}
            </Text>
          </TouchableOpacity>
          {form.latitude != null && form.longitude != null && (
            <View style={[styles.gpsConfirm, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
              <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              <Text style={[styles.gpsConfirmText, { color: colors.primary, fontFamily: 'Inter_400Regular' }]}>
                GPS: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
              </Text>
            </View>
          )}
        </View>

        {/* Farm Size */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Farm Size (acres)</Text>
          <TextInput
            value={form.sizeAcres}
            onChangeText={set('sizeAcres')}
            placeholder="e.g. 3.5"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="decimal-pad"
            style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
        </View>

        {/* Main Crop */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Main Crop</Text>
          <View style={styles.options}>
            {CROPS.map(c => (
              <SelectOption key={c} label={c} selected={form.mainCrop === c} onPress={() => set('mainCrop')(c)} />
            ))}
          </View>
        </View>

        {/* Crop Health */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Crop Health</Text>
          <View style={styles.options}>
            {HEALTH.map(h => (
              <SelectOption key={h} label={h} selected={form.cropHealth === h} onPress={() => set('cropHealth')(h)} />
            ))}
          </View>
        </View>

        {/* Irrigation */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Irrigation Method</Text>
          <View style={styles.options}>
            {IRRIGATION.map(i => (
              <SelectOption key={i} label={i} selected={form.irrigationMethod === i} onPress={() => set('irrigationMethod')(i)} />
            ))}
          </View>
        </View>

        {/* Fertilizer Toggle */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Inputs & Practices</Text>
          <ToggleRow
            label="Uses Fertilizer"
            value={form.usesFertilizer}
            onChange={v => set('usesFertilizer')(v)}
          />
        </View>

        {/* Estimated Yield */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Estimated Yield (bags)</Text>
          <TextInput
            value={form.estimatedYieldBags}
            onChangeText={set('estimatedYieldBags')}
            placeholder="e.g. 20"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Additional Notes</Text>
          <TextInput
            value={form.notes}
            onChangeText={set('notes')}
            placeholder="Any observations about your farm..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            style={[styles.textArea, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: isValid ? colors.primary : colors.border }]}
          onPress={handleSubmit}
          disabled={!isValid || submitting}
        >
          {submitting ? (
            <Text style={[styles.submitText, { fontFamily: 'PlusJakartaSans_700Bold' }]}>Submitting...</Text>
          ) : (
            <>
              <Feather name="send" size={16} color="#fff" />
              <Text style={[styles.submitText, { fontFamily: 'PlusJakartaSans_700Bold' }]}>Submit Survey</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  headerBlock: { marginBottom: 24 },
  title: { fontSize: 28, marginBottom: 2 },
  subtitle: { fontSize: 13, marginBottom: 12 },
  prevBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  prevText: { fontSize: 12 },
  field: { marginBottom: 22 },
  label: { fontSize: 14, marginBottom: 10 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionText: { fontSize: 13 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLabel: { fontSize: 15 },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  gpsBtnText: { fontSize: 13 },
  gpsConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  gpsConfirmText: { fontSize: 12 },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitText: { color: '#fff', fontSize: 16 },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 24, textAlign: 'center' },
  successBody: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  successCount: { fontSize: 13 },
});
