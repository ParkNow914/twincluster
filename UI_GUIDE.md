# User Interface Guide

## Screen Overview

The Football Manager POC features 4 main screens accessible via bottom tab navigation:

1. **Home** - Dashboard and quick actions
2. **Squad** - Team roster and player management
3. **Matches** - Fixtures and match simulation
4. **Table** - League standings

## Screen Details

### 1. Home Screen

**Purpose**: Central dashboard with overview and quick actions

**Features**:
- **Team Header** (Blue banner)
  - Team name (e.g., "Manchester City FC")
  - League name
  - Current budget

- **Quick Actions** (Green button)
  - "Simulate Next Match" button
  - Primary action for progressing the game

- **Upcoming Matches** (White cards)
  - Shows next 3 fixtures
  - Team names in short form (MCI, RMA, etc.)
  - Competition type (League)
  - VS format for unplayed matches

- **Recent Results** (White cards with scores)
  - Last 3 completed matches
  - Final scores displayed
  - Competition type shown

- **League Standings** (Top 6)
  - Position number
  - Team short name
  - Played matches
  - Win-Draw-Loss record
  - Points total
  - Player's team highlighted in light blue

**Color Scheme**:
- Header: Dark blue (#1a237e)
- Actions: Green (#4caf50)
- Cards: White with subtle shadow
- Player team: Light blue highlight (#e3f2fd)

### 2. Squad Screen

**Purpose**: Detailed view of all team players

**Features**:
- **Team Header** (Blue banner)
  - Team name
  - Current formation (e.g., "4-3-3")

- **Player Sections** (Grouped by position)
  - 🧤 Goalkeepers
  - 🛡️ Defenders
  - ⚙️ Midfielders
  - ⚔️ Forwards

- **Player Cards** (White cards)
  - Player name
  - Overall rating badge (Green circle, 1-100)
  - Position, age, nationality
  - Form indicator (star rating ⭐)
  - Individual stats bar:
    - PAC (Pace)
    - SHO (Shooting)
    - PAS (Passing)
    - DRI (Dribbling)
    - DEF (Defending)
    - PHY (Physical)
  - Injury status (if injured)

- **Team Statistics** (Bottom card)
  - Squad size
  - Average age
  - Average rating
  - Total market value

**Layout**:
- Scrollable vertical list
- Players grouped and sorted by position
- Easy to scan and compare

### 3. Matches Screen

**Purpose**: Match center for fixtures and results

**Features**:
- **Match List View**
  - "Simulate Next Match" button (Green)
  - Upcoming fixtures section
  - Recent results section

- **Match Cards**
  - Competition badge
  - Home team name and logo
  - VS or score
  - Away team name and logo
  - "Played" checkmark for completed matches
  - Tap to view details (for played matches)

- **Match Detail View** (When card tapped)
  - Back button to return
  - Large score display
  - Team names
  - Competition type
  - **Match Events Timeline**:
    - Minute stamp (e.g., "45'")
    - Event description
    - Icons: ⚽ (goal), 🟨 (yellow card)
    - Chronological order

**Interaction**:
- Tap upcoming match: No action (just preview)
- Tap played match: Opens detailed match report
- Simulate button: Advances to next fixture

### 4. Standings Screen (Table)

**Purpose**: Complete league table with all teams

**Features**:
- **Table Header**
  - "League Standings" title
  - Current season year

- **Table Column Headers**
  - # (Position)
  - Team
  - P (Played)
  - W (Won)
  - D (Drawn)
  - L (Lost)
  - GF (Goals For)
  - GA (Goals Against)
  - GD (Goal Difference)
  - Pts (Points)

- **Table Rows**
  - Position number (bold)
  - Team short name
  - All statistics
  - Color coding:
    - Top 4: Green border (Champions League)
    - Bottom 3: Red border (Relegation)
    - Player team: Blue background
  - Goal difference colored:
    - Positive: Green
    - Negative: Red

- **Legend** (Bottom card)
  - Explains color coding
  - Champions League zones
  - Relegation zones
  - Player team highlight

**Sorting**:
- Sorted by points (descending)
- Tie-breaker: Goal difference
- Updates automatically after matches

## Navigation

### Bottom Tab Bar
- **Appearance**: White background, icons replaced with text
- **Active tab**: Dark blue (#1a237e)
- **Inactive tabs**: Gray (#666)
- **Labels**: 
  - "Home"
  - "Squad"
  - "Matches"
  - "Table"

### Navigation Flow
```
Home → Simulate Match → Match Detail → Home
Squad → View Players → (no drill-down yet)
Matches → View Results → Match Detail → Matches
Table → (view only)
```

## Design Principles

### Color Palette
- **Primary**: Dark Blue (#1a237e) - Headers, emphasis
- **Secondary**: Green (#4caf50) - Actions, success
- **Background**: Light Gray (#f5f5f5) - App background
- **Cards**: White (#fff) - Content containers
- **Highlights**: Light Blue (#e3f2fd) - Player team
- **Success**: Green (#4caf50) - Positive indicators
- **Warning**: Red (#f44336) - Negative indicators

### Typography
- **Headers**: 24px, bold
- **Subtitles**: 16px, regular
- **Body**: 14px, regular
- **Stats**: 12px, regular
- **Badges**: 16-20px, bold

### Spacing
- Section margins: 10px
- Card padding: 15px
- Element spacing: 8-10px
- Consistent throughout

### Visual Hierarchy
1. **Headers** (largest, boldest)
2. **Section titles** (medium, bold)
3. **Content** (regular size)
4. **Metadata** (smallest, gray)

## Responsive Design

### Mobile (Primary Target)
- Optimized for portrait orientation
- Touch-friendly tap targets (44x44 minimum)
- Scrollable content
- Safe area handling for notches

### Tablet
- Same layout, more breathing room
- Larger text for readability
- Better use of horizontal space

### Web/Desktop
- Centered content area
- Maximum width constraint
- Works with mouse and keyboard
- Responsive to window resize

## Accessibility

### Current Support
- Semantic HTML (when on web)
- Readable contrast ratios
- Touch target sizes meet guidelines
- Clear visual hierarchy

### Future Improvements
- Screen reader labels
- Keyboard navigation
- High contrast mode
- Font size adjustment

## Animation & Feedback

### Current
- Tab switching: Smooth transition
- Button press: Visual feedback
- Scroll: Native smooth scrolling

### Future Enhancements
- Match event animations
- Score updates with celebration
- Player card flip transitions
- Loading spinners
- Success/error toasts

## Platform Differences

### Android
- Material Design components
- Native navigation gestures
- Android-specific status bar

### iOS
- iOS-style navigation
- Safe area for notch
- iOS-specific gestures

### Web
- Browser-standard interactions
- Mouse hover states
- Keyboard shortcuts (future)

## Screenshots Description

### Home Screen
- Blue header with team name
- Green "Simulate Match" button prominent
- 3 upcoming fixtures with VS format
- 3 recent results with scores
- Top 6 standings table

### Squad Screen
- Blue header with formation
- Players grouped by emoji icons
- Green rating badges on each card
- Star ratings for form
- 6-stat breakdown per player

### Matches Screen (List)
- Green simulate button at top
- White match cards
- Clear home vs away layout
- Upcoming and recent sections

### Matches Screen (Detail)
- Large score display
- Event timeline with icons
- Minute-by-minute commentary
- Back button to return

### Standings Screen
- Full league table
- Color-coded zones
- Player team highlighted
- Legend at bottom
- Clean tabular layout

## UX Flows

### First-Time User
1. App opens to Home screen
2. See Manchester City as default team
3. Notice "Simulate Next Match" button
4. Tap to simulate → See match result
5. Check updated standings
6. Navigate to Squad to see players
7. Explore other screens

### Regular Session
1. Open app → Check standings
2. Go to Home → Simulate match
3. View match report
4. Check updated standings
5. View squad if needed
6. Exit or simulate more matches

### Match Day Flow
1. Matches screen → See upcoming fixture
2. Tap "Simulate Next Match"
3. View detailed match report
4. See goals and events
5. Back to matches or standings
6. Track progress

## Error States

### No Matches
- "No upcoming matches" message
- "No recent matches" message
- Clear italic gray text

### No Team Selected
- "No team selected" message
- Rare edge case

### Future Error Handling
- Network errors (if backend added)
- Save/load failures
- Invalid data gracefully handled

---

This UI guide describes the complete user interface of the Football Manager POC, designed for clarity, ease of use, and professional appearance.
