# River Islands Connect - Mobile App

React Native + Expo app for the River Islands community.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Add your Supabase URL and anon key to `.env`

### 3. Create Database Tables
Run the SQL from `../docs/04_DATABASE_SCHEMA.md` in your Supabase SQL Editor.

### 4. Start Development
```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go on your phone

## Project Structure

```
app/
├── (auth)/          # Auth screens (sign-in, sign-up, forgot-password)
├── (tabs)/          # Main tab screens (home, marketplace, create, messages, profile)
├── _layout.tsx      # Root layout with auth flow
└── onboarding.tsx   # New user onboarding

src/
├── components/ui/   # Reusable UI components (Button, Input, Avatar)
├── constants/       # Colors, categories, config
├── hooks/           # Custom hooks (useAuth)
├── lib/             # Supabase client
├── stores/          # Zustand stores (authStore)
└── types/           # TypeScript definitions
```

## Available Scripts

```bash
npm start         # Start Expo dev server
npm run ios       # Run on iOS simulator
npm run android   # Run on Android emulator
npm run web       # Run in browser
```

## Features Implemented

- [x] Project structure
- [x] Navigation (Expo Router)
- [x] Auth screens (sign-in, sign-up, forgot-password)
- [x] Tab navigation (5 tabs)
- [x] UI components (Button, Input, Avatar)
- [x] Supabase client setup
- [x] Auth state management (Zustand)
- [x] Onboarding flow
- [ ] Connect to Supabase (requires your project)
- [ ] Community feed with posts
- [ ] Marketplace listings
- [ ] Direct messaging
- [ ] Push notifications

## Next Steps

1. Create Supabase project and run database migrations
2. Add `.env` with your Supabase credentials
3. Test auth flow
4. Build out post and listing features
