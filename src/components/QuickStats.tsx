import { format } from "date-fns";
import { Minus, Plus } from "lucide-react-native";
import { MotiView } from "moti";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { colors, fonts } from "@/constants/theme";
import type { NextAwakening } from "@/types";

type QuickStatsProps = {
  nextAwakening: NextAwakening | null;
  minutesBeforeFajr: number;
  onAdjustOffset: (delta: number) => void;
};

export function QuickStats({
  nextAwakening,
  minutesBeforeFajr,
  onAdjustOffset,
}: QuickStatsProps) {
  return (
    <View style={styles.grid}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 140 }}
        style={styles.column}
      >
        <GlassCard style={styles.statCard}>
          <Text style={styles.label}>{nextAwakening?.fajrLabel ?? "Fajr"}</Text>
          <Text style={styles.value}>
            {nextAwakening ? format(nextAwakening.prayers.Fajr, "h:mm a") : "--:--"}
          </Text>
        </GlassCard>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 220 }}
        style={styles.column}
      >
        <GlassCard
          style={styles.statCard}
          rightSlot={
            <View style={styles.adjusters}>
              <Pressable onPress={() => onAdjustOffset(-1)} style={styles.iconButton}>
                <Minus color={colors.textPrimary} size={16} strokeWidth={1.8} />
              </Pressable>
              <Pressable onPress={() => onAdjustOffset(1)} style={styles.iconButton}>
                <Plus color={colors.textPrimary} size={16} strokeWidth={1.8} />
              </Pressable>
            </View>
          }
        >
          <Text style={styles.label}>Offset</Text>
          <Text style={styles.value}>{minutesBeforeFajr}m</Text>
        </GlassCard>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  statCard: {
    minHeight: 112,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  value: {
    marginTop: 10,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 24,
  },
  adjusters: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

