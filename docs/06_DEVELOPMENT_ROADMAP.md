# River Islands App - Development Roadmap

## Overview

8-week MVP timeline for solo developer + AI assistance.
Working estimate: 15-20 hours/week = 120-160 total hours.

---

## Phase 1: Foundation (Week 1-2)

### Week 1: Project Setup & Auth

**Day 1-2: Environment Setup**
- [ ] Install Node.js, npm, Expo CLI
- [ ] Create Expo project with TypeScript template
- [ ] Set up Git repository
- [ ] Configure ESLint, Prettier
- [ ] Set up folder structure
- [ ] Install core dependencies

**Day 3-4: Supabase Setup**
- [ ] Create Supabase project
- [ ] Design and create database tables (profiles, categories)
- [ ] Set up Row Level Security policies
- [ ] Configure auth providers (Email, Google, Apple)
- [ ] Create storage buckets (avatars, images)
- [ ] Test connection from Expo app

**Day 5-7: Authentication Screens**
- [ ] Create Welcome/Splash screen
- [ ] Build Sign In screen (email/password)
- [ ] Build Sign Up screen
- [ ] Implement Email verification flow
- [ ] Add "Forgot Password" flow
- [ ] Integrate Google Sign-In
- [ ] Integrate Apple Sign-In
- [ ] Create auth context/provider
- [ ] Set up protected routes

### Week 2: Profiles & Onboarding

**Day 1-3: User Profiles**
- [ ] Create profile setup screen
- [ ] Implement avatar upload (camera + gallery)
- [ ] Build profile view screen
- [ ] Build profile edit screen
- [ ] Add neighborhood selection

**Day 4-5: Onboarding Flow**
- [ ] Create onboarding carousel (3 screens)
- [ ] Build interest selection screen
- [ ] Implement push notification permission request
- [ ] Store onboarding completion flag

**Day 6-7: Navigation**
- [ ] Set up Expo Router
- [ ] Create bottom tab navigator
- [ ] Build stack navigators for each tab
- [ ] Implement deep linking structure

**Milestone: Users can sign up, set up profile, navigate app**

---

## Phase 2: Community Feed (Week 3-4)

### Week 3: Posts Backend & List

**Day 1-2: Database & API**
- [ ] Create posts, comments, likes tables
- [ ] Set up RLS policies
- [ ] Create Supabase functions for feed queries
- [ ] Test CRUD operations

**Day 3-5: Feed UI**
- [ ] Build PostCard component
- [ ] Create feed list with infinite scroll
- [ ] Implement pull-to-refresh
- [ ] Add category filter chips
- [ ] Build empty state UI
- [ ] Add loading skeletons

**Day 6-7: Create Post**
- [ ] Build create post screen
- [ ] Implement image picker (multi-select)
- [ ] Add image upload to storage
- [ ] Category selection
- [ ] Post creation API integration

### Week 4: Interactions & Search

**Day 1-2: Like & Comment**
- [ ] Implement like/unlike functionality
- [ ] Build comments list UI
- [ ] Create comment composer
- [ ] Add reply functionality (nested)
- [ ] Optimistic updates for likes

**Day 3-4: Post Detail**
- [ ] Build post detail screen
- [ ] Full image gallery view
- [ ] Comments section
- [ ] Edit/delete own post
- [ ] Report post functionality

**Day 5-7: Search**
- [ ] Build search screen UI
- [ ] Implement full-text search
- [ ] Recent searches
- [ ] Search results display
- [ ] Search filters

**Milestone: Full community feed with posts, likes, comments, search**

---

## Phase 3: Marketplace (Week 5-6)

### Week 5: Listings

**Day 1-2: Database**
- [ ] Create listings table
- [ ] Create saved_listings table
- [ ] Set up RLS policies
- [ ] Seed marketplace categories

**Day 3-5: Browse Marketplace**
- [ ] Build marketplace home screen
- [ ] Grid layout for listings
- [ ] Category filter tabs
- [ ] Filter modal (price, condition)
- [ ] Sort options
- [ ] Infinite scroll pagination

**Day 6-7: Listing Detail**
- [ ] Build listing detail screen
- [ ] Image carousel/gallery
- [ ] Seller info section
- [ ] Save/favorite button
- [ ] Share functionality
- [ ] Report listing

### Week 6: Create & Manage

**Day 1-3: Create Listing**
- [ ] Build multi-step creation flow
- [ ] Photo upload (up to 6)
- [ ] Photo reorder/delete
- [ ] Category selection
- [ ] Condition picker
- [ ] Price input
- [ ] Location selection

**Day 4-5: My Listings**
- [ ] Build "My Listings" screen
- [ ] Edit listing
- [ ] Mark as sold/pending
- [ ] Delete listing
- [ ] Bump listing (24hr cooldown)

**Day 6-7: Saved Items**
- [ ] Build saved listings screen
- [ ] Save/unsave functionality
- [ ] Empty state

**Milestone: Full marketplace with create, browse, save, manage**

---

## Phase 4: Messaging & Notifications (Week 7)

### Week 7: Real-time Chat

**Day 1-2: Conversations**
- [ ] Create conversations, messages tables
- [ ] Set up RLS policies
- [ ] Build conversations list screen
- [ ] Display last message preview
- [ ] Unread indicator

**Day 3-5: Chat Screen**
- [ ] Build chat UI
- [ ] Real-time message subscription
- [ ] Send text messages
- [ ] Image messages
- [ ] Read receipts
- [ ] Message timestamps

**Day 6-7: Push Notifications**
- [ ] Set up Expo Push Notifications
- [ ] Create notification preferences
- [ ] Build notification center
- [ ] New message notifications
- [ ] Reply notifications
- [ ] Test end-to-end

**Milestone: Working messaging with real-time updates and push**

---

## Phase 5: Polish & Launch (Week 8)

### Week 8: Final Polish

**Day 1-2: Bug Fixes**
- [ ] Fix identified bugs
- [ ] Performance optimization
- [ ] Memory leak fixes
- [ ] Error handling improvements

**Day 3-4: App Store Prep**
- [ ] Create app icon (all sizes)
- [ ] Design splash screen
- [ ] Screenshot designs for store
- [ ] Write app description
- [ ] Privacy policy page
- [ ] Terms of service page

**Day 5-6: Build & Submit**
- [ ] Configure EAS Build
- [ ] Build iOS version
- [ ] Submit to App Store
- [ ] Build Android version
- [ ] Submit to Google Play

**Day 7: Launch Prep**
- [ ] Create landing page (optional)
- [ ] Prepare launch announcement
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics

**Milestone: Apps submitted to stores**

---

## Post-MVP Roadmap

### Month 3: Events & Polls
- Event creation and RSVP
- Calendar view
- Polls and voting

### Month 4: Service Directory
- Service provider listings
- Reviews and ratings
- Verified badges

### Month 5: Tool Sharing
- Lending library
- Borrow requests
- Return tracking

### Month 6+: Growth Features
- Private groups
- Address verification
- Admin dashboard
- Analytics improvements

---

## Development Best Practices

### Code Organization
```
src/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens
│   ├── (tabs)/            # Tab screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── posts/            # Post-related components
│   ├── marketplace/      # Listing components
│   └── common/           # Shared components
├── hooks/                # Custom hooks
├── lib/                  # Utilities
│   ├── supabase.ts      # Supabase client
│   ├── api/             # API functions
│   └── utils/           # Helper functions
├── stores/              # Zustand stores
├── types/               # TypeScript types
└── constants/           # App constants
```

### Git Workflow
- Main branch: production
- Develop branch: integration
- Feature branches: feature/xxx
- Commit often, push daily
- Use conventional commits (feat:, fix:, chore:)

### Testing Strategy
- Manual testing on simulators
- Test on real devices weekly
- Focus on happy paths for MVP
- Add automated tests post-MVP

### AI-Assisted Development Tips
1. Break tasks into small, clear prompts
2. Share error messages in full
3. Provide context about what you're building
4. Review AI code before committing
5. Use AI for boilerplate, review for logic
6. Ask AI to explain unfamiliar code

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Timeline slip | Cut P1 features, keep P0 scope |
| Auth complexity | Use Supabase Auth, avoid custom |
| Real-time issues | Start simple, add complexity |
| App store rejection | Follow guidelines strictly |
| Performance | Optimize images, paginate early |
| Solo burnout | Take breaks, sustainable pace |

---

## Launch Checklist

### Pre-Launch
- [ ] All P0 features working
- [ ] Tested on iOS and Android
- [ ] No critical bugs
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Error monitoring active
- [ ] Analytics configured

### App Store Submission
- [ ] App Store screenshots (6.5", 5.5")
- [ ] Play Store screenshots
- [ ] App description (short + full)
- [ ] Keywords/tags
- [ ] App icon (1024x1024)
- [ ] Feature graphic (Play Store)
- [ ] Age rating questionnaire
- [ ] Content rating

### Post-Launch
- [ ] Announce to River Islands community
- [ ] Monitor crash reports
- [ ] Gather user feedback
- [ ] Plan first update
