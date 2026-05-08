# River Islands App - Feature Specification

## Feature Prioritization

Features are organized by priority:
- **P0 (MVP)**: Must have for launch (Month 1-2)
- **P1 (Post-MVP)**: Important, build next (Month 3-4)
- **P2 (Growth)**: Nice to have (Month 5+)

---

## P0: MVP Features (Month 1-2)

### 1. Authentication & User Management

#### 1.1 Sign Up / Sign In
- Email + password registration
- Google Sign-In (one tap)
- Apple Sign-In (required for iOS)
- Email verification
- Password reset flow
- Remember me / auto-login

#### 1.2 User Profile
- Display name
- Profile photo
- Neighborhood/street (optional)
- Bio (optional)
- Contact preferences (in-app only vs email notifications)

#### 1.3 Onboarding Flow
- Welcome screens explaining app features
- Profile setup wizard
- Interest selection (which categories to follow)
- Push notification permission request

---

### 2. Community Feed

#### 2.1 Categories/Channels
Pre-configured channels:
| Channel | Description |
|---------|-------------|
| 📢 Announcements | Official community news |
| 🎉 Events | Community events and gatherings |
| 🏫 Schools | School-related discussions |
| 📚 Tutoring | Tutoring services and requests |
| ⚽ Activities | Sports, clubs, extra-curricular |
| 👶 Parenting | Tips, playdates, recommendations |
| 🏠 HOA & Neighborhood | HOA updates, neighborhood issues |
| 💬 General | Everything else |

#### 2.2 Posts
- Create text posts with optional images (up to 4)
- Assign to one or more categories
- Edit/delete own posts
- Character limit: 2000 characters
- Link preview (auto-fetch title/image)

#### 2.3 Interactions
- Like posts (heart reaction)
- Comment on posts
- Nested replies (1 level deep)
- Share post link
- Report inappropriate content
- Save/bookmark posts

#### 2.4 Feed Features
- Chronological feed (default)
- Filter by category
- Pull-to-refresh
- Infinite scroll pagination
- Search posts (title, content)

---

### 3. Marketplace

#### 3.1 Listings
- Title, description, price
- Category: For Sale, Free, Wanted, Services
- Up to 6 photos
- Condition: New, Like New, Good, Fair
- Location: Pickup area (neighborhood level)
- Status: Available, Pending, Sold

#### 3.2 Categories
- Furniture & Home
- Electronics
- Kids & Baby
- Sports & Outdoors
- Clothing
- Vehicles (bikes, cars)
- Free Items
- Services Offered
- Wanted

#### 3.3 Interactions
- In-app messaging for inquiries
- Mark as sold
- Bump listing (once per 24 hours)
- Report listing
- Save/favorite listings

#### 3.4 Browsing
- Grid view with thumbnails
- Filter by category, price range, condition
- Sort by: Newest, Price Low/High
- Search by keyword

---

### 4. Messaging

#### 4.1 Direct Messages
- One-on-one private messaging
- Text messages
- Share images
- Real-time delivery with read receipts
- Message history

#### 4.2 Notifications
- New message badge
- Push notification for new messages
- Mute conversations

---

### 5. Notifications

#### 5.1 Push Notifications
- New messages
- Replies to your posts
- New posts in followed categories (opt-in)
- Important announcements

#### 5.2 In-App Notifications
- Notification center/inbox
- Mark as read
- Clear all

#### 5.3 Preferences
- Toggle notifications by type
- Quiet hours setting

---

### 6. Search

- Global search bar
- Search posts, marketplace listings, users
- Recent searches
- Search filters

---

## P1: Post-MVP Features (Month 3-4)

### 7. Events

#### 7.1 Event Creation
- Title, description, date/time
- Location (address or "Online")
- Cover image
- Capacity limit (optional)
- Recurring events
- Event categories (Sports, Social, Kids, etc.)

#### 7.2 Event Interactions
- RSVP: Going, Maybe, Not Going
- See attendee list
- Add to device calendar
- Set reminder
- Comments/discussion

#### 7.3 Event Discovery
- Calendar view
- List view by date
- Filter by category
- "Happening this week" section

---

### 8. Service Directory

#### 8.1 Provider Listings
- Business/individual name
- Service category
- Description
- Contact info (in-app message, phone, email)
- Service area
- Photos of work

#### 8.2 Categories
- Handyman & Repairs
- Landscaping & Gardening
- Cleaning Services
- Tutoring & Education
- Childcare & Babysitting
- Pet Services
- Fitness & Coaching
- Beauty & Wellness
- Professional Services

#### 8.3 Reviews & Ratings
- 1-5 star rating
- Written review
- Review photos
- Helpful votes
- Provider response

#### 8.4 Discovery
- Browse by category
- Search by service type
- Sort by rating, reviews
- Filter by verified

---

### 9. Polls & Surveys

#### 9.1 Create Poll
- Question text
- Multiple choice options (2-6)
- Single or multi-select
- Anonymous or public voting
- End date
- Results visibility (after voting vs live)

#### 9.2 Poll Features
- Vote
- See results (percentage, count)
- Comments on poll
- Share poll

---

### 10. Tool & Item Sharing

#### 10.1 Lending Library
- List items available to lend
- Categories: Tools, Kitchen, Party Supplies, Sports, etc.
- Photos
- Lending terms (duration, deposit)
- Availability status

#### 10.2 Borrowing Flow
- Request to borrow
- Owner approval
- Pickup arrangement (via messaging)
- Return confirmation
- Rating after return

---

## P2: Growth Features (Month 5+)

### 11. Groups/Sub-Communities

- Create private groups (book club, sports team)
- Group posts visible only to members
- Group admin/moderation
- Invite members

### 12. Verified Residents

- Optional address verification
- Verified badge on profile
- Access to residents-only features

### 13. Local Business Directory

- Sponsored listings for local businesses
- Business profiles with hours, menu, etc.
- Check-in deals

### 14. Emergency Alerts

- Integration with local emergency services
- Community watch alerts
- Lost pet alerts with photos

### 15. Community Resources

- Document library (HOA docs, maps)
- FAQ/Wiki
- New resident guide

### 16. Gamification

- Points for engagement
- Badges (helpful neighbor, event organizer)
- Leaderboard (optional)

### 17. Admin Dashboard (Web)

- User management
- Content moderation queue
- Analytics dashboard
- Announcement broadcasting
- Report management

---

## Feature Matrix Summary

| Feature | P0 MVP | P1 | P2 |
|---------|--------|----|----|
| Auth (Email, Google, Apple) | ✅ | | |
| User Profiles | ✅ | | |
| Community Feed | ✅ | | |
| Categories/Channels | ✅ | | |
| Marketplace | ✅ | | |
| Direct Messaging | ✅ | | |
| Push Notifications | ✅ | | |
| Search | ✅ | | |
| Events & Calendar | | ✅ | |
| Service Directory | | ✅ | |
| Polls | | ✅ | |
| Tool Sharing | | ✅ | |
| Private Groups | | | ✅ |
| Verified Residents | | | ✅ |
| Business Directory | | | ✅ |
| Emergency Alerts | | | ✅ |
| Admin Dashboard | | | ✅ |

---

## MVP Scope Summary

**In Scope (Build First):**
1. Auth with email/Google/Apple
2. User profiles
3. Community feed with categories
4. Marketplace with listings
5. Direct messaging
6. Push notifications
7. Basic search

**Out of Scope (Build Later):**
- Events calendar (P1)
- Service directory with reviews (P1)
- Polls (P1)
- Tool sharing (P1)
- Groups, verification, admin tools (P2)

This scoped MVP is achievable in 1-2 months for a solo developer with AI assistance.
