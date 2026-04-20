# Firebase Analytics Setup

This app now includes Firebase Analytics instrumentation, but the Firebase app
configuration files are not checked into the repository.

Add the following files before making production builds:

- Android: `android/app/google-services.json`
- iOS: `ios/RiseforTahajjud/GoogleService-Info.plist`

Register the Firebase apps with these bundle/package identifiers:

- iOS: `com.isiTech.risefortahajjud`
- Android: `com.risefortahajjud.app`

Notes:

- Android currently builds with `com.risefortahajjud.app`, which does not match
  the `app.json` Android package value. Firebase must use the native Android
  application ID until that package-name mismatch is migrated.
- The Android Gradle config applies the Google Services plugin only when
  `android/app/google-services.json` exists, so local builds can still succeed
  before Firebase is configured.
- After adding `GoogleService-Info.plist`, confirm it is included in the
  `RiseforTahajjud` Xcode target, then run `pod install` in `ios/`.
