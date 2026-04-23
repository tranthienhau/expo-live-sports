# expo-live-sports

React Native + Expo + TypeScript live football score app. Match list with live/upcoming/finished tabs, league filter, real-time minute counter, match detail with events and stats.

## Stack
- React Native + Expo + TypeScript
- Zustand (state management)
- Expo Router (navigation)
- Auto-refreshing live score simulation (polling)
- Clean Architecture

## Features
- Live/upcoming/finished match list
- League filter tabs (EPL, La Liga, Bundesliga, etc.)
- Real-time live match minute counter (auto-updates)
- Match detail: score, events (goals, cards), stats
- Pull-to-refresh
- iOS + Android

## API Integration
Replace mock data in `sportsStore.ts` with any football API (e.g. API-Football, SportMonks). Store handles polling interval automatically.

## Run
```
npm install
npx expo start
```
