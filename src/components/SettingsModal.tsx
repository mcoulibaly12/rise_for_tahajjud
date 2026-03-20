import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import { MotiView } from "moti";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, dayLabels, fonts } from "@/constants/theme";
import type { Preferences } from "@/types";

type SettingsModalProps = {
  visible: boolean;
  preferences: Preferences;
  onClose: () => void;
  onOffsetChange: (value: number) => void;
  onToggleDay: (day: number) => void;
};

export function SettingsModal({
  visible,
  preferences,
  onClose,
  onOffsetChange,
  onToggleDay,
}: SettingsModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <BlurView intensity={36} tint="dark" style={styles.backdrop}>
        <MotiView
          from={{ opacity: 0, translateY: 18 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 320 }}
          style={styles.sheet}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Night Settings</Text>
              <Text style={styles.subtitle}>
                Refine the hour of your awakening before Fajr.
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={18} color={colors.textPrimary} strokeWidth={1.8} />
            </Pressable>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockLabel}>Wake up before Fajr</Text>
            <Text style={styles.value}>{preferences.minutesBeforeFajr} minutes</Text>
            <Slider
              minimumValue={10}
              maximumValue={120}
              step={1}
              value={preferences.minutesBeforeFajr}
              onValueChange={onOffsetChange}
              minimumTrackTintColor={colors.primaryGold}
              maximumTrackTintColor="rgba(255,255,255,0.16)"
              thumbTintColor={colors.primaryGold}
            />
          </View>

          <View style={styles.block}>
            <Text style={styles.blockLabel}>Active days</Text>
            <View style={styles.dayGrid}>
              {dayLabels.map((day) => {
                const active = preferences.activeDays.includes(day.value);

                return (
                  <Pressable
                    key={day.value}
                    onPress={() => onToggleDay(day.value)}
                    style={[styles.dayButton, active && styles.dayButtonActive]}
                  >
                    <Text style={[styles.dayText, active && styles.dayTextActive]}>
                      {day.short}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </MotiView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(5, 5, 8, 0.72)",
    padding: 18,
  },
  sheet: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: "rgba(10, 10, 16, 0.88)",
    padding: 22,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 30,
    fontStyle: "italic",
  },
  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  block: {
    gap: 12,
  },
  blockLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  value: {
    color: colors.primaryGold,
    fontFamily: fonts.mono,
    fontSize: 24,
  },
  dayGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  dayButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  dayButtonActive: {
    backgroundColor: colors.primaryGold,
    borderColor: colors.primaryGold,
  },
  dayText: {
    color: colors.textMuted,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  dayTextActive: {
    color: colors.night,
  },
});

