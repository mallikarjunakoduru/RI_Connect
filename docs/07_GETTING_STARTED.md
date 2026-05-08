# River Islands App - Getting Started Guide

## Prerequisites

Before starting, ensure you have:

### Required Accounts
- [ ] **GitHub** - [github.com](https://github.com) (free)
- [ ] **Supabase** - [supabase.com](https://supabase.com) (free tier)
- [ ] **Expo** - [expo.dev](https://expo.dev) (free tier)
- [ ] **Apple Developer** - [developer.apple.com](https://developer.apple.com) ($99/year)
- [ ] **Google Play Console** - [play.google.com/console](https://play.google.com/console) ($25 one-time)

### Required Software
- [ ] **Node.js 18+** - [nodejs.org](https://nodejs.org)
- [ ] **VS Code** - [code.visualstudio.com](https://code.visualstudio.com)
- [ ] **Git** - [git-scm.com](https://git-scm.com)
- [ ] **Xcode** (Mac only, for iOS) - App Store
- [ ] **Android Studio** (for Android emulator) - [developer.android.com/studio](https://developer.android.com/studio)
- [ ] **Expo Go** app on your phone - App Store / Play Store

---

## Step 1: Create Expo Project

```bash
# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Create new project with Expo Router template
npx create-expo-app@latest river-islands --template tabs

# Navigate to project
cd river-islands

# Install additional dependencies
npx expo install @supabase/supabase-js
npx expo install expo-secure-store
npx expo install @react-native-async-storage/async-storage
npx expo install expo-image-picker
npx expo install expo-notifications
npx expo install expo-apple-authentication
npx expo install @react-native-google-signin/google-signin
npx expo install react-native-safe-area-context

# UI and utilities
npm install @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install lucide-react-native react-native-svg

# Development dependencies
npm install -D @types/react @types/react-native
```

---

## Step 2: Set Up Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Name: `river-islands`
4. Generate a strong database password (save it!)
5. Select region closest to users (us-west-1 for California)
6. Click "Create new project"

### Get API Keys
1. Go to Settings → API
2. Copy:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Create `.env` file
```bash
# Create .env file in project root
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Initialize Database
1. Go to SQL Editor in Supabase dashboard
2. Copy the schema from `04_DATABASE_SCHEMA.md`
3. Run each CREATE TABLE statement
4. Run the seed data for categories

### Configure Auth
1. Go to Authentication → Providers
2. Enable:
   - Email (enable email confirmations)
   - Google (need OAuth credentials from Google Cloud Console)
   - Apple (need to configure in Apple Developer account)

---

## Step 3: Project Structure

Create this folder structure:

```
river-islands/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Auth group (not in tabs)
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   ├── forgot-password.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Home/Feed
│   │   ├── marketplace/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── create.tsx           # Create post/listing
│   │   ├── messages/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── profile/
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       └── edit.tsx
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry redirect
├── src/
│   ├── components/
│   │   ├── ui/                  # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Avatar.tsx
│   │   ├── posts/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── CommentItem.tsx
│   │   ├── marketplace/
│   │   │   ├── ListingCard.tsx
│   │   │   └── ListingGrid.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   ├── useListings.ts
│   │   └── useMessages.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── api/
│   │   │   ├── posts.ts
│   │   │   ├── listings.ts
│   │   │   └── messages.ts
│   │   └── utils/
│   │       ├── formatting.ts
│   │       └── validation.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── notificationStore.ts
│   ├── types/
│   │   ├── database.ts          # Generated from Supabase
│   │   └── index.ts
│   └── constants/
│       ├── colors.ts
│       └── categories.ts
├── assets/
│   ├── images/
│   └── fonts/
├── .env
├── app.json
├── package.json
└── tsconfig.json
```

---

## Step 4: Initialize Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Step 5: First Run

```bash
# Start development server
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go on your phone
```

---

## Development Commands

```bash
# Start dev server
npx expo start

# Start with cache clear
npx expo start -c

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Generate Supabase types
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts

# Build for app stores
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android

# Over-the-air update
eas update --branch production
```

---

## Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
- TypeScript Importer
- GitLens
- Error Lens
- Expo Tools

---

## Helpful Resources

### Documentation
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)

### Tutorials
- [Supabase + React Native Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Expo Router Tutorial](https://docs.expo.dev/router/introduction/)

### Communities
- [Expo Discord](https://chat.expo.dev)
- [Supabase Discord](https://discord.supabase.com)
- [React Native Community](https://reactnative.dev/community/overview)

---

## Next Steps

1. Complete environment setup (this document)
2. Create Supabase project and database schema
3. Build authentication screens
4. Start with Week 1 tasks in Development Roadmap

When you're ready to start coding, open `06_DEVELOPMENT_ROADMAP.md` and begin with Week 1, Day 1 tasks!
