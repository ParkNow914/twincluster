# Complete APK Build Guide for Football Manager 2026

This guide provides comprehensive instructions for building production-ready APK files for Android.

## Prerequisites

1. **Node.js and npm** installed (v18 or higher recommended)
2. **Expo CLI** installed globally: `npm install -g expo-cli`
3. **EAS CLI** installed globally: `npm install -g eas-cli`
4. **Expo account** created at https://expo.dev

## Build Methods

### Method 1: Using Expo EAS Build (Recommended)

This is the easiest and most reliable method for production APKs.

#### Step 1: Install Dependencies

```bash
cd twincluster
npm install
```

#### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo credentials when prompted.

#### Step 3: Configure EAS Build

The project already has `eas.json` configured. Review it if needed:

```bash
cat eas.json
```

#### Step 4: Build APK

For production APK (signed and optimized):
```bash
eas build --platform android --profile production
```

For preview APK (faster, for testing):
```bash
eas build --platform android --profile preview
```

For AAB (Google Play Store):
```bash
eas build --platform android --profile production-aab
```

#### Step 5: Download APK

After the build completes (takes 10-20 minutes), you'll receive a URL to download your APK. The APK will also be available in your Expo dashboard at https://expo.dev

### Method 2: Local Build with Expo (Alternative)

If you want to build locally without Expo servers:

#### Step 1: Install Android Studio

Download and install Android Studio from https://developer.android.com/studio

#### Step 2: Set up Android SDK

1. Open Android Studio
2. Go to Settings → Appearance & Behavior → System Settings → Android SDK
3. Install Android SDK Platform 34 (or latest)
4. Install Android SDK Build-Tools 34.0.0 (or latest)

#### Step 3: Set Environment Variables

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Reload: `source ~/.bashrc` or `source ~/.zshrc`

#### Step 4: Build Locally

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

The APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## APK Optimization Tips

### 1. Enable Hermes Engine

Already enabled in `app.json`:
```json
"jsEngine": "hermes"
```

### 2. Enable ProGuard (Code Minification)

Create `android/app/proguard-rules.pro`:

```
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
```

### 3. Reduce APK Size

- Remove unused assets
- Optimize images
- Enable split APKs for different architectures

### 4. Performance Optimizations

All performance optimizations are already implemented in the codebase:
- TypeScript compilation
- React Navigation optimized
- AsyncStorage configured
- Hermes engine enabled

## Signing the APK

### For Production Release

1. Generate a keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `eas.json` (already done):
```json
{
  "production": {
    "android": {
      "buildType": "apk"
    }
  }
}
```

3. EAS Build will handle signing automatically.

## Testing the APK

### On Physical Device

1. Enable "Install from Unknown Sources" on your Android device
2. Transfer APK to device
3. Open APK file to install
4. Launch "Football Manager 2026" from app drawer

### On Emulator

1. Start Android emulator from Android Studio
2. Drag and drop APK onto emulator
3. Or use: `adb install path/to/app.apk`

## Troubleshooting

### Build Fails

1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install`
4. Try again: `eas build --platform android --profile production --clear-cache`

### APK Won't Install

1. Check Android version (minimum: Android 5.0 / API 21)
2. Ensure enough storage space (minimum 100MB)
3. Try uninstalling previous version first

### App Crashes on Launch

1. Check device logs: `adb logcat`
2. Ensure all permissions are granted
3. Try preview build first to test

## Build Configurations

### Production APK (Recommended for Distribution)
- Optimized and minified
- Signed with release key
- ~30-50MB size
- Best performance

```bash
eas build --platform android --profile production
```

### Preview APK (For Testing)
- Faster build time
- Not fully optimized
- ~40-60MB size

```bash
eas build --platform android --profile preview
```

### AAB for Google Play
- Required for Play Store
- Smaller download size
- Automatic APK splitting

```bash
eas build --platform android --profile production-aab
```

## Distribution

### Google Play Store

1. Build AAB: `eas build --platform android --profile production-aab`
2. Create Google Play Console account
3. Upload AAB to Play Console
4. Fill in store listing details
5. Submit for review

### Direct Distribution

1. Build APK: `eas build --platform android --profile production`
2. Host APK on your server or file hosting
3. Share download link
4. Users install directly

### Third-Party Stores

- Amazon Appstore
- Samsung Galaxy Store
- APKPure
- F-Droid (if open source)

## Advanced Optimizations

### Split APKs by Architecture

In `eas.json`:
```json
{
  "production": {
    "android": {
      "buildType": "apk",
      "enabledVariants": ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"]
    }
  }
}
```

### Custom Build Settings

Edit `eas.json` to customize:
- Build type (APK/AAB)
- Android API level
- Resource configurations
- ProGuard settings

## Complete Build Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Expo account created and logged in
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] App tested locally (`npm run android`)
- [ ] Build profile selected (production/preview)
- [ ] Build initiated (`eas build --platform android`)
- [ ] Build completed successfully
- [ ] APK downloaded
- [ ] APK tested on device/emulator
- [ ] App launches correctly
- [ ] All features working
- [ ] Performance is good
- [ ] Ready for distribution

## Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev/build/introduction/
- EAS Build reference: https://docs.expo.dev/build-reference/apk/
- Project repository: https://github.com/ParkNow914/twincluster

## Success!

After following this guide, you'll have a production-ready APK file that can be:
- Installed on any Android device (Android 5.0+)
- Distributed directly to users
- Uploaded to Google Play Store (as AAB)
- Shared on third-party app stores

The APK includes all 90+ features across 14 screens, ready for immediate use!
