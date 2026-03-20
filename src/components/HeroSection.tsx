import { format } from "date-fns";
import { MotiView } from "moti";
import { AlarmClock, MapPin, MoonStar } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";
import { GlassCard } from "@/components/GlassCard";
import type { NextAwakening } from "@/types";

type HeroSectionProps = {
  nextAwakening: NextAwakening | null;
  countdownLabel: string;
  locationLabel: string;
};

export function HeroSection({
  nextAwakening,
  countdownLabel,
  locationLabel,
}: HeroSectionProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 700, delay: 80 }}
    >
      <GlassCard style={styles.card}>
        <View style={styles.stack}>
          <View style={styles.badge}>
            <MoonStar size={15} color={colors.primaryGold} strokeWidth={1.8} />
            <Text style={styles.badgeText}>
              Next Awakening {nextAwakening ? `• ${nextAwakening.label}` : ""}
            </Text>
          </View>

          <View>
            <Text style={styles.timeValue}>
              {nextAwakening ? format(nextAwakening.wakeUpTime, "h:mm a") : "--:--"}
            </Text>
            <Text style={styles.countdown}>{countdownLabel}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <AlarmClock size={14} color={colors.textMuted} strokeWidth={1.8} />
              <Text style={styles.metaText}>
                {nextAwakening
                  ? `${nextAwakening.fajrLabel} • ${format(nextAwakening.prayers.Fajr, "h:mm a")}`
                  : "Awaiting location to calculate"}
              </Text>
            </View>

            <View style={styles.metaPill}>
              <MapPin size={14} color={colors.textMuted} strokeWidth={1.8} />
              <Text numberOfLines={1} style={styles.metaText}>
                {locationLabel}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 8,
    borderRadius: 30,
  },
  stack: {
    gap: 20,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(212, 175, 55, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.22)",
  },
  badgeText: {
    color: colors.textPrimary,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  timeValue: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 60,
    lineHeight: 68,
    letterSpacing: -2,
    textShadowColor: colors.shadowGold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  countdown: {
    marginTop: 8,
    color: colors.primaryGold,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
  },
  metaRow: {
    gap: 12,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
});

