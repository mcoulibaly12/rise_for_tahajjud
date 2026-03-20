export type Preferences = {
  minutesBeforeFajr: number;
  activeDays: number[];
  isEnabled: boolean;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerSchedule = Record<PrayerName, Date>;

export type PrayerDay = {
  date: Date;
  prayers: PrayerSchedule;
  wakeUpTime: Date;
  dayIndex: number;
};

export type NextAwakening = PrayerDay & {
  label: string;
  fajrLabel: string;
};

