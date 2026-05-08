# River Islands App - UI/UX Design

## Design Principles

1. **Community-First**: Warm, welcoming colors that feel local
2. **Simplicity**: Clean UI, minimal learning curve
3. **Familiar**: Borrow UX patterns from WhatsApp, Facebook Groups, OfferUp
4. **Accessible**: Large touch targets, readable fonts, good contrast

---

## Brand Identity

### App Name
**River Islands Connect** (or "RI Connect" for short)

### Color Palette
```
Primary:     #2563EB (River Blue)
Secondary:   #10B981 (Community Green)
Accent:      #F59E0B (Warm Amber)
Background:  #F8FAFC (Light Gray)
Surface:     #FFFFFF (White)
Text:        #1E293B (Slate 800)
Text Muted:  #64748B (Slate 500)
Error:       #EF4444 (Red)
Success:     #22C55E (Green)
```

### Typography
- Headers: SF Pro Display (iOS) / Roboto (Android) - Bold
- Body: SF Pro Text / Roboto - Regular
- Sizes: 14px body, 16px emphasis, 20px subhead, 24px title

---

## App Structure

### Bottom Tab Navigation
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Screen Content]                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│   🏠        🛒        ✏️        💬        👤           │
│  Home   Marketplace  Post    Messages  Profile         │
└─────────────────────────────────────────────────────────┘
```

---

## Screen Wireframes

### 1. Splash Screen
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│           🏘️                           │
│                                         │
│      River Islands Connect              │
│                                         │
│      Your Community Hub                 │
│                                         │
│                                         │
│         [Loading spinner]               │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Onboarding (3 screens)
```
Screen 1:                    Screen 2:                    Screen 3:
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │     │                     │
│    [Illustration]   │     │    [Illustration]   │     │    [Illustration]   │
│                     │     │                     │     │                     │
│  Stay Connected     │     │  Buy, Sell, Share   │     │  Find Services      │
│                     │     │                     │     │                     │
│  Join discussions,  │     │  Local marketplace  │     │  Trusted handymen,  │
│  events, and more   │     │  for your community │     │  tutors & more      │
│  with neighbors     │     │                     │     │                     │
│                     │     │                     │     │                     │
│  ● ○ ○              │     │  ○ ● ○              │     │  ○ ○ ●              │
│                     │     │                     │     │                     │
│  [Skip]    [Next →] │     │  [Skip]    [Next →] │     │    [Get Started]    │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### 3. Sign Up / Sign In
```
┌─────────────────────────────────────────┐
│  ←                                      │
│                                         │
│         🏘️ River Islands Connect       │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📧 Email                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔒 Password                       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         Sign In                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│           Forgot Password?              │
│                                         │
│  ──────────── or ────────────          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🍎  Continue with Apple          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  G   Continue with Google         │  │
│  └───────────────────────────────────┘  │
│                                         │
│     Don't have an account? Sign Up      │
│                                         │
└─────────────────────────────────────────┘
```

### 4. Home Feed
```
┌─────────────────────────────────────────┐
│  River Islands         🔔 (3)    🔍     │
├─────────────────────────────────────────┤
│ [All] [📢] [🎉] [🏫] [📚] [⚽] [👶] → │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Sarah M.    · 2h       │   │
│  │          @Lakeside              │   │
│  │                                 │   │
│  │ Anyone know a good piano       │   │
│  │ teacher for beginners? My son  │   │
│  │ is 7 and wants to start...     │   │
│  │                                 │   │
│  │ 📚 Tutoring                     │   │
│  │                                 │   │
│  │ ♡ 12    💬 8    ↗ Share        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Mike T.    · 5h  📌   │   │
│  │          @River Pointe          │   │
│  │                                 │   │
│  │ 🎉 Community BBQ this Saturday! │   │
│  │                                 │   │
│  │ [Image: BBQ flyer]              │   │
│  │                                 │   │
│  │ 🎉 Events                       │   │
│  │                                 │   │
│  │ ♡ 45    💬 23    ↗ Share       │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🛒       ✏️      💬      👤   │
└─────────────────────────────────────────┘
```

### 5. Create Post
```
┌─────────────────────────────────────────┐
│  ✕  New Post                    Post    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Arjun K.               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │ What's on your mind?            │   │
│  │                                 │   │
│  │                                 │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Category:                              │
│  [💬 General ▼]                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📷      🔗      📍             │   │
│  │ Photo   Link   Location         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 6. Marketplace - Browse
```
┌─────────────────────────────────────────┐
│  Marketplace                      🔍    │
├─────────────────────────────────────────┤
│ [All] [For Sale] [Free] [Wanted] [Svcs]│
├─────────────────────────────────────────┤
│ Categories:                             │
│ [🛋️][📱][👶][⚽][👕][🚗][🎁][🔧]     │
├─────────────────────────────────────────┤
│                                         │
│ ┌───────────┐  ┌───────────┐           │
│ │ [Image]   │  │ [Image]   │           │
│ │           │  │           │           │
│ │ Kids Bike │  │ FREE Sofa │           │
│ │ $45       │  │ FREE      │           │
│ │ Lakeside  │  │ River Pt  │           │
│ └───────────┘  └───────────┘           │
│                                         │
│ ┌───────────┐  ┌───────────┐           │
│ │ [Image]   │  │ [Image]   │           │
│ │           │  │           │           │
│ │ PS5 Ctrl  │  │ Lawn Mow  │           │
│ │ $35       │  │ Service   │           │
│ │ Downtown  │  │ $40/hr    │           │
│ └───────────┘  └───────────┘           │
│                                         │
│           [+ Sell Something]            │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🛒       ✏️      💬      👤   │
└─────────────────────────────────────────┘
```

### 7. Listing Detail
```
┌─────────────────────────────────────────┐
│  ←                         ♡    ↗      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         [Image Gallery]         │   │
│  │                                 │   │
│  │     ●  ○  ○  ○                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Kids Bicycle - 16"                     │
│  $45  ·  Like New                       │
│                                         │
│  ──────────────────────────────────    │
│                                         │
│  Great condition, barely used.          │
│  Includes training wheels and           │
│  helmet. Perfect for ages 4-6.          │
│                                         │
│  📍 Lakeside neighborhood               │
│  📅 Listed 2 days ago                   │
│                                         │
│  ──────────────────────────────────    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Jessica M.             │   │
│  │          Member since 2024      │   │
│  │          ★★★★★ (12 reviews)     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      💬  Message Seller         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 8. Messages List
```
┌─────────────────────────────────────────┐
│  Messages                               │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Sarah M.        · 2m   │   │
│  │          ● Kids Bike            │   │
│  │ Is this still available?        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Mike T.        · 1h    │   │
│  │          BBQ Event              │   │
│  │ Thanks! See you Saturday        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Avatar] Jennifer L.    · 3h    │   │
│  │ Can you recommend the piano...  │   │
│  └─────────────────────────────────┘   │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🛒       ✏️      💬      👤   │
└─────────────────────────────────────────┘
```

### 9. Chat Screen
```
┌─────────────────────────────────────────┐
│  ←  Sarah M.                    ⋯      │
│      Re: Kids Bike ($45)               │
├─────────────────────────────────────────┤
│                                         │
│            Today, 2:30 PM               │
│                                         │
│                 ┌──────────────────┐   │
│                 │ Hi! Is this      │   │
│                 │ still available? │   │
│                 └──────────────────┘   │
│                              2:30 PM ✓✓│
│                                         │
│ ┌──────────────────┐                   │
│ │ Yes it is! Would │                   │
│ │ you like to see  │                   │
│ │ it today?        │                   │
│ └──────────────────┘                   │
│ 2:32 PM                                │
│                                         │
│                 ┌──────────────────┐   │
│                 │ That would be    │   │
│                 │ great! What time │   │
│                 │ works for you?   │   │
│                 └──────────────────┘   │
│                              2:35 PM ✓✓│
│                                         │
├─────────────────────────────────────────┤
│ ┌────────────────────────────┐  📷  ➤ │
│ │ Type a message...          │        │
│ └────────────────────────────┘        │
└─────────────────────────────────────────┘
```

### 10. Profile
```
┌─────────────────────────────────────────┐
│  Profile                         ⚙️     │
├─────────────────────────────────────────┤
│                                         │
│         ┌───────────┐                   │
│         │  [Avatar] │                   │
│         │    📷     │                   │
│         └───────────┘                   │
│                                         │
│         Arjun Koduru                    │
│         @Lakeside · Member since 2024   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 12 Posts  │  5 Listings  │  ★4.9│   │
│  └─────────────────────────────────┘   │
│                                         │
│  Bio: River Islands resident.           │
│  Love building apps and community!      │
│                            [Edit]       │
│                                         │
│  ──────────────────────────────────    │
│                                         │
│  📝  My Posts                      →   │
│  🛒  My Listings                   →   │
│  ♡   Saved Items                   →   │
│  🔔  Notification Settings         →   │
│  🔒  Privacy & Security            →   │
│  ❓  Help & Support                →   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Sign Out                │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      🛒       ✏️      💬      👤   │
└─────────────────────────────────────────┘
```

### 11. Notifications
```
┌─────────────────────────────────────────┐
│  ←  Notifications           Mark All ✓  │
├─────────────────────────────────────────┤
│                                         │
│  Today                                  │
│  ┌─────────────────────────────────┐   │
│  │ 💬 Sarah M. sent you a message  │   │
│  │    "Is this still available?"   │   │
│  │    2 minutes ago                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ♡  Mike T. liked your post      │   │
│  │    "Piano teacher for beginners"│   │
│  │    1 hour ago                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Yesterday                              │
│  ┌─────────────────────────────────┐   │
│  │ 💬 Jennifer replied to your     │   │
│  │    post about piano teachers    │   │
│  │    "I highly recommend..."      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📢 Community Announcement       │   │
│  │    "HOA Meeting this Thursday"  │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Component Library

### Buttons
```
Primary:    [████████████]  Blue filled, white text
Secondary:  [────────────]  Blue outline, blue text  
Tertiary:   [  Link Text  ]  Blue text only
Danger:     [████████████]  Red filled, white text
Disabled:   [░░░░░░░░░░░░]  Gray filled, gray text
```

### Input Fields
```
Default:    ┌─────────────────────┐
            │ Placeholder text    │
            └─────────────────────┘

Focused:    ┌─────────────────────┐  <- Blue border
            │ User typing...      │
            └─────────────────────┘

Error:      ┌─────────────────────┐  <- Red border
            │ Invalid input       │
            └─────────────────────┘
            ⚠️ Error message here
```

### Cards
```
Post Card:      Shadow, rounded corners (8px)
Listing Card:   Shadow, rounded corners (12px), image top
Message Bubble: Rounded (16px), right=blue, left=gray
```

### Icons
Use consistent icon set (Lucide, Feather, or SF Symbols)

---

## User Flows

### 1. New User Registration
```
Splash → Onboarding (3 screens) → Sign Up → Email Verification → 
Profile Setup → Interest Selection → Enable Notifications → Home Feed
```

### 2. Create Marketplace Listing
```
Marketplace Tab → "Sell Something" → Add Photos → Title/Description → 
Set Price → Choose Category → Select Condition → Set Location → Post
```

### 3. Respond to Listing
```
Listing Detail → "Message Seller" → Type Message → Send → 
Chat Screen → Arrange Meetup
```

### 4. Browse & Interact with Posts
```
Home Feed → Scroll → Read Post → Like/Comment → 
Or tap Category Filter → Filtered Feed
```
