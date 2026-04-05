# Frontend — CLAUDE.md

React + TypeScript + Vite music player with a real-time queue via Socket.IO.

## Commands

```bash
npm run dev       # dev server with HMR
npm run build     # tsc + vite build → dist/
npm run lint      # ESLint
npm run preview   # preview production build
npm start         # serve dist/ on PORT
```

## Stack

- **React 19** + **TypeScript 5** (strict mode, noUnusedLocals/Parameters)
- **Vite 8** — bundler and dev server
- **Zustand 5** — state management
- **Socket.IO Client 4** — real-time communication with the backend
- **MUI 7** + **Emotion** — UI components and CSS-in-JS
- **SASS** — layout styles
- **react-i18next** — i18n (EN only)
- **@discord/embedded-app-sdk** — Discord Embedded App support

## `src/` Structure

```
components/
  enqueue/          # track enqueue form and card
  layout/           # Header, Footer
  overlays/         # side overlays (Player, History, Stickers)
    hooks/          # overlay-specific hooks
    stickers/       # sticker upload and display
    styles/         # Emotion styled components for overlays
    Aside.tsx       # navigation sidebar, controls overlay visibility
  player/           # audio player: PlayerCard, ProgressBar, VolumeControl
    hooks/
    styles/
  queue/            # queue display
    styles/
  ui/               # reusable: Button, Input, Badge, Spinner, IconButton
    styles/
contexts/           # ApiConfigContext, AudioContext
hooks/              # useAppInit, useAudioSync, useQueueSocket, useDiscord, ...
store/              # Zustand stores: appStore, playerStore, stickersStore
types/              # queue.ts, stickers.ts
lib/                # utilities (format.ts — duration formatting)
i18n/               # i18next config + en/translation.json
styles/             # global styles
App.tsx             # root component
GlobalTheme.tsx     # MUI theme + CSS variables
main.tsx            # entry point
```

## Architectural Patterns

### State (Zustand)

- `useAppStore` — global state: API config, Socket.IO instance, Discord SDK, popup visibility
- `usePlayerStore` — player state: queue, playback flags, volume, enqueue form
- `useStickersStore` — stickers array and placement mode flag

### Socket.IO

Initialized in `useAppInit`. Events:

| Emit | Listen |
|------|--------|
| `getState`, `togglePause`, `enqueue`, `next`, `clear` | `hello`, `state`, `progress`, `trackEnding`, `errorMessage`, `stickersUpdated` |

Discord mode uses polling instead of WebSocket.

### API Configuration

API origin is resolved from `VITE_API_BASE` or `window.location.origin`, passed down via `ApiConfigContext`. The `/api` path prefix is added automatically.

### Styling

- CSS variables (`--text`, `--bg`, `--card`, `--accent`, ...) in `GlobalTheme.tsx` — main theme
- MUI ThemeProvider — component-level styles
- Emotion — CSS-in-JS for custom components (colocated `styles/` folders)
- SCSS — layout-specific styles

### UI Structure

`Aside.tsx` controls switching between three overlays: Player, History, Stickers. Overlays are rendered conditionally based on flags in `appStore`.

## Environment Variables

```env
VITE_API_BASE=http://localhost:3000   # backend URL
VITE_DISCORD_CLIENT_ID=               # Discord App ID (optional)
```

## Gotchas

- TypeScript is strict: `noUnusedLocals: true`, `noUnusedParameters: true` — unused imports break the build
- ESLint 9 uses flat config (`eslint.config.js`) — do not use `.eslintrc`
- `npm run build` runs `tsc --noEmit` first — type errors block the build
- Discord Embedded App requires special Socket.IO transport handling in `useAppInit`
