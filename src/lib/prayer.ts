import {
  addDays,
  format,
  getDay,
  isSameDay,
  startOfDay,
  subMinutes,
} from "date-fns";
import { CalculationMethod, Coordinates as AdhanCoordinates, PrayerTimes } from "adhan";

import type { Coordinates, NextAwakening, Preferences, PrayerDay } from "@/types";

function getParams() {
  return CalculationMethod.MuslimWorldLeague();
}

export function buildPrayerDay(
  date: Date,
  coordinates: Coordinates,
  minutesBeforeFajr: number,
): PrayerDay {
  const prayerTimes = new PrayerTimes(
    new AdhanCoordinates(coordinates.latitude, coordinates.longitude),
    date,
    getParams(),
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

