import type { CalculationMethodKey } from "@/types";

export const colors = {
  night: "#050508",
  indigo: "#1E1B4B",
  goldGlow: "#422006",
  primaryGold: "#D4AF37",
  secondaryGold: "#C5A028",
  textPrimary: "#E2E8F0",
  textMuted: "#94A3B8",
  glass: "rgba(255, 255, 255, 0.05)",
  glassStrong: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.10)",
  shadowGold: "rgba(212, 175, 55, 0.25)",
  success: "#EAB308",
};

export const fonts = {
  heading: "PlayfairDisplay_600SemiBold_Italic",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
  mono: "JetBrainsMono_500Medium",
};

export const dayLabels = [
  { value: 0, short: "Su", full: "Sunday" },
  { value: 1, short: "Mo", full: "Monday" },
  { value: 2, short: "Tu", full: "Tuesday" },
  { value: 3, short: "We", full: "Wednesday" },
  { value: 4, short: "Th", full: "Thursday" },
  { value: 5, short: "Fr", full: "Friday" },
  { value: 6, short: "Sa", full: "Saturday" },
];

export const calculationMethodOptions: Array<{
  value: CalculationMethodKey;
  label: string;
}> = [
  { value: "MuslimWorldLeague", label: "Muslim World League" },
  { value: "Egyptian", label: "Egyptian" },
  { value: "Karachi", label: "Karachi" },
  { value: "UmmAlQura", label: "Umm al-Qura" },
  { value: "Dubai", label: "Dubai" },
  { value: "MoonsightingCommittee", label: "Moonsighting Committee" },
  { value: "NorthAmerica", label: "North America (ISNA)" },
  { value: "Kuwait", label: "Kuwait" },
  { value: "Qatar", label: "Qatar" },
  { value: "Singapore", label: "Singapore" },
  { value: "Tehran", label: "Tehran" },
  { value: "Turkey", label: "Turkey" },
];
