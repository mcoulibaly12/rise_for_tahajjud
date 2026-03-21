import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { PlayfairDisplay_600SemiBold_Italic } from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { BellRing } from "lucide-react-native";
import { useEffect, useState } from "react";
import { startOfDay } from "date-fns";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PrayerList } from "@/components/PrayerList";
import { QuickStats } from "@/components/QuickStats";
import { SettingsModal } from "@/components/SettingsModal";
import { colors, fonts } from "@/constants/theme";
import { syncScheduledNotifications, prepareNotifications } from "@/lib/notifications";
import { buildPrayerDay, buildUpcomingAwakenings } from "@/lib/prayer";
import { defaultPreferences, loadPreferences, savePreferences } from "@/lib/storage";
import type { Coordinates, Preferences } from "@/types";

function formatCountdown(target: Date | null, now: Date) {
  if (!target) {
    return "Awaiting calculation";
  }

  const distance = Math.max(target.getTime() - now.getTime(), 0);
  const hours = Math.floor(distance / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  const seconds = Math.floor((distance % 60_000) / 1_000);

  return `${hours}h ${minutes}m ${seconds}s remaining`;
}

function AppContent() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_500Medium,
    PlayfairDisplay_600SemiBold_Italic,
  });
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationLabel, setLocationLabel] = useState("Locating your horizon");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => new Date());



  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const stored = await loadPreferences();

      if (mounted) {
        setPreferences(stored);
        setHasLoadedPreferences(true);
      }

      await prepareNotifications();
      await refreshLocation();
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPreferences) {
      return;
    }

    savePreferences(preferences).catch(() => undefined);
  }, [hasLoadedPreferences, preferences]);

  async function refreshLocation() {
    setLocationError(null);
    setRefreshing(true);

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setCoordinates(null);
      setLocationLabel("Location access denied");
      setLocationError("Allow location access to calculate local Fajr accurately.");
      setRefreshing(false);
      return;
    }

    const currentPosition = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const nextCoordinates = {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    };

    setCoordinates(nextCoordinates);
    setRefreshing(false);

    try {
      const places = await Location.reverseGeocodeAsync(nextCoordinates);
      const place = places[0];
      const label = [place?.city, place?.region].filter(Boolean).join(", ");
      setLocationLabel(label || "Current location");
    } catch {
      setLocationLabel("Current location");
    }
  }

  const todayPrayerDay = coordinates
    ? buildPrayerDay(startOfDay(now), coordinates, preferences.minutesBeforeFajr)
    : null;
  const upcomingAwakenings = coordinates
    ? buildUpcomingAwakenings(now, coordinates, preferences)
    : [];
  const nextAwakening = upcomingAwakenings[0] ?? null;
  const countdownLabel = formatCountdown(nextAwakening?.wakeUpTime ?? null, now);

  useEffect(() => {
    if (!coordinates || !preferences.isEnabled) {
      syncScheduledNotifications([]).catch(() => undefined);
      return;
    }

    syncScheduledNotifications(upcomingAwakenings).catch(() => undefined);
  }, [
    coordinates,
    preferences.isEnabled,
    preferences.minutesBeforeFajr,
    preferences.activeDays,
  ]);

  async function triggerImpact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(style);
    }
  }

  async function adjustOffset(delta: number) {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    setPreferences((current) => ({
      ...current,
      minutesBeforeFajr: Math.max(10, Math.min(120, current.minutesBeforeFajr + delta)),
    }));
  }

  async function setOffset(value: number) {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    setPreferences((current) => ({
      ...current,
      minutesBeforeFajr: value,
    }));
  }

  async function toggleDay(day: number) {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    setPreferences((current) => {
      const exists = current.activeDays.includes(day);
      const nextDays = exists
        ? current.activeDays.filter((value) => value !== day)
        : [...current.activeDays, day].sort((left, right) => left - right);

      return {
        ...current,
        activeDays: nextDays.length > 0 ? nextDays : current.activeDays,
      };
    });
  }

  async function toggleEnabled() {
    await triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    setPreferences((current) => ({
      ...current,
      isEnabled: !current.isEnabled,
    }));
  }

  if (!fontsLoaded || !hasLoadedPreferences) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar style="light" />
        <ActivityIndicator color={colors.primaryGold} size="small" />
        <Text style={styles.loadingText}>Preparing the night watch…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.root}>
        <LinearGradient
          colors={["rgba(30, 27, 75, 0.65)", "transparent"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.6, y: 0.45 }}
          style={styles.topGlow}
        />
        <LinearGradient
          colors={["rgba(66, 32, 6, 0.42)", "transparent"]}
          start={{ x: 0.8, y: 0.2 }}
          end={{ x: 0.3, y: 0.8 }}
          style={styles.bottomGlow}
        />

        <ScrollView
          bounces={true}
          alwaysBounceVertical={true}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshLocation} />}
        >
          <Header onOpenSettings={() => setSettingsVisible(true)} />

          <HeroSection
            nextAwakening={nextAwakening}
            countdownLabel={countdownLabel}
            locationLabel={locationLabel}
          />

          <QuickStats
            nextAwakening={nextAwakening}
            minutesBeforeFajr={preferences.minutesBeforeFajr}
            onAdjustOffset={adjustOffset}
          />

          {locationError ? (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 650, delay: 180 }}
              style={styles.locationCard}
            >
              <Text style={styles.locationErrorTitle}>Location needed</Text>
              <Text style={styles.locationErrorBody}>{locationError}</Text>
              <Pressable onPress={refreshLocation} style={styles.locationButton}>
                <Text style={styles.locationButtonText}>Try again</Text>
              </Pressable>
            </MotiView>
          ) : null}

          <PrayerList prayerDay={todayPrayerDay} />

          <View style={styles.footerSpace} />
        </ScrollView>

        <Pressable
          onPress={toggleEnabled}
          style={[
            styles.actionBar,
            preferences.isEnabled ? styles.actionBarActive : styles.actionBarInactive,
          ]}
        >
          <BellRing
            size={18}
            strokeWidth={1.9}
            color={preferences.isEnabled ? colors.night : colors.textMuted}
          />
          <Text
            style={[
              styles.actionText,
              preferences.isEnabled ? styles.actionTextActive : styles.actionTextInactive,
            ]}
          >
            {preferences.isEnabled ? "Tahajjud alarm is active" : "Enable Tahajjud alarm"}
          </Text>
        </Pressable>

        <SettingsModal
          visible={settingsVisible}
          preferences={preferences}
          onClose={() => setSettingsVisible(false)}
          onOffsetChange={setOffset}
          onToggleDay={toggleDay}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.night,
  },
  root: {
    flex: 1,
    backgroundColor: colors.night,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 126,
    gap: 18,
  },
  topGlow: {
    position: "absolute",
    top: -120,
    left: -90,
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  bottomGlow: {
    position: "absolute",
    right: -120,
    bottom: 80,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.night,
    gap: 14,
  },
  loadingText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  locationCard: {
    borderRadius: 24,
    backgroundColor: "rgba(148, 163, 184, 0.08)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 18,
    gap: 10,
  },
  locationErrorTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  locationErrorBody: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  locationButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  locationButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  footerSpace: {
    height: 20,
  },
  actionBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    minHeight: 62,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
  },
  actionBarActive: {
    backgroundColor: colors.primaryGold,
    borderColor: colors.primaryGold,
    shadowColor: colors.primaryGold,
    shadowOpacity: 0.38,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  actionBarInactive: {
    backgroundColor: colors.glassStrong,
    borderColor: colors.glassBorder,
  },
  actionText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  actionTextActive: {
    color: colors.night,
  },
  actionTextInactive: {
    color: colors.textMuted,
  },
});
