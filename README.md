# Musio — Music Streaming App Clone
### Expo SDK 56 · Expo Router · React Native StyleSheet (no NativeWind/Tailwind)

A fully serverless, offline-mock music streaming app: Home, Explore, Library,
and Upgrade tabs, a persistent global mini-player, a full-screen Now Playing
modal (Up Next / Lyrics / Related), and a live search experience — all driven
by a single local `data/mockData.js` file.

---

## 1. Create the project

```bash
npx create-expo-app@latest musio --template blank
cd musio
```

Copy every file from this package into the new project root (overwriting
`App.js`/`app.json` — this project uses `expo-router`, so there is no
`App.js` entry file; `app/_layout.js` is the root).

## 2. Install dependencies (Expo SDK 56 compliant)

```bash
npx expo install expo-router expo-av expo-status-bar expo-constants expo-linking expo-splash-screen
npx expo install react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npm install @expo/vector-icons
```

Then let Expo resolve every package to the exact patch version compatible
with SDK 56:

```bash
npx expo install --fix
```

## 3. Babel config

Confirm `babel.config.js` matches the one provided (registers
`babel-preset-expo` + the Reanimated plugin, which must be listed last).

## 4. Entry point

`package.json` already points `"main"` at `"expo-router/entry"` — no manual
`App.js` registration needed.

## 5. Run

```bash
npx expo start
```

---

## File structure

```
musio/
├── app.json
├── babel.config.js
├── package.json
├── app/
│   ├── _layout.js              # Root stack: tabs + player/search modals
│   ├── player.js                # Full-screen Now Playing modal
│   ├── search.js                # Search modal
│   └── (tabs)/
│       ├── _layout.js           # Bottom tabs + persistent MiniPlayer
│       ├── index.js             # Home
│       ├── explore.js           # Explore
│       ├── library.js           # Library
│       └── upgrade.js           # Upgrade / Premium (static)
├── components/
│   ├── AlbumCard.js
│   ├── MarqueeText.js
│   ├── MiniPlayer.js
│   ├── PillFilters.js
│   ├── ProgressSlider.js
│   ├── SectionHeader.js
│   └── TrackRow.js
├── context/
│   └── MusicPlayerContext.js    # Global playback state (Context + hooks)
├── constants/
│   └── theme.js                 # Colors, spacing, radii, type scale
└── data/
    └── mockData.js               # Songs, albums, artists, playlists, charts,
                                    # moods, lyrics, recent searches
```

## Notes on playback

`MusicPlayerContext` is wired to `expo-av`'s `Audio.Sound`. Because the mock
dataset ships without bundled audio files (`audioUrl: null`), the context
falls back to a local timer that advances `playbackProgress` so the whole UI
(mini-player progress bar, full-screen seek bar, Up Next auto-advance) is
fully interactive out of the box. Drop a real hosted URL or `require()`
asset into any track's `audioUrl` field in `data/mockData.js` and the
context will automatically play real audio through `expo-av` instead.

## Design reference

Layout, spacing, and card proportions follow the attached reference
screenshots — white background, bold black type, colorful square artwork,
pill-style filter chips, and a black circular play/pause button with a
draggable progress scrubber on the full-screen player.
