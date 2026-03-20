import { format } from "date-fns";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import type { NextAwakening } from "@/types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function prepareNotifications() {
  const permissions = await Notifications.getPermissionsAsync();

  if (!permissions.granted) {
    await Notifications.requestPermissionsAsync();
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("tahajjud-awakening", {
      name: "Tahajjud Awakening",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 200, 250],
      lightColor: "#D4AF37",
      sound: "default",
    });
  }
}

export async function syncScheduledNotifications(awakenings: NextAwakening[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const awakening of awakenings) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rise for Tahajjud",
        body: `Awaken now. Fajr is at ${format(awakening.prayers.Fajr, "h:mm a")}.`,
        sound: "default",
        data: {
          wakeUpIso: awakening.wakeUpTime.toISOString(),
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        channelId: "tahajjud-awakening",
        date: awakening.wakeUpTime,
      },
    });
  }
}
