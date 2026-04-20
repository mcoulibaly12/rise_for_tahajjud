import { format } from "date-fns";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants';

import type { NextAwakening } from "@/types";
import type { AnalyticsPermissionStatus } from "@/lib/analytics";

const NOTIFICATION_CHANNEL_ID = "tahajjud-awakening";
const NOTIFICATION_SOUND = "adhan.wav";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function mapPermissionStatus(status: Notifications.PermissionStatus): AnalyticsPermissionStatus {
  switch (status) {
    case Notifications.PermissionStatus.GRANTED:
      return "granted";
    case Notifications.PermissionStatus.DENIED:
      return "denied";
    default:
      return "undetermined";
  }
}

export async function prepareNotifications() {
  const existingPermissions = await Notifications.getPermissionsAsync();
  const permissions =
    existingPermissions.granted
      ? existingPermissions
      : await Notifications.requestPermissionsAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: "Tahajjud Awakening",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 200, 250],
      lightColor: "#D4AF37",
      sound: NOTIFICATION_SOUND,
    });
  } else if (Platform.OS === "ios") {
    // iOS notification setup
    await Notifications.setNotificationCategoryAsync(NOTIFICATION_CHANNEL_ID, []);
  }

  // Get and log push token for testing
  try {
    const pushToken = permissions.granted ? await getExpoPushToken() : null;
    console.log("Expo Push Token:", pushToken);
    return {
      permissionStatus: mapPermissionStatus(permissions.status),
      pushToken,
    };
  } catch (error) {
    console.error("Failed to get push token:", error);
    return {
      permissionStatus: mapPermissionStatus(permissions.status),
      pushToken: null,
    };
  }
}

export async function getExpoPushToken(): Promise<string> {
  // For development, you can hardcode your project ID here
  // Get it from: https://expo.dev/accounts/[account]/projects/[project]/settings
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId ??
    "b594b3b2-1b65-4748-9cea-144a2d1be81b";

  if (!projectId) {
    console.warn("⚠️  No valid Expo project ID found. Push notifications may not work.");
    console.warn("📝 To fix this:");
    console.warn("   1. Go to https://expo.dev and find your project");
    console.warn("   2. Copy the Project ID from Settings");
    console.warn("   3. Add it to app.json under: expo.extra.eas.projectId");
    throw new Error("Expo Push Notifications require a valid project ID.");
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return pushTokenString;
  } catch (e: unknown) {
    throw new Error(`Failed to get Expo push token: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function syncScheduledNotifications(awakenings: NextAwakening[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const awakening of awakenings) {
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: awakening.wakeUpTime,
    };

    // Android-specific: add channel ID
    if (Platform.OS === "android") {
      (trigger as any).channelId = NOTIFICATION_CHANNEL_ID;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rise for Tahajjud",
        body: `Awaken now. Fajr is at ${format(awakening.prayers.Fajr, "h:mm a")}.`,
        sound: NOTIFICATION_SOUND,
        data: {
          wakeUpIso: awakening.wakeUpTime.toISOString(),
        },
      },
      trigger,
    });
  }
}
