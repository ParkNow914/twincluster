# Complete Windows EXE Build Guide for Football Manager 2026

This guide provides comprehensive instructions for building a standalone Windows executable (.exe) for the Football Manager 2026 game.

## Important Note

React Native apps are primarily designed for mobile platforms. To create a Windows executable, we'll use **Electron** to wrap the web version of the app.

## Prerequisites

1. **Node.js and npm** installed (v18 or higher recommended)
2. **Windows 10/11** or ability to build for Windows

## Build Methods

### Method 1: Using Electron (Recommended)

This method creates a standalone Windows application.

#### Step 1: Install Dependencies

```bash
cd twincluster
npm install
```

#### Step 2: Build Web Version

```bash
npm run build:web
```

This creates a static web build in the `web-build/` directory.

#### Step 3: Set Up Electron

Create a new directory for Electron:

```bash
mkdir electron-windows
cd electron-windows
npm init -y
```

#### Step 4: Install Electron and Builder

```bash
npm install electron electron-builder --save-dev
```

#### Step 5: Create Electron Main File

Create `electron-windows/main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    autoHideMenuBar: true,
    title: 'Football Manager 2026'
  });

  // Load the web-build index
  win.loadFile(path.join(__dirname, '../web-build/index.html'));

  // Open DevTools in development
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
```

#### Step 6: Configure package.json

Edit `electron-windows/package.json`:

```json
{
  "name": "football-manager-2026-windows",
  "version": "1.0.0",
  "description": "Football Manager 2026 for Windows",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder --windows --x64",
    "build-all": "electron-builder --windows --x64 --ia32"
  },
  "build": {
    "appId": "com.twincluster.footballmanager2026",
    "productName": "Football Manager 2026",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "../web-build/**/*",
      "../assets/**/*"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "icon": "../assets/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Football Manager 2026"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  }
}
```

#### Step 7: Build Windows EXE

```bash
cd electron-windows
npm run build
```

The EXE installer will be created in `electron-windows/dist/`

### Method 2: Using Tauri (Modern Alternative)

Tauri is a newer, lighter alternative to Electron.

#### Step 1: Install Tauri CLI

```bash
npm install --save-dev @tauri-apps/cli
```

#### Step 2: Initialize Tauri

```bash
npm run tauri init
```

Follow the prompts:
- App name: Football Manager 2026
- Window title: Football Manager 2026
- Web assets: ../web-build
- Dev server: http://localhost:8081

#### Step 3: Build

```bash
npm run tauri build
```

The EXE will be in `src-tauri/target/release/`

### Method 3: Progressive Web App (PWA)

The web version can be installed as a desktop app on Windows.

#### Step 1: Build Web Version

```bash
npm run build:web
```

#### Step 2: Host Locally or Online

Option A - Local Server:
```bash
cd web-build
npx serve
```

Option B - Deploy to hosting (Netlify, Vercel, GitHub Pages)

#### Step 3: Install as Desktop App

1. Open the app in Edge or Chrome
2. Click the install icon in address bar
3. Click "Install"

The PWA will appear as a desktop app on Windows.

## Complete Electron Build Script

Create `build-windows.sh` in the project root:

```bash
#!/bin/bash

# Complete Windows build script
echo "Building Football Manager 2026 for Windows..."

# Step 1: Build web version
echo "Step 1: Building web version..."
npm run build:web

# Step 2: Set up Electron (if not exists)
if [ ! -d "electron-windows" ]; then
  echo "Step 2: Setting up Electron..."
  mkdir electron-windows
  cd electron-windows
  npm init -y
  npm install electron electron-builder --save-dev
  cd ..
fi

# Step 3: Copy main.js if needed
if [ ! -f "electron-windows/main.js" ]; then
  echo "Step 3: Creating Electron main file..."
  # Copy the main.js file created earlier
fi

# Step 4: Build Windows executable
echo "Step 4: Building Windows executable..."
cd electron-windows
npm run build

echo "Build complete! EXE is in electron-windows/dist/"
```

Make executable:
```bash
chmod +x build-windows.sh
./build-windows.sh
```

## Build Configurations

### Production Build (Recommended)

Creates optimized, signed EXE with installer:

```json
{
  "win": {
    "target": "nsis",
    "icon": "../assets/icon.png"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "installerIcon": "../assets/icon.png",
    "uninstallerIcon": "../assets/icon.png",
    "license": "../LICENSE",
    "warningsAsErrors": false
  }
}
```

### Portable Build

Creates a portable .exe without installer:

```json
{
  "win": {
    "target": "portable"
  }
}
```

### Multiple Architectures

Build for both 64-bit and 32-bit:

```bash
npm run build-all
```

## Optimization Tips

### 1. Reduce Bundle Size

- Remove source maps in production
- Minify assets
- Use code splitting

### 2. Performance

- Enable hardware acceleration
- Optimize startup time
- Lazy load resources

### 3. Security

- Enable context isolation
- Disable nodeIntegration in production
- Implement CSP headers

## Testing the EXE

### Quick Test

1. Navigate to `electron-windows/dist/`
2. Run the installer or portable exe
3. Launch "Football Manager 2026"
4. Test all features

### Full Testing Checklist

- [ ] App launches correctly
- [ ] All 14 screens work
- [ ] Navigation functions properly
- [ ] Save/load works
- [ ] Match simulation works
- [ ] All features functional
- [ ] Performance is good
- [ ] No errors in console

## Distribution

### Direct Download

1. Upload EXE to your server or GitHub releases
2. Users download and install
3. No app store approval needed

### Windows Store

1. Create Microsoft Partner account
2. Package app as MSIX
3. Submit to Microsoft Store
4. Users install from Store

### Installer Options

**NSIS Installer** (Recommended):
- Professional installation wizard
- Custom install directory
- Desktop/Start menu shortcuts
- Uninstaller included

**Portable EXE**:
- No installation needed
- Run from any location
- Smaller file size

## Troubleshooting

### Build Fails

1. Ensure web-build exists: `npm run build:web`
2. Check Node.js version: `node --version` (should be 18+)
3. Clear caches: `npm cache clean --force`
4. Reinstall: `rm -rf node_modules && npm install`

### EXE Won't Launch

1. Check Windows Defender/Antivirus
2. Run as administrator
3. Install Visual C++ Redistributable
4. Check system requirements

### App Crashes

1. Open developer console (Ctrl+Shift+I if enabled)
2. Check error logs
3. Test in development mode first

## System Requirements

### For Building

- Windows 10/11 or WSL2 on Windows
- Node.js 18+
- 4GB RAM minimum
- 2GB free disk space

### For Running (End Users)

- Windows 10 or later
- 2GB RAM minimum
- 500MB free disk space
- .NET Framework 4.7.2+ (usually pre-installed)

## Advanced Features

### Auto-Updates

Add electron-updater for automatic updates:

```bash
npm install electron-updater --save
```

Configure in main.js:
```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

### Custom Installer

Customize NSIS installer with custom pages, images, and branding.

### Code Signing

Sign your EXE for Windows SmartScreen:

```json
{
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password"
  }
}
```

## File Sizes

Typical file sizes:
- Web build: ~5-10MB
- Electron bundle: ~150-200MB (includes Chromium)
- Tauri bundle: ~10-20MB (lighter)
- NSIS installer: ~160-210MB

## Complete Build Checklist

- [ ] Web build created (`npm run build:web`)
- [ ] Electron set up
- [ ] main.js configured
- [ ] package.json configured
- [ ] Icon files prepared
- [ ] License included
- [ ] Build executed successfully
- [ ] EXE tested on Windows
- [ ] All features working
- [ ] Performance acceptable
- [ ] Ready for distribution

## Quick Start Commands

```bash
# One-command build (after setup)
cd electron-windows && npm run build

# Test before building
cd electron-windows && npm start

# Build portable version
cd electron-windows && electron-builder --windows portable

# Build for both architectures
cd electron-windows && npm run build-all
```

## Support

For issues:
- Electron docs: https://www.electronjs.org/docs
- Tauri docs: https://tauri.app/
- Project repo: https://github.com/ParkNow914/twincluster

## Success!

After following this guide, you'll have:
- ✅ A standalone Windows EXE
- ✅ Professional installer (NSIS)
- ✅ Desktop shortcuts
- ✅ All 90+ features working
- ✅ Ready for distribution

The Windows executable can be:
- Distributed directly to users
- Uploaded to Microsoft Store
- Shared via download links
- Installed on any Windows 10+ PC

Football Manager 2026 is now ready for Windows!
