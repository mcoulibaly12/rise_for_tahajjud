import { MotiView } from "moti";
import { Settings2 } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";

type HeaderProps = {
  onOpenSettings: () => void;
};

export function Header({ onOpenSettings }: HeaderProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 650 }}
      style={styles.row}
    >
      <View>
        <Text style={styles.title}>Rise</Text>
        <Text style={styles.subtitle}>FOR TAHAJJUD</Text>
      </View>

      <Pressable onPress={onOpenSettings} style={styles.button}>
        <Settings2 color={colors.textPrimary} size={18} strokeWidth={1.8} />
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.primaryGold,
    fontFamily: fonts.heading,
    fontSize: 28,
    fontStyle: "italic",
  },
  subtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 3.2,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

