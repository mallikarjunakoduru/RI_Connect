export * from './database';

export type PostWithAuthor = {
  id: string;
  author_id: string;
  title: string | null;
  content: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    neighborhood: string | null;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  }[];
  is_liked?: boolean;
};

export type ListingWithSeller = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number | null;
  listing_type: 'for_sale' | 'free' | 'wanted' | 'service';
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | null;
  images: string[];
  location: string | null;
  status: 'available' | 'pending' | 'sold' | 'expired';
  views_count: number;
  created_at: string;
  seller: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    neighborhood: string | null;
  };
  is_saved?: boolean;
};

export type ConversationWithParticipant = {
  id: string;
  participant_1: string;
  participant_2: string;
  listing_id: string | null;
  last_message_at: string;
  last_message_preview: string | null;
  created_at: string;
  other_participant: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  listing?: {
    id: string;
    title: string;
    images: string[];
  } | null;
  unread_count: number;
};

export type MessageWithSender = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
  sender: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  is_mine: boolean;
};

export type CommentWithAuthor = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  replies?: CommentWithAuthor[];
};
