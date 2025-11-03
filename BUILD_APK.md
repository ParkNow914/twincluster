# Building Android APK - Football Manager 2026

This guide explains how to build a standalone Android APK file that can be installed on any Android device.

## Prerequisites

- Node.js 16+ installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- EAS CLI installed globally (`npm install -g eas-cli`)
- Expo account (free - sign up at https://expo.dev)

## Method 1: Using Expo EAS Build (Recommended)

### Step 1: Install Dependencies

```bash
cd twincluster
npm install
```

### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo credentials.

### Step 3: Configure EAS Build

The project already has `eas.json` configured. To verify:

```bash
cat eas.json
```

### Step 4: Build APK

For a **production APK**:

```bash
eas build --platform android --profile production
```

For a **preview APK** (faster, for testing):

```bash
eas build --platform android --profile preview
```

### Step 5: Download APK

After the build completes (takes 10-20 minutes), you'll receive a download link. You can also:

1. Visit https://expo.dev/accounts/[your-account]/projects/football-manager-2026/builds
2. Download the APK file
3. Transfer to your Android device
4. Enable "Install from Unknown Sources" in Android settings
5. Install the APK

## Method 2: Local Build with Expo Prebuild

### Step 1: Prebuild Native Projects

```bash
npx expo prebuild --platform android
```

This creates an `android/` directory with native Android code.

### Step 2: Build APK Locally

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Step 3: Sign the APK (Optional but Recommended)

For production, you need to sign the APK:

1. Generate a keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

3. Rebuild:
```bash
./gradlew assembleRelease
```

## APK Details

**App Information:**
- Package Name: `com.twincluster.footballmanager2026`
- Version: 1.0.0
- Version Code: 1
- Min SDK: 23 (Android 6.0)
- Target SDK: 34 (Android 14)

**App Size:**
- APK Size: ~50-80 MB (depending on build configuration)
- Installed Size: ~120-150 MB

**Features:**
- Works offline (no internet required)
- Full save/load functionality
- All 90+ features included
- 14 complete screens
- Optimized performance

## Testing the APK

1. **Install on Device:**
   - Transfer APK to Android device
   - Enable "Install from Unknown Sources"
   - Tap APK file to install

2. **Test Key Features:**
   - Launch app
   - Play a match
   - Save game
   - Close and reopen app
   - Load saved game
   - Test all 14 screens

## Troubleshooting

**Build fails with "No keystore found":**
- For EAS build, Expo manages signing automatically
- For local build, create a keystore (see signing section)

**APK won't install:**
- Enable "Install from Unknown Sources" in Android settings
- Check if you have enough storage space
- Try uninstalling any previous versions

**App crashes on startup:**
- Check Android version (minimum Android 6.0)
- Clear app data and reinstall
- Check logs with `adb logcat`

## Publishing to Google Play Store

1. Build production AAB (Android App Bundle):
```bash
eas build --platform android --profile production-aab
```

2. Create Google Play Console account ($25 one-time fee)

3. Upload AAB to Play Console

4. Fill out app details, screenshots, description

5. Submit for review

## Performance Optimization

The APK is already optimized with:
- ✅ Hermes JavaScript engine
- ✅ Lean builds enabled
- ✅ Minification enabled in release mode
- ✅ ProGuard/R8 code shrinking
- ✅ Asset optimization

## Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev
- EAS Build docs: https://docs.expo.dev/build/introduction
- GitHub Issues: https://github.com/ParkNow914/twincluster/issues

---

**Ready for Production:** This app is production-ready and can be published to Google Play Store immediately!
