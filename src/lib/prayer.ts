import {
  addDays,
  format,
  getDay,
  isSameDay,
  startOfDay,
  subMinutes,
} from "date-fns";
import { CalculationMethod, Coordinates as AdhanCoordinates, PrayerTimes } from "adhan";

import type {
  CalculationMethodKey,
  Coordinates,
  NextAwakening,
  Preferences,
  PrayerDay,
} from "@/types";

const calculationMethodMap: Record<CalculationMethodKey, () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>> = {
  MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
  Egyptian: () => CalculationMethod.Egyptian(),
  Karachi: () => CalculationMethod.Karachi(),
  UmmAlQura: () => CalculationMethod.UmmAlQura(),
  Dubai: () => CalculationMethod.Dubai(),
  MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
  NorthAmerica: () => CalculationMethod.NorthAmerica(),
  Kuwait: () => CalculationMethod.Kuwait(),
  Qatar: () => CalculationMethod.Qatar(),
  Singapore: () => CalculationMethod.Singapore(),
  Tehran: () => CalculationMethod.Tehran(),
  Turkey: () => CalculationMethod.Turkey(),
};

function getParams(calculationMethod: CalculationMethodKey) {
  return calculationMethodMap[calculationMethod]();
}

export function buildPrayerDay(
  date: Date,
  coordinates: Coordinates,
  minutesBeforeFajr: number,
  calculationMethod: CalculationMethodKey,
): PrayerDay {
  const prayerTimes = new PrayerTimes(
    new AdhanCoordinates(coordinates.latitude, coordinates.longitude),
    date,
    getParams(calculationMethod),
  );

  const fajr = prayerTimes.fajr;
  const dhuhr = prayerTimes.dhuhr;
  const asr = prayerTimes.asr;
  const maghrib = prayerTimes.maghrib;
  const isha = prayerTimes.isha;

  return {
    date,
    prayers: {
      Fajr: fajr,
      Dhuhr: dhuhr,
      Asr: asr,
      Maghrib: maghrib,
      Isha: isha,
    },
    wakeUpTime: subMinutes(fajr, minutesBeforeFajr),
    dayIndex: getDay(date),
  };
}

function getRelativeLabel(candidate: Date, now: Date) {
  if (isSameDay(candidate, now)) {
    return "Today";
  }

  if (isSameDay(candidate, addDays(now, 1))) {
    return "Tomorrow";
  }

  return format(candidate, "EEEE");
}

export function buildUpcomingAwakenings(
  now: Date,
  coordinates: Coordinates,
  preferences: Preferences,
  count = 7,
) {
  if (!preferences.isEnabled) {
    return [] as NextAwakening[];
  }

  const upcoming: NextAwakening[] = [];
  const baseDate = startOfDay(now);

  for (let offset = 0; offset < 21 && upcoming.length < count; offset += 1) {
    const candidateDate = addDays(baseDate, offset);
    const candidateDay = buildPrayerDay(
      candidateDate,
      coordinates,
      preferences.minutesBeforeFajr,
      preferences.calculationMethod,
    );

    if (!preferences.activeDays.includes(candidateDay.dayIndex)) {
      continue;
    }

    if (candidateDay.wakeUpTime <= now) {
      continue;
    }

    upcoming.push({
      ...candidateDay,
      label: getRelativeLabel(candidateDate, now),
      fajrLabel: `Fajr ${getRelativeLabel(candidateDate, now)}`,
    });
  }

  return upcoming;
}
