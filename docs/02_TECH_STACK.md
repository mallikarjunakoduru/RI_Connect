# River Islands App - Tech Stack Decision

## Overview

This document outlines the technology choices optimized for:
- Solo developer + AI assistance
- $50-100/month budget
- 500-2000 users in Year 1
- 1-2 month MVP timeline
- Cross-platform (iOS + Android)

---

## Recommended Stack

### Frontend: React Native + Expo

**Choice:** Expo SDK 52+ with Expo Router

**Why Expo:**
- Single codebase for iOS and Android
- Over-the-air updates (no app store delay for bug fixes)
- Managed workflow reduces DevOps complexity
- Excellent documentation and community
- Built-in components for camera, notifications, etc.
- EAS Build for app store submissions

**Key Libraries:**
```
- expo-router (file-based navigation)
- @tanstack/react-query (data fetching/caching)
- zustand (lightweight state management)
- react-native-paper OR nativewind (UI components)
- expo-notifications (push notifications)
- expo-image-picker (photos for marketplace)
- react-hook-form + zod (form validation)
```

**Alternative Considered:** Flutter
- Pros: Better performance, growing ecosystem
- Cons: Dart learning curve, smaller job market
- Verdict: React Native better for JS/TS intermediate devs

---

### Backend: Supabase (Backend-as-a-Service)

**Choice:** Supabase (hosted PostgreSQL + Auth + Storage + Realtime)

**Why Supabase:**
- PostgreSQL database (industry standard, scalable)
- Built-in authentication (email, Google, Apple Sign-In)
- Row-level security (fine-grained permissions)
- Real-time subscriptions (live updates)
- Storage for images/files
- Edge Functions for custom logic
- Generous free tier, predictable pricing
- Can self-host later if needed
- SQL-based (transferable skills)

**Pricing Estimate:**
- Free tier: 500MB database, 1GB storage, 2GB bandwidth
- Pro tier ($25/mo): 8GB database, 100GB storage, 250GB bandwidth
- Likely need Pro tier for 500-2000 users = **$25/month**

**Alternative Considered:** Firebase
- Pros: More mature, better offline support
- Cons: NoSQL (harder queries), vendor lock-in, higher costs at scale
- Verdict: Supabase more cost-effective and SQL-portable

---

### Additional Services

#### Push Notifications: Expo Push + Supabase Edge Functions
- Free tier covers our scale
- No additional service needed

#### Image Storage: Supabase Storage
- Included in Supabase plan
- CDN for fast image loading

#### Search: PostgreSQL Full-Text Search
- Built into Supabase
- No additional service needed initially
- Can add Algolia/Typesense later if needed

#### Analytics: PostHog (Self-hosted) or Mixpanel Free
- PostHog: Free self-hosted, or free cloud (1M events/mo)
- Mixpanel: Free tier (20M events/mo)
- **Choice:** Mixpanel free tier for simplicity

#### Error Tracking: Sentry
- Free tier: 5K errors/month
- Essential for production debugging

#### Email: Resend
- Free tier: 3K emails/month
- For transactional emails (verification, notifications)
- **Cost:** Free initially, $20/mo if exceeds

---

## Development Tools

### Language: TypeScript
- Type safety reduces bugs
- Better IDE support
- Shared types between frontend and database

### Code Quality
```
- ESLint + Prettier (code formatting)
- Husky (pre-commit hooks)
- TypeScript strict mode
```

### Version Control: GitHub
- Free for public/private repos
- GitHub Actions for CI/CD (2,000 minutes/month free)

### IDE: VS Code + Claude Code
- AI-assisted development
- Excellent React Native support

---

## Deployment & Hosting

### Mobile App: Expo Application Services (EAS)
- EAS Build: Cloud builds for iOS/Android
- EAS Submit: Automated app store submission
- EAS Update: Over-the-air updates
- **Cost:** Free tier (30 builds/month), or $15/mo for more

### Backend: Supabase Cloud
- Fully managed, no server maintenance
- Auto-scaling included
- **Cost:** $25/month (Pro tier)

### Admin Dashboard (Future): Vercel
- For web-based admin panel
- Free tier sufficient
- **Cost:** $0

---

## Monthly Cost Estimate

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Supabase Pro | - | $25/month |
| EAS Build | 30 builds/mo | $0-15/month |
| Expo Push | Unlimited | $0 |
| Sentry | 5K errors | $0 |
| Mixpanel | 20M events | $0 |
| Resend | 3K emails | $0-20/month |
| Apple Developer | Annual | $8.25/month ($99/yr) |
| Google Play | One-time | $2.08/month ($25 one-time) |
| **TOTAL** | | **$35-70/month** |

*Well within $50-100 budget with room for growth*

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     RIVER ISLANDS APP                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   iOS App   │    │ Android App │    │ Admin Web   │     │
│  │  (Expo)     │    │   (Expo)    │    │  (Future)   │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SUPABASE (Backend)                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │   Auth   │  │ Realtime │  │  Edge Functions  │  │   │
│  │  │ (Users)  │  │  (Live)  │  │  (Custom Logic)  │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │ Database │  │ Storage  │  │   Row-Level      │  │   │
│  │  │(Postgres)│  │ (Images) │  │   Security       │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Why This Stack Works for Solo + AI Development

1. **Reduced Complexity**: Supabase handles auth, database, storage, realtime
2. **Type Safety**: TypeScript catches errors before runtime
3. **AI-Friendly**: React Native and Supabase are well-documented
4. **Fast Iteration**: Expo hot reload, OTA updates
5. **Scalable**: PostgreSQL scales to millions of rows
6. **Cost-Effective**: Generous free tiers, predictable pricing
7. **Portable**: No vendor lock-in, can self-host Supabase
8. **Community Support**: Large ecosystems for troubleshooting

---

## Learning Resources

### React Native + Expo
- [Expo Documentation](https://docs.expo.dev)
- [React Native Express](https://www.reactnative.express)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Supabase + React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
