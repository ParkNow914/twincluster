# Quick Start Guide - Football Manager POC

Get up and running with the Football Manager Proof of Concept in 5 minutes!

## ⚡ Super Quick Start

```bash
# Clone the repository
git clone https://github.com/ParkNow914/twincluster.git
cd twincluster

# Install dependencies
npm install

# Start the app
npm start
```

Then choose your platform:
- Press `w` for **Web** (works on Windows, Mac, Linux)
- Press `a` for **Android** (requires Android Studio or device)
- Press `i` for **iOS** (requires macOS)
- Scan QR code with **Expo Go** app (Android/iOS)

## 🎮 First Steps in the Game

### 1. Home Screen
- View your team overview
- See upcoming matches
- Check league standings
- Click **"Simulate Next Match"** to play your first game

### 2. Squad Screen
- Browse all your players
- Check player ratings and stats
- View team statistics

### 3. Matches Screen
- See all fixtures
- View upcoming matches
- Simulate matches
- Check detailed match reports with events

### 4. Standings Screen
- Full league table
- Track your position
- See Champions League qualification spots (top 4)
- Avoid relegation zone (bottom 3)

## 📱 Platform-Specific Setup

### Windows (via Web)
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open Command Prompt or PowerShell
3. Follow Super Quick Start above
4. Run `npm run web`
5. Opens in browser automatically!

### Android (Native App)
**Option A: Physical Device**
1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
2. Run `npm start` on your computer
3. Scan QR code with Expo Go app
4. App loads on your phone!

**Option B: Emulator**
1. Install [Android Studio](https://developer.android.com/studio)
2. Set up Android Virtual Device (AVD)
3. Run `npm run android`
4. App opens in emulator

### iOS (Native App)
**Option A: Physical Device**
1. Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
2. Run `npm start` on your computer
3. Scan QR code with Camera app
4. Opens in Expo Go!

**Option B: Simulator (macOS only)**
1. Install Xcode from Mac App Store
2. Run `npm run ios`
3. App opens in iOS Simulator

## 🎯 Gameplay Tips

### Strategy
- **Check Player Ratings**: Higher overall = better performance
- **Monitor Form**: Players with better form perform better
- **Team Strength**: Your overall team quality affects match results
- **Home Advantage**: You have an advantage in home matches

### Match Simulation
- Matches are simulated based on team strength, tactics, and player stats
- Events are generated dynamically (goals, cards, injuries)
- Results are realistic but somewhat random (like real football!)

### Season Progression
- Play matches one by one to progress through the season
- Track your position in the league
- Aim for Champions League spots (top 4)
- Avoid relegation (bottom 3)

## 🔧 Troubleshooting

### "Command not found: npm"
→ Install Node.js from [nodejs.org](https://nodejs.org/)

### "Network response timed out"
→ Check your internet connection and try again

### Metro bundler stuck
→ Press `R` to reload or `Ctrl+C` and restart

### TypeScript errors
→ Run `npm install` again to ensure all dependencies are installed

### App won't open on Android
→ Make sure Android Studio is installed and emulator is running

### Can't scan QR code
→ Make sure phone and computer are on same WiFi network

## 🚀 Next Steps

Once you're comfortable with the basics:

1. **Explore the Code**
   - Check `src/models/` for data structures
   - Look at `src/services/` for game logic
   - Review `src/screens/` for UI components

2. **Customize the Game**
   - Edit team data in `src/data/initialData.ts`
   - Modify match simulation in `src/services/MatchSimulator.ts`
   - Adjust UI in screen files

3. **Contribute**
   - See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
   - Pick a feature from the roadmap
   - Submit a pull request!

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation Docs](https://reactnavigation.org/)

## ❓ Need Help?

- Check the main [README.md](README.md)
- Review [CONTRIBUTING.md](CONTRIBUTING.md)
- Open an issue on GitHub
- Review existing issues for solutions

---

**Happy Managing! ⚽🏆**
