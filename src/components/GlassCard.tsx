import { BlurView } from "expo-blur";
import type { PropsWithChildren, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "@/constants/theme";

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  rightSlot?: ReactNode;
  layout?: "horizontal" | "stacked";
  compact?: boolean;
}>;

export function GlassCard({
  children,
  style,
  rightSlot,
  layout = "horizontal",
  compact = false,
}: GlassCardProps) {
  const stacked = layout === "stacked";

  return (
    <BlurView intensity={24} tint="dark" style={[styles.shell, style]}>
      <View
        style={[
          styles.inner,
          stacked ? styles.innerStacked : styles.innerHorizontal,
          compact && styles.innerCompact,
          compact && stacked && styles.innerCompactStacked,
        ]}
      >
        <View style={styles.content}>{children}</View>
        {rightSlot ? <View style={stacked ? styles.slotStacked : undefined}>{rightSlot}</View> : null}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  inner: {
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  innerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerStacked: {
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  innerCompact: {
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  innerCompactStacked: {
    gap: 10,
  },
  content: {
    flex: 1,
  },
  slotStacked: {
    alignSelf: "stretch",
  },
});
