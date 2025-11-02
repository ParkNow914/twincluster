# Football Manager 2026 - Proof of Concept

A cross-platform football (soccer) management simulation game built with React Native and Expo. This is a proof-of-concept demonstrating the core mechanics of a football management game.

## 🎮 Features

### Current Features
- **Team Management**: Manage your own football team with real squad data
- **Player Database**: Detailed player attributes including:
  - Position, age, nationality
  - Overall rating (1-100)
  - Individual stats: Pace, Shooting, Passing, Dribbling, Defending, Physical
  - Form, morale, and stamina tracking
  - Market value calculations
  
- **Match Simulation Engine**: 
  - Realistic match simulation based on team strength
  - Dynamic event generation (goals, cards, injuries)
  - Home/away advantage calculations
  - Real-time match commentary

- **League System**:
  - Full league standings with points, goal difference
  - Multiple top-tier teams (Man City, Real Madrid, Bayern, PSG, Liverpool, Barcelona)
  - Automatic fixture generation
  - Season progression

- **Multiple Screens**:
  - **Home**: Dashboard with quick actions, upcoming matches, recent results, and league table
  - **Squad**: Complete squad overview with player cards and statistics
  - **Matches**: Match center with fixtures, results, and detailed match reports
  - **Standings**: Full league table with Champions League and relegation zones

### Tactical Features
- Multiple formations (4-4-2, 4-3-3, 3-5-2, 4-2-3-1, 4-3-2-1)
- Team tactics configuration (mentality, width, tempo, passing style)
- Strategic team management

## 🚀 Technology Stack

All technologies used are **100% free and open-source**:

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build platform (free tier)
- **TypeScript**: Type-safe development
- **React Navigation**: Screen navigation
- **SQLite** (future): Local database for save games

## 📱 Platform Support

- ✅ **Android**: Full native support
- ✅ **Web**: Browser-based version (can be used on Windows)
- ✅ **iOS**: Requires macOS for native build (but works via Expo Go app)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- For Android: Android Studio with emulator, or physical device
- For iOS: macOS with Xcode (optional - can use Expo Go app)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ParkNow914/twincluster.git
   cd twincluster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your platform**

   **For Android:**
   ```bash
   npm run android
   ```
   - Or scan QR code with Expo Go app

   **For Web (Windows/macOS/Linux):**
   ```bash
   npm run web
   ```
   - Opens in your default browser

   **For iOS:**
   ```bash
   npm run ios
   ```
   - Or use Expo Go app on iPhone

## 🎯 How to Play

1. **Start the Game**: Launch the app and you'll be assigned a team (Manchester City by default)

2. **Navigate Screens**:
   - **Home**: See overview, simulate matches, check standings
   - **Squad**: View all your players and their stats
   - **Matches**: See fixtures and simulate matches
   - **Standings**: Check league table position

3. **Simulate Matches**: 
   - Click "Simulate Next Match" to play your next fixture
   - View match events and results
   - Track your progress in the league

4. **Manage Your Squad**:
   - Review player attributes
   - Check player form and morale
   - Monitor team statistics

## 🔮 Future Development Roadmap

### Phase 2 - Enhanced Gameplay
- [ ] Transfer market system
- [ ] Player contracts and wages
- [ ] Training and player development
- [ ] Injuries and fitness system
- [ ] Save/load game functionality (SQLite)

### Phase 3 - Advanced Features
- [ ] Multiple leagues and competitions
- [ ] Cup tournaments
- [ ] Champions League
- [ ] Manager reputation and career mode
- [ ] Youth academy system
- [ ] Scout network

### Phase 4 - Polish
- [ ] 3D match visualization
- [ ] Advanced statistics and analytics
- [ ] Player comparison tools
- [ ] Transfer deadline day
- [ ] Press conferences
- [ ] Board expectations

## 📦 Build for Production

### Android APK
```bash
npm install -g eas-cli
eas login
eas build --platform android
```

### Web Build
```bash
npm run web-build
```

## 🤝 Contributing

This is a proof-of-concept project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚖️ Legal Notice

This is an **independent, educational project** and is not affiliated with, endorsed by, or connected to:
- Sports Interactive (SI)
- SEGA
- Football Manager™ (trademark)

This project is a proof-of-concept football management simulation built from scratch. All code, logic, and implementation are original. No assets, code, or proprietary data from Football Manager or any other commercial game have been used.

## 📄 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgments

- React Native and Expo communities
- Football/Soccer management game enthusiasts
- All contributors and testers

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

**Note**: This is a proof-of-concept demonstrating core football management mechanics. It's designed to be educational and showcase cross-platform mobile development with React Native.
