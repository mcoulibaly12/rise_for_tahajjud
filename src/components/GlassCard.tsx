import { BlurView } from "expo-blur";
import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

type GlassCardProps = PropsWithChildren<{
  style?: object;
  rightSlot?: ReactNode;
}>;

export function GlassCard({ children, style, rightSlot }: GlassCardProps) {
  return (
    <BlurView intensity={24} tint="dark" style={[styles.shell, style]}>
      <View style={styles.inner}>
        <View style={styles.content}>{children}</View>
        {rightSlot ? <View>{rightSlot}</View> : null}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
  },
});

