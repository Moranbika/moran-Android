# Moran for Android

Moran is a lightweight CET-6 study app for Android. It combines daily
vocabulary review, listening practice, reading exercises, timed mock exams,
and local learning progress in one interface.

## Features

- Spaced-repetition vocabulary review and word books
- CET-4/CET-6 listening exercises with adjustable playback speed
- Reading, translation, and writing practice with local checks
- Timed mock exams and progress history
- Local accounts: account data and learning progress stay on the device
- Responsive layouts for phones and tablets

## Package

- Application ID: `com.moranbika.cet6`
- Version: `1.0.0` (`versionCode 1`)
- Artifact: `Moran-android.apk`

## Build

Install Node.js and the Android SDK, then run:

```bash
npm install
npm run build:mobile
npx cap sync android
cd android
./gradlew assembleDebug
```

The debug APK is generated at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Distribution

The APK attached to the GitHub Release is a debug-signed build for direct
installation and testing. Production distribution requires a private release
keystore and an Android App Bundle or release APK signed with that key.

## Privacy

The Android build uses a local account. It does not upload the phone number,
password digest, or learning progress to a developer-operated account server.
Online pronunciation and some listening audio use third-party services.
