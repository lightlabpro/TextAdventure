# Space Rescue - Text Adventure Game

A Lifeline-style text adventure game where you play as a space rescue communications specialist helping stranded vessels in deep space.

## Features

- **Real-time messaging system** with realistic delays
- **Multiple story branches** and endings
- **Character development** and relationship building
- **Professional space emergency scenarios**
- **Rewind system** to explore different choices
- **Fast mode** for experienced players
- **Mobile-optimized interface**
- **NEW: Stress and resource management system**
- **NEW: Oxygen and power level tracking**
- **NEW: Critical event system**
- **NEW: Trust level mechanics**

## Installation & Setup

### Option 1: Web Version (Simple)
1. Open `index.html` in any modern web browser
2. For mobile: Add to home screen for app-like experience

### Option 2: Desktop App (Electron)
1. Install Node.js (https://nodejs.org/)
2. Open terminal in project directory
3. Run: `npm install`
4. Run: `npm start` (to test)
5. Run: `npm run build` (to create executable)

### Option 3: Mobile App (iPhone/Android)

#### For iPhone:
1. **Build the app** using Electron Builder
2. **Use Xcode** to create iOS app:
   ```bash
   npm run build-mac
   # Then use Xcode to convert to iOS app
   ```

#### Alternative iPhone Method:
1. **Upload to GitHub Pages**
2. **Open Safari** on iPhone
3. **Navigate to your game URL**
4. **Tap Share button** → **"Add to Home Screen"**
5. **Your game now appears as an app icon!**

## Building the App

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Build Commands
```bash
# Install dependencies
npm install

# Test the app locally
npm start

# Build for your current platform
npm run build

# Build for specific platforms
npm run build-mac    # macOS
npm run build-win    # Windows
npm run build-linux  # Linux
```

### Build Output
- Executables will be created in the `dist/` folder
- Each platform will have its own installer/executable

## Game Controls

### Desktop
- **Ctrl+N**: New Game
- **Ctrl+R**: Restart Game
- **Ctrl+F**: Toggle Fast Mode
- **Ctrl+Z**: Rewind to last choice
- **F11**: Toggle Fullscreen

### Mobile
- **Tap choices** to make decisions
- **Swipe** to scroll through messages
- **Add to home screen** for app-like experience

## New Gameplay Elements

### Resource Management
- **Oxygen Level**: Decreases over time, critical below 20%
- **Power Level**: Affects systems, low power causes warnings
- **Stress Level**: Increases over time, affects character behavior
- **Trust Level**: Changes based on your choices

### Critical Events
- **Time-based events** that increase urgency
- **System failures** that require immediate action
- **Character stress** that affects decision-making

### Enhanced Choices
- **Safe choices**: Increase trust, lower stress
- **Urgent choices**: Decrease trust, increase stress
- **Technical choices**: Moderate trust increase

## Story

You are Commander Sarah Chen, a senior communications specialist at the Interstellar Emergency Response Center. When the research vessel Meridian loses contact with Earth near Europa, you must establish communication and guide the crew to safety through a series of critical decisions.

## Technical Details

- **Pure HTML/CSS/JavaScript** (web version)
- **Electron** (desktop app)
- **Progressive Web App** support
- **Mobile-responsive design**
- **Local storage** for game progress
- **Service worker** for offline functionality

## Development

### File Structure
```
space-rescue/
├── index.html          # Main game interface
├── styles.css          # Game styling
├── game.js             # Main game logic
├── gameEngine.js       # Game engine
├── story.js            # Story content
├── characters.js       # Character definitions
├── main.js             # Electron main process
├── package.json        # App configuration
├── manifest.json       # PWA manifest
├── assets/             # Images and icons
└── README.md           # This file
```

### Adding New Content
1. **Story branches**: Edit `story.js`
2. **Characters**: Edit `characters.js`
3. **Styling**: Edit `styles.css`
4. **Game logic**: Edit `gameEngine.js`

## Troubleshooting

### App won't start
- Check Node.js version: `node --version`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Build fails
- Ensure all dependencies are installed
- Check platform-specific requirements
- Verify file permissions

### Mobile issues
- Use HTTPS for PWA features
- Clear browser cache
- Try incognito mode

## License

MIT License - feel free to modify and distribute!

