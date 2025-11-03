# Architecture Documentation

## Project Overview

Football Manager POC is a cross-platform football management simulation game built with React Native and Expo, demonstrating modern mobile development practices.

## Technology Stack

### Frontend Framework
- **React Native 0.81.5**: Cross-platform mobile framework
- **Expo SDK 54**: Development platform and tooling
- **TypeScript 5.9**: Static typing for better developer experience
- **React Navigation 7**: Screen navigation and routing

### State Management
- **React Hooks**: useState for local component state
- **Singleton Pattern**: GameState service for global game state
- **No external state library needed** for this scope

### Platform Support
- Android (native)
- iOS (native)
- Web (PWA-ready)
- Windows (via web)

## Architecture Pattern

### Service-Oriented Architecture

```
┌─────────────────────────────────────────┐
│           Presentation Layer             │
│  (React Native Screens & Components)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Service Layer                   │
│  (GameState, MatchSimulator)             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Data Models                     │
│  (Player, Team, Match, Season)           │
└─────────────────────────────────────────┘
```

## Directory Structure

```
/
├── src/
│   ├── models/              # TypeScript interfaces and types
│   │   ├── Player.ts        # Player data model
│   │   ├── Team.ts          # Team data model
│   │   └── Match.ts         # Match and season models
│   │
│   ├── services/            # Business logic layer
│   │   ├── GameState.ts     # Central game state manager
│   │   └── MatchSimulator.ts # Match simulation engine
│   │
│   ├── screens/             # Main application screens
│   │   ├── HomeScreen.tsx   # Dashboard screen
│   │   ├── SquadScreen.tsx  # Team squad viewer
│   │   ├── MatchesScreen.tsx # Match center
│   │   └── StandingsScreen.tsx # League table
│   │
│   ├── components/          # Reusable UI components (future)
│   ├── data/                # Static data and initial state
│   │   └── initialData.ts   # Teams and players initialization
│   └── utils/               # Helper functions (future)
│
├── assets/                  # Images and static assets
├── App.tsx                  # Root component with navigation
├── index.ts                 # Entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Core Components

### 1. Data Models (`src/models/`)

**Player Model**
```typescript
interface Player {
  id: string;
  name: string;
  age: number;
  position: Position;
  overall: number;        // 1-100
  pace, shooting, passing, dribbling, defending, physical: number;
  stamina: number;        // Energy level
  morale: number;         // Mental state
  form: number;           // Current performance
  injured: boolean;
  marketValue: number;
}
```

**Team Model**
```typescript
interface Team {
  id: string;
  name: string;
  players: Player[];
  formation: Formation;
  tactics: Tactics;
  budget: number;
  reputation: number;     // 1-5 stars
}
```

**Match Model**
```typescript
interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  played: boolean;
  events: MatchEvent[];   // Goals, cards, etc.
}
```

### 2. Services (`src/services/`)

**GameState Service** (Singleton)
- Manages global game state
- Handles season progression
- Tracks all teams and matches
- Updates standings
- Provides game queries

**MatchSimulator Service** (Static)
- Simulates matches based on team strength
- Generates realistic match events
- Calculates probabilities
- Applies tactics and formations

### 3. Screens (`src/screens/`)

**HomeScreen**
- Overview dashboard
- Quick actions
- Upcoming matches preview
- Recent results
- League standings summary

**SquadScreen**
- Full squad roster
- Player cards with stats
- Grouped by position
- Team statistics

**MatchesScreen**
- Fixture list
- Match simulation controls
- Detailed match reports
- Event timeline

**StandingsScreen**
- Complete league table
- Points, goals, form
- Champions League zones
- Relegation zones

## Data Flow

### Match Simulation Flow
```
User clicks "Simulate Match"
        ↓
HomeScreen/MatchesScreen calls GameState.simulateNextMatch()
        ↓
GameState finds next unplayed match for player's team
        ↓
GameState calls MatchSimulator.simulateMatch(homeTeam, awayTeam)
        ↓
MatchSimulator calculates team strengths
        ↓
MatchSimulator generates events (goals, cards) minute by minute
        ↓
MatchSimulator returns completed Match object
        ↓
GameState updates standings based on result
        ↓
Screen re-renders with new data
```

### State Management Flow
```
GameState (Singleton)
    ├── teams: Team[]
    ├── playerTeamId: string
    └── season: Season
            ├── matches: Match[]
            └── standings: TeamStanding[]
```

## Key Design Decisions

### 1. Singleton Pattern for GameState
- **Why**: Single source of truth for game state
- **Benefit**: Easy access from any component
- **Trade-off**: Harder to test, but acceptable for POC

### 2. Static Methods for MatchSimulator
- **Why**: Pure functions, no state needed
- **Benefit**: Easy to test and reason about
- **Use**: Stateless calculations

### 3. TypeScript Everywhere
- **Why**: Type safety prevents bugs
- **Benefit**: Better IDE support, documentation
- **Cost**: Slightly more code, but worth it

### 4. No External State Library
- **Why**: Game state is simple enough
- **Alternative**: Could use Redux, MobX, or Zustand
- **Decision**: Keep it simple for POC

### 5. Embedded Data
- **Why**: No backend needed for POC
- **Current**: All data in `initialData.ts`
- **Future**: Could add SQLite for persistence

## Performance Considerations

### Current Optimizations
- Minimal re-renders using React state
- Efficient list rendering with keys
- No unnecessary computations
- Small bundle size

### Future Optimizations
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Add loading states for async operations
- Optimize match simulation algorithm

## Scalability

### Current Scale
- 6 teams
- ~100 players
- ~30 matches per season
- Single league

### Scaling Options
1. **More Teams**: Add to `initialData.ts`
2. **Multiple Leagues**: Extend Season model
3. **Database**: Add SQLite for save/load
4. **Backend**: Add REST API for multiplayer
5. **Assets**: Use CDN for images

## Testing Strategy

### Current State
- No automated tests yet
- Manual testing on web/Android

### Recommended Testing
1. **Unit Tests**: Test models and services
   - MatchSimulator logic
   - GameState calculations
2. **Component Tests**: Test screen rendering
3. **Integration Tests**: Test user flows
4. **E2E Tests**: Test complete scenarios

### Tools to Add
- Jest (unit testing)
- React Native Testing Library
- Detox (E2E testing)

## Security Considerations

### Current Security
- Client-side only, no backend
- No authentication needed
- No sensitive data
- No network calls

### If Adding Backend
- Implement authentication (OAuth, JWT)
- Validate all inputs
- Sanitize user data
- Use HTTPS only
- Rate limiting
- CSRF protection

## Build & Deployment

### Development
```bash
npm start          # Start Expo dev server
npm run web        # Run in browser
npm run android    # Run on Android
npm run ios        # Run on iOS
```

### Production Builds

**Web**
```bash
expo build:web
```
→ Outputs to `web-build/`
→ Deploy to any static host (Netlify, Vercel, GitHub Pages)

**Android**
```bash
eas build --platform android
```
→ Generates APK or AAB
→ Upload to Google Play Store

**iOS**
```bash
eas build --platform ios
```
→ Generates IPA
→ Upload to Apple App Store

## Dependencies

### Production Dependencies
- `expo`: Platform and tooling
- `react`: UI library
- `react-native`: Cross-platform framework
- `@react-navigation/native`: Navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `react-native-screens`: Native screens
- `react-native-safe-area-context`: Safe area handling

### Development Dependencies
- `typescript`: Type checking
- `@types/react`: React type definitions

### Why These Dependencies?
- All are industry-standard
- Well-maintained
- Free and open-source
- Good documentation
- Large community

## Future Architecture Improvements

### 1. State Management
- Add Redux or Zustand for complex state
- Implement proper action creators
- Add middleware for logging

### 2. Persistence
- Add SQLite for local storage
- Implement save/load system
- Auto-save functionality

### 3. Networking
- Add API client for backend
- Implement caching strategy
- Handle offline mode

### 4. Code Organization
- Extract reusable components
- Create utility libraries
- Add proper error boundaries

### 5. Performance
- Implement code splitting
- Add lazy loading
- Optimize bundle size
- Profile and optimize renders

## Conclusion

This architecture provides a solid foundation for a football management game POC. It's:
- **Simple**: Easy to understand and modify
- **Scalable**: Can grow with new features
- **Maintainable**: Clean separation of concerns
- **Type-safe**: TypeScript prevents bugs
- **Cross-platform**: Works everywhere

The modular design allows for easy extension while keeping complexity manageable for a proof-of-concept project.
