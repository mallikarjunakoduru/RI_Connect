# River Islands App - Database Schema

## Overview

PostgreSQL database hosted on Supabase with Row-Level Security (RLS) enabled.

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    posts     │       │  categories  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │    ┌──│ id (PK)      │
│ email        │  │    │ author_id(FK)│◄───┘  │ name         │
│ display_name │  │    │ content      │       │ slug         │
│ avatar_url   │  │    │ images[]     │       │ icon         │
│ bio          │  └───►│ created_at   │       │ order        │
│ neighborhood │       │ updated_at   │       └──────────────┘
│ created_at   │       └──────┬───────┘
└──────┬───────┘              │
       │                      │
       │       ┌──────────────┴───────────────┐
       │       │                              │
       │       ▼                              ▼
       │  ┌──────────────┐           ┌──────────────────┐
       │  │   comments   │           │  post_categories │
       │  ├──────────────┤           ├──────────────────┤
       │  │ id (PK)      │           │ post_id (FK)     │
       │  │ post_id (FK) │           │ category_id (FK) │
       │  │ author_id(FK)│           └──────────────────┘
       │  │ parent_id    │
       │  │ content      │
       │  └──────────────┘
       │
       │  ┌──────────────┐       ┌──────────────┐
       │  │  listings    │       │ listing_imgs │
       │  ├──────────────┤       ├──────────────┤
       │  │ id (PK)      │◄──────│ listing_id   │
       └─►│ seller_id(FK)│       │ image_url    │
          │ title        │       │ order        │
          │ description  │       └──────────────┘
          │ price        │
          │ category     │
          │ condition    │
          │ status       │
          └──────────────┘

       ┌──────────────┐       ┌──────────────┐
       │conversations │       │   messages   │
       ├──────────────┤       ├──────────────┤
       │ id (PK)      │◄──────│ conv_id (FK) │
       │ participant1 │       │ sender_id    │
       │ participant2 │       │ content      │
       │ last_message │       │ created_at   │
       │ updated_at   │       │ read_at      │
       └──────────────┘       └──────────────┘
```

---

## Tables

### users (extends Supabase auth.users)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  neighborhood TEXT,
  notification_preferences JSONB DEFAULT '{"messages": true, "replies": true, "announcements": true}'::jsonb,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_display_name ON profiles(display_name);
CREATE INDEX idx_profiles_neighborhood ON profiles(neighborhood);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

### categories

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  color TEXT, -- hex color for UI
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Announcements', 'announcements', '📢', 1),
  ('Events', 'events', '🎉', 2),
  ('Schools', 'schools', '🏫', 3),
  ('Tutoring', 'tutoring', '📚', 4),
  ('Activities', 'activities', '⚽', 5),
  ('Parenting', 'parenting', '👶', 6),
  ('HOA & Neighborhood', 'hoa', '🏠', 7),
  ('General', 'general', '💬', 8);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by all authenticated users" 
  ON categories FOR SELECT USING (auth.role() = 'authenticated');
```

### posts

```sql
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT, -- optional title
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}', -- array of storage URLs
  link_preview JSONB, -- {url, title, description, image}
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', content));

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts viewable by authenticated users" 
  ON posts FOR SELECT 
  USING (auth.role() = 'authenticated' AND is_deleted = FALSE);

CREATE POLICY "Users can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Users can soft-delete own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = author_id);
```

### post_categories (junction table)

```sql
CREATE TABLE public.post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- RLS
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post categories viewable by authenticated" 
  ON post_categories FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can manage post categories" 
  ON post_categories FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM posts WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );
```

### post_likes

```sql
CREATE TABLE public.post_likes (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes viewable by authenticated" 
  ON post_likes FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can like posts" 
  ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" 
  ON post_likes FOR DELETE USING (auth.uid() = user_id);
```

### comments

```sql
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for replies
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created ON comments(created_at);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments viewable by authenticated" 
  ON comments FOR SELECT 
  USING (auth.role() = 'authenticated' AND is_deleted = FALSE);

CREATE POLICY "Users can create comments" 
  ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" 
  ON comments FOR UPDATE USING (auth.uid() = author_id);
```

### listings (marketplace)

```sql
CREATE TYPE listing_status AS ENUM ('available', 'pending', 'sold', 'expired');
CREATE TYPE listing_condition AS ENUM ('new', 'like_new', 'good', 'fair');
CREATE TYPE listing_type AS ENUM ('for_sale', 'free', 'wanted', 'service');

CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2), -- null for free items
  listing_type listing_type NOT NULL DEFAULT 'for_sale',
  category TEXT NOT NULL,
  condition listing_condition,
  images TEXT[] DEFAULT '{}',
  location TEXT, -- neighborhood or area
  status listing_status DEFAULT 'available',
  views_count INT DEFAULT 0,
  bumped_at TIMESTAMPTZ DEFAULT NOW(), -- for sorting by bump
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_bumped ON listings(bumped_at DESC);
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', title || ' ' || description));

-- RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings viewable by authenticated" 
  ON listings FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create listings" 
  ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings" 
  ON listings FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings" 
  ON listings FOR DELETE USING (auth.uid() = seller_id);
```

### saved_listings

```sql
CREATE TABLE public.saved_listings (
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (listing_id, user_id)
);

-- RLS
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved" 
  ON saved_listings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings" 
  ON saved_listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave" 
  ON saved_listings FOR DELETE USING (auth.uid() = user_id);
```

### conversations

```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL, -- optional context
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- Indexes
CREATE INDEX idx_conv_participant1 ON conversations(participant_1);
CREATE INDEX idx_conv_participant2 ON conversations(participant_2);
CREATE INDEX idx_conv_last_message ON conversations(last_message_at DESC);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" 
  ON conversations FOR SELECT 
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);
```

### messages

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages" 
  ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = conversation_id 
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
```

### notifications

```sql
CREATE TYPE notification_type AS ENUM (
  'new_message', 
  'post_reply', 
  'post_like', 
  'listing_inquiry',
  'announcement'
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB, -- {post_id, listing_id, conversation_id, etc.}
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE USING (auth.uid() = user_id);
```

### reports (content moderation)

```sql
CREATE TYPE report_type AS ENUM ('post', 'comment', 'listing', 'user', 'message');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'actioned', 'dismissed');

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  target_id UUID NOT NULL, -- ID of reported item
  reason TEXT NOT NULL,
  details TEXT,
  status report_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" 
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports" 
  ON reports FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

---

## Database Functions

### Auto-update updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Update post counts

```sql
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_likes_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
```

### Update conversation last message

```sql
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conv_last_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
```

---

## Realtime Subscriptions

Enable realtime for key tables:

```sql
-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
```

---

## Storage Buckets

```sql
-- Create storage buckets (via Supabase dashboard or API)
-- Bucket: avatars (public)
-- Bucket: post-images (public)
-- Bucket: listing-images (public)
-- Bucket: message-images (private)
```

Storage policies:
- avatars: Public read, authenticated upload (own folder)
- post-images: Public read, authenticated upload
- listing-images: Public read, authenticated upload
- message-images: Conversation participants only
