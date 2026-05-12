import { format } from "date-fns";
import { Minus, Plus } from "lucide-react-native";
import { MotiView } from "moti";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { colors, fonts } from "@/constants/theme";
import type { NextAwakening } from "@/types";

type QuickStatsProps = {
  nextAwakening: NextAwakening | null;
  minutesBeforeFajr: number;
  onAdjustOffset: (delta: number) => void;
};

const GRID_GAP = 12;
const COMPACT_CARD_WIDTH = 176;

export function QuickStats({
  nextAwakening,
  minutesBeforeFajr,
  onAdjustOffset,
}: QuickStatsProps) {
  const { width } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const availableWidth = gridWidth ?? width;
  const cardWidth = (availableWidth - GRID_GAP) / 2;
  const isCompact = cardWidth <= COMPACT_CARD_WIDTH;

  return (
    <View
      style={styles.grid}
      onLayout={(event) => {
        setGridWidth(event.nativeEvent.layout.width);
      }}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 140 }}
        style={styles.column}
      >
        <GlassCard style={styles.statCard} compact={isCompact}>
          <Text numberOfLines={2} style={styles.label}>
            {nextAwakening?.fajrLabel ?? "Fajr"}
          </Text>
          <Text style={[styles.value, isCompact && styles.valueCompact]}>
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
        {isCompact ? (
          <GlassCard style={styles.statCard} compact layout="stacked">
            <View style={styles.offsetCompactContent}>
              <Text numberOfLines={1} style={styles.label}>
                Offset
              </Text>
              <Text style={[styles.value, styles.valueCompact]}>{minutesBeforeFajr}m</Text>
            </View>
            <View style={styles.adjusters}>
              <Pressable onPress={() => onAdjustOffset(-1)} style={[styles.iconButton, styles.iconButtonCompact]}>
                <Minus color={colors.textPrimary} size={16} strokeWidth={1.8} />
              </Pressable>
              <Pressable onPress={() => onAdjustOffset(1)} style={[styles.iconButton, styles.iconButtonCompact]}>
                <Plus color={colors.textPrimary} size={16} strokeWidth={1.8} />
              </Pressable>
            </View>
          </GlassCard>
        ) : (
          <GlassCard
            style={styles.statCard}
            rightSlot={
              <View style={styles.adjustersInline}>
                <Pressable onPress={() => onAdjustOffset(-1)} style={styles.iconButton}>
                  <Minus color={colors.textPrimary} size={16} strokeWidth={1.8} />
                </Pressable>
                <Pressable onPress={() => onAdjustOffset(1)} style={styles.iconButton}>
                  <Plus color={colors.textPrimary} size={16} strokeWidth={1.8} />
                </Pressable>
              </View>
            }
          >
            <Text numberOfLines={1} style={styles.label}>
              Offset
            </Text>
            <Text style={styles.value}>{minutesBeforeFajr}m</Text>
          </GlassCard>
        )}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: GRID_GAP,
  },
  column: {
    flex: 1,
  },
  statCard: {
    flex: 1,
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
  valueCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  offsetCompactContent: {
    gap: 8,
  },
  adjusters: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 6,
    width: "100%",
  },
  adjustersInline: {
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
  iconButtonCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
