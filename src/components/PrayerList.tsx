import { format } from "date-fns";
import { Moon, Sun, SunMedium, Sunrise, Sunset } from "lucide-react-native";
import { MotiView } from "moti";
import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { colors, fonts } from "@/constants/theme";
import type { PrayerDay, PrayerName } from "@/types";

const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: SunMedium,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
} satisfies Record<PrayerName, typeof Moon>;

type PrayerListProps = {
  prayerDay: PrayerDay | null;
};

export function PrayerList({ prayerDay }: PrayerListProps) {
  const rows = prayerDay
    ? (Object.entries(prayerDay.prayers) as [PrayerName, Date][])
    : [];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Prayer Times</Text>

      <View style={styles.stack}>
        {rows.map(([name, time], index) => {
          const Icon = prayerIcons[name];

          return (
            <MotiView
              key={name}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 620, delay: 240 + index * 50 }}
            >
              <GlassCard style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.nameGroup}>
                    <View style={styles.iconShell}>
                      <Icon size={16} color={colors.primaryGold} strokeWidth={1.8} />
                    </View>
                    <Text style={styles.name}>{name}</Text>
                  </View>

                  <Text style={styles.time}>{format(time, "h:mm a")}</Text>
                </View>
              </GlassCard>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  heading: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 28,
    fontStyle: "italic",
  },
  stack: {
    gap: 10,
  },
  card: {
    borderRadius: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconShell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212, 175, 55, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.18)",
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  time: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 15,
  },
});

