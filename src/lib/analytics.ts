import {
  getAnalytics,
  logEvent as logAnalyticsEvent,
  setAnalyticsCollectionEnabled,
} from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";
import { NativeModules, Platform } from "react-native";

export type AnalyticsPermissionKind = "location" | "notifications";
export type AnalyticsPermissionStatus = "granted" | "denied" | "undetermined";
export type AnalyticsSettingsField =
  | "active_days"
  | "calculation_method"
  | "is_enabled"
  | "minutes_before_fajr";

type AnalyticsInstance = {
  logEvent: (name: string, params?: Record<string, string | number>) => Promise<void>;
  enableCollection: () => Promise<void>;
};

let analyticsInstancePromise: Promise<AnalyticsInstance | null> | null = null;
let warnedUnavailable = false;

function warnUnavailable(reason: string) {
  if (warnedUnavailable) {
    return;
  }

  warnedUnavailable = true;
  console.warn(`[analytics] Firebase Analytics unavailable: ${reason}`);
}

async function loadAnalyticsInstance(): Promise<AnalyticsInstance | null> {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    if (!NativeModules.RNFBAppModule) {
      warnUnavailable("RNFBAppModule native module is missing");
      return null;
    }

    if (!NativeModules.RNFBAnalyticsModule) {
      warnUnavailable("RNFBAnalyticsModule native module is missing");
      return null;
    }

    const app = getApp();
    const analytics = getAnalytics(app);

    return {
      logEvent: (name, params) => logAnalyticsEvent(analytics, name, params),
      enableCollection: () => setAnalyticsCollectionEnabled(analytics, true),
    };
  } catch (error) {
    warnUnavailable(error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function getAnalyticsInstance() {
  if (!analyticsInstancePromise) {
    analyticsInstancePromise = loadAnalyticsInstance();
  }

  return analyticsInstancePromise;
}

async function withAnalytics(
  action: (instance: AnalyticsInstance) => Promise<void>,
) {
  const instance = await getAnalyticsInstance();

  if (!instance) {
    return;
  }

  try {
    await action(instance);
  } catch (error) {
    warnUnavailable(error instanceof Error ? error.message : String(error));
  }
}

export async function initializeAnalytics() {
  await withAnalytics((instance) => instance.enableCollection());
}

export async function trackAppOpened() {
  await withAnalytics((instance) => instance.logEvent("app_opened"));
}

export async function trackPermissionResult(
  kind: AnalyticsPermissionKind,
  status: AnalyticsPermissionStatus,
) {
  await withAnalytics((instance) =>
    instance.logEvent("permission_result", {
      permission_kind: kind,
      permission_status: status,
    }),
  );
}

export async function trackSettingsChanged(changedFields: AnalyticsSettingsField[]) {
  if (changedFields.length === 0) {
    return;
  }

  const uniqueChangedFields = [...new Set(changedFields)].sort();
  console.log("[analytics] settings_changed", {
    changed_fields: uniqueChangedFields.join(","),
    changed_field_count: uniqueChangedFields.length,
  });

  await withAnalytics((instance) =>
    instance.logEvent("settings_changed", {
      changed_fields: uniqueChangedFields.join(","),
      changed_field_count: uniqueChangedFields.length,
    }),
  );
}
