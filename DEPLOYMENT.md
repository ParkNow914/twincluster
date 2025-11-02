# Installation & Deployment Guide

Complete guide for installing, running, and deploying the Football Manager POC on all supported platforms.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Web Deployment](#web-deployment)
4. [Android Deployment](#android-deployment)
5. [iOS Deployment](#ios-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

**For all platforms:**
- **Node.js** 18 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`
- **npm** (comes with Node.js)
  - Verify: `npm --version`

**For Android development:**
- **Android Studio**
  - Download: https://developer.android.com/studio
  - Includes Android SDK and emulator
- **Java Development Kit (JDK)** 11 or higher
  - Usually included with Android Studio

**For iOS development (macOS only):**
- **macOS** Catalina or higher
- **Xcode** 12 or higher
  - Download from Mac App Store
- **CocoaPods**
  - Install: `sudo gem install cocoapods`

**For Web deployment:**
- Any modern web browser
- Optional: Web server for production

---

## Local Development

### Step 1: Clone Repository

```bash
git clone https://github.com/ParkNow914/twincluster.git
cd twincluster
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React Native
- Expo SDK
- Navigation libraries
- TypeScript
- All other dependencies

**Expected time**: 2-5 minutes depending on internet speed

### Step 3: Start Development Server

```bash
npm start
```

This launches the Expo Metro Bundler.

**You'll see:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### Step 4: Choose Your Platform

**Option A: Web Browser (Easiest)**
```bash
Press 'w' in the terminal
```
Opens in your default browser at `http://localhost:19006`

**Option B: Android Emulator**
```bash
Press 'a' in the terminal
```
Launches Android emulator (must have Android Studio installed)

**Option C: iOS Simulator (macOS only)**
```bash
Press 'i' in the terminal
```
Launches iOS Simulator (must have Xcode installed)

**Option D: Physical Device via Expo Go**
1. Install **Expo Go** app:
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Scan QR code shown in terminal
3. App loads on your device

---

## Web Deployment

### Development Build

```bash
npm run web
```

Access at `http://localhost:19006`

### Production Build

#### Step 1: Build for Production

```bash
npx expo export:web
```

This creates optimized files in `web-build/` directory.

**Output includes:**
- Minified JavaScript
- Optimized assets
- Service worker (PWA support)
- Manifest file

#### Step 2: Deploy to Hosting Service

**Option A: Netlify (Recommended)**

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd web-build
   netlify deploy --prod
   ```

3. Follow prompts to authorize and deploy

**Option B: Vercel**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

**Option C: GitHub Pages**

1. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/twincluster"
   }
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy script:
   ```json
   "scripts": {
     "predeploy": "expo export:web",
     "deploy": "gh-pages -d web-build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

**Option D: Firebase Hosting**

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize:
   ```bash
   firebase init hosting
   ```

3. Set public directory to `web-build`

4. Deploy:
   ```bash
   firebase deploy
   ```

---

## Android Deployment

### Method 1: APK for Testing (Easiest)

#### Using Expo EAS (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Configure build:
   ```bash
   eas build:configure
   ```

4. Build APK:
   ```bash
   eas build --platform android --profile preview
   ```

5. Download APK when build completes

6. Install on device:
   - Transfer APK to device
   - Enable "Install from Unknown Sources"
   - Tap APK to install

### Method 2: Google Play Store

#### Prerequisites
- Google Play Developer account ($25 one-time fee)
- App signing key
- Privacy policy URL
- App screenshots

#### Steps

1. Create release build:
   ```bash
   eas build --platform android --profile production
   ```

2. Configure `eas.json`:
   ```json
   {
     "build": {
       "production": {
         "android": {
           "buildType": "app-bundle"
         }
       }
     }
   }
   ```

3. Build AAB (Android App Bundle):
   ```bash
   eas build --platform android --profile production
   ```

4. Download AAB file when complete

5. Upload to Google Play Console:
   - Go to https://play.google.com/console
   - Create app
   - Upload AAB to Internal Testing or Production
   - Fill out store listing
   - Submit for review

---

## iOS Deployment

### Prerequisites (macOS only)
- macOS Catalina or higher
- Xcode 12+
- Apple Developer account ($99/year for App Store)

### Method 1: Simulator (Testing)

```bash
npm run ios
```

Launches iOS Simulator automatically.

### Method 2: TestFlight (Beta Testing)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login:
   ```bash
   eas login
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios --profile preview
   ```

4. Download IPA when complete

5. Upload to TestFlight:
   ```bash
   eas submit --platform ios
   ```

### Method 3: App Store

1. Create production build:
   ```bash
   eas build --platform ios --profile production
   ```

2. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

3. Fill out App Store Connect:
   - App information
   - Screenshots
   - Description
   - Privacy policy
   - Submit for review

---

## Environment Setup

### Android Studio Setup

1. Download and install Android Studio
2. Open Android Studio
3. Go to Settings → Appearance & Behavior → System Settings → Android SDK
4. Install:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Emulator
5. Create AVD (Android Virtual Device):
   - Tools → AVD Manager
   - Create Virtual Device
   - Choose device (Pixel 5)
   - Choose system image (Android 13)
   - Finish

### Xcode Setup (macOS)

1. Install Xcode from App Store
2. Open Xcode
3. Preferences → Locations → Command Line Tools → Select Xcode version
4. Install iOS Simulator:
   - Xcode → Preferences → Components
   - Download iOS 16.x Simulator

### Environment Variables

Create `.env` file (if needed in future):
```bash
# API endpoints (future)
API_URL=https://api.example.com

# Analytics (future)
ANALYTICS_KEY=your_key_here
```

---

## Build Configuration

### app.json

Key configurations:
```json
{
  "expo": {
    "name": "Football Manager POC",
    "slug": "football-manager-poc",
    "version": "1.0.0",
    "android": {
      "package": "com.twincluster.footballmanager"
    },
    "ios": {
      "bundleIdentifier": "com.twincluster.footballmanager"
    }
  }
}
```

### eas.json

Create for EAS builds:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

---

## Troubleshooting

### Common Issues

**"Command not found: npm"**
- Install Node.js from nodejs.org
- Restart terminal

**"expo: command not found"**
- Use `npx expo` instead of `expo`
- Or install globally: `npm install -g expo-cli`

**Metro bundler fails to start**
- Clear cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Android emulator won't start**
- Check Android Studio is installed
- Ensure virtualization is enabled in BIOS
- Try different AVD configuration

**iOS build fails**
- Update Xcode to latest version
- Run `pod install` in ios folder
- Clear derived data

**TypeScript errors**
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` is correct

**Build fails on EAS**
- Check logs in EAS dashboard
- Verify package.json dependencies
- Ensure app.json is valid JSON

### Getting Help

1. Check documentation:
   - [Expo Docs](https://docs.expo.dev/)
   - [React Native Docs](https://reactnative.dev/)

2. Search existing issues:
   - GitHub repository issues
   - Stack Overflow

3. Ask for help:
   - Open issue on GitHub
   - Expo community forums
   - React Native community

---

## Performance Tips

### Development
- Use `--dev-client` for faster refresh
- Enable Fast Refresh
- Use debugger selectively

### Production
- Enable Hermes engine (Android)
- Minify JavaScript
- Optimize images
- Remove console.logs

### Testing
- Test on real devices when possible
- Use different screen sizes
- Test on slow connections
- Profile performance

---

## Continuous Integration (Future)

### GitHub Actions Example

Create `.github/workflows/build.yml`:
```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm test
      - run: npx expo export:web
```

---

## Monitoring & Analytics (Future)

Recommended tools:
- **Sentry**: Error tracking
- **Google Analytics**: Usage analytics
- **Firebase**: Crashlytics and analytics
- **Amplitude**: User behavior

---

## Backup & Recovery

### Source Code
- Repository: GitHub
- Backups: Automatic via git

### Build Artifacts
- EAS Dashboard: Stores builds for 30 days
- Local backups: Save APK/IPA files

### User Data (Future)
- SQLite database
- Cloud backup via iCloud/Google Drive
- Export/import functionality

---

This guide covers all aspects of installation and deployment for the Football Manager POC across all supported platforms.
