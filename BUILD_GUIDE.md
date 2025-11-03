# Build Guide - Football Manager 2026 POC

Complete guide for building production-ready APK and EXE files for deployment.

## 📱 Android APK Build

### Prerequisites

1. Install Expo CLI globally:
```bash
npm install -g eas-cli
```

2. Login to Expo account:
```bash
eas login
```

3. Configure project:
```bash
eas build:configure
```

### Build APK (Standalone Installation)

**Option 1: Using Expo EAS (Recommended)**
```bash
# Build APK for direct installation
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production-aab

# Build production APK
eas build --platform android --profile production
```

**Option 2: Local Build with Expo**
```bash
# Install dependencies
npm install

# Build locally (requires Android SDK)
npx expo run:android --variant release
```

### Download Built APK

After EAS build completes:
1. Check build status: `eas build:list`
2. Download APK from Expo dashboard or command line
3. Install on Android device via USB or share APK file

### APK Installation on Android Device

1. **Enable Unknown Sources:**
   - Go to Settings → Security → Unknown Sources
   - Enable "Install from Unknown Sources"

2. **Install APK:**
   - Transfer APK to device
   - Open file and tap "Install"
   - Grant necessary permissions

## 💻 Windows EXE Build

### Option 1: Electron (Recommended for Desktop)

**Setup Electron Wrapper:**

1. Install Electron packager:
```bash
npm install --save-dev electron electron-builder
```

2. Create electron configuration file `electron-builder.json`:
```json
{
  "appId": "com.twincluster.footballmanager",
  "productName": "Football Manager 2026",
  "directories": {
    "output": "dist"
  },
  "files": [
    "build/**/*",
    "node_modules/**/*"
  ],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "assets/icon.png"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

3. Add build scripts to `package.json`:
```json
{
  "scripts": {
    "electron-build": "electron-builder build --win --x64",
    "electron-pack": "electron-builder --dir"
  }
}
```

4. Build Windows EXE:
```bash
# First build web version
expo export:web

# Then package with Electron
npm run electron-build
```

### Option 2: Tauri (Lightweight Alternative)

**Setup Tauri:**

1. Install Tauri CLI:
```bash
npm install --save-dev @tauri-apps/cli
```

2. Initialize Tauri:
```bash
npx tauri init
```

3. Build Windows EXE:
```bash
npx tauri build
```

### Option 3: Web Export with Wrapper

**Using nw.js or similar:**

1. Build web version:
```bash
expo export:web
```

2. Package with nw.js:
```bash
npm install -g nwjs-builder
nwjs-build web-build/ -p win64 -o dist/
```

## 🌐 Web Deployment (PWA)

### Build Static Web App

```bash
# Build optimized web version
expo export:web

# Output will be in web-build/ directory
```

### Deploy to Hosting Services

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=web-build --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**GitHub Pages:**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d web-build"

# Deploy
npm run deploy
```

## 📦 Build Optimization

### Production Optimizations

1. **Minify Code:**
   - Already handled by Expo build process
   - Additional minification in `metro.config.js`

2. **Asset Optimization:**
   - Compress images in `assets/`
   - Use WebP format for web builds

3. **Code Splitting:**
   - Lazy load screens
   - Split large dependencies

4. **Performance:**
   - Enable Hermes for Android (already configured)
   - Use React Native's new architecture

### Size Reduction

**Android APK:**
- Enable ProGuard/R8 in `android/app/build.gradle`
- Remove unused resources
- Use Android App Bundles (AAB) for Play Store

**Windows EXE:**
- Exclude dev dependencies
- Use compression (7-Zip, UPX)
- Bundle only necessary Node modules

## 🧪 Testing Builds

### Android APK Testing

```bash
# Install on connected device
adb install app-release.apk

# Check logs
adb logcat
```

### Windows EXE Testing

1. Run on Windows 10/11
2. Check compatibility mode if needed
3. Test with antivirus enabled

## 📋 Build Checklist

Before releasing:

- [ ] Update version in `app.json` and `package.json`
- [ ] Test on multiple devices/OS versions
- [ ] Check permissions are minimal
- [ ] Verify all features work offline
- [ ] Test save/load functionality
- [ ] Ensure no debug code or console.logs
- [ ] Optimize assets (images, sounds)
- [ ] Run security audit: `npm audit`
- [ ] Test installation process
- [ ] Create release notes

## 🔒 Code Signing (Optional)

### Android APK Signing

Required for Play Store upload:

```bash
# Generate keystore
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.keystore app-release-unsigned.apk my-key-alias
```

### Windows EXE Signing

For trusted installation:

```bash
# Using SignTool from Windows SDK
signtool sign /f certificate.pfx /p password /t http://timestamp.server.com app.exe
```

## 📊 Build Sizes

Expected file sizes:

- **Android APK**: ~50-80 MB
- **Android AAB**: ~40-60 MB (smaller, for Play Store)
- **Windows EXE**: ~100-150 MB (with Node.js runtime)
- **Web Build**: ~10-20 MB (gzipped)

## 🚀 Distribution

### Android Distribution

1. **Google Play Store**
   - Use AAB format
   - Follow Play Store guidelines
   - Complete developer registration

2. **Direct APK**
   - Host on website
   - Share via QR code
   - Use APK hosting services

### Windows Distribution

1. **Microsoft Store**
   - Package as MSIX
   - Complete certification

2. **Direct Download**
   - Host installer on website
   - Include antivirus scan certificate

3. **Alternative Stores**
   - Steam (requires Steamworks)
   - itch.io (indie game platform)

## 🐛 Troubleshooting

### Common Build Issues

**Android Build Fails:**
```bash
# Clear build cache
cd android && ./gradlew clean

# Update Gradle wrapper
./gradlew wrapper --gradle-version=8.0
```

**Expo EAS Build Timeout:**
```bash
# Use local build
eas build --local
```

**Windows Build Too Large:**
- Use `electron-builder` with compression
- Exclude unnecessary dependencies
- Use portable build instead of installer

## 📚 Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Electron Builder Guide](https://www.electron.build/)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)
- [React Native Performance](https://reactnative.dev/docs/performance)

## 🎯 Quick Commands Reference

```bash
# Android APK
eas build --platform android --profile production

# Web Build
expo export:web

# iOS Build (requires macOS)
eas build --platform ios --profile production

# All Platforms
eas build --platform all
```

---

**Note:** This guide assumes you have the necessary development environment set up (Android SDK, Xcode, Node.js, etc.). For first-time setup, refer to the React Native and Expo documentation.
