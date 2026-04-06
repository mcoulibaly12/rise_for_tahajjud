import AsyncStorage from "@react-native-async-storage/async-storage";

import { calculationMethodOptions } from "@/constants/theme";
import type { Preferences } from "@/types";

const STORAGE_KEY = "rise-for-tahajjud:preferences";
const validCalculationMethods = new Set(
  calculationMethodOptions.map((option) => option.value),
);

export const defaultPreferences: Preferences = {
  minutesBeforeFajr: 35,
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  isEnabled: true,
  calculationMethod: "MuslimWorldLeague",
};

export async function loadPreferences() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return defaultPreferences;
    }

    const parsed = JSON.parse(stored) as Partial<Preferences>;

    return {
      minutesBeforeFajr:
        typeof parsed.minutesBeforeFajr === "number"
          ? parsed.minutesBeforeFajr
          : defaultPreferences.minutesBeforeFajr,
      activeDays:
        Array.isArray(parsed.activeDays) && parsed.activeDays.length > 0
          ? parsed.activeDays.filter((value): value is number => typeof value === "number")
          : defaultPreferences.activeDays,
      isEnabled:
        typeof parsed.isEnabled === "boolean"
          ? parsed.isEnabled
          : defaultPreferences.isEnabled,
      calculationMethod:
        typeof parsed.calculationMethod === "string" &&
        validCalculationMethods.has(parsed.calculationMethod as Preferences["calculationMethod"])
          ? (parsed.calculationMethod as Preferences["calculationMethod"])
          : defaultPreferences.calculationMethod,
    };
  } catch {
    return defaultPreferences;
  }
}

export async function savePreferences(preferences: Preferences) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
