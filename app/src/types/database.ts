export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          neighborhood: string | null;
          notification_preferences: Json;
          is_admin: boolean;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          neighborhood?: string | null;
          notification_preferences?: Json;
          is_admin?: boolean;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          neighborhood?: string | null;
          notification_preferences?: Json;
          is_admin?: boolean;
          is_verified?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string | null;
          content: string;
          images: string[];
          link_preview: Json | null;
          likes_count: number;
          comments_count: number;
          is_pinned: boolean;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title?: string | null;
          content: string;
          images?: string[];
          link_preview?: Json | null;
          likes_count?: number;
          comments_count?: number;
          is_pinned?: boolean;
          is_deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          content?: string;
          images?: string[];
          link_preview?: Json | null;
          likes_count?: number;
          comments_count?: number;
          is_pinned?: boolean;
          is_deleted?: boolean;
          updated_at?: string;
        };
      };
      post_categories: {
        Row: {
          post_id: string;
          category_id: string;
        };
        Insert: {
          post_id: string;
          category_id: string;
        };
        Update: {
          post_id?: string;
          category_id?: string;
        };
      };
      post_likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
          is_deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          is_deleted?: boolean;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
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
          bumped_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description: string;
          price?: number | null;
          listing_type?: 'for_sale' | 'free' | 'wanted' | 'service';
          category: string;
          condition?: 'new' | 'like_new' | 'good' | 'fair' | null;
          images?: string[];
          location?: string | null;
          status?: 'available' | 'pending' | 'sold' | 'expired';
          views_count?: number;
          bumped_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          price?: number | null;
          listing_type?: 'for_sale' | 'free' | 'wanted' | 'service';
          category?: string;
          condition?: 'new' | 'like_new' | 'good' | 'fair' | null;
          images?: string[];
          location?: string | null;
          status?: 'available' | 'pending' | 'sold' | 'expired';
          views_count?: number;
          bumped_at?: string;
          updated_at?: string;
        };
      };
      saved_listings: {
        Row: {
          listing_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          listing_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          participant_1: string;
          participant_2: string;
          listing_id: string | null;
          last_message_at: string;
          last_message_preview: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_1: string;
          participant_2: string;
          listing_id?: string | null;
          last_message_at?: string;
          last_message_preview?: string | null;
          created_at?: string;
        };
        Update: {
          last_message_at?: string;
          last_message_preview?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          image_url: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          image_url?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          read_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'new_message' | 'post_reply' | 'post_like' | 'listing_inquiry' | 'announcement';
          title: string;
          body: string | null;
          data: Json | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'new_message' | 'post_reply' | 'post_like' | 'listing_inquiry' | 'announcement';
          title: string;
          body?: string | null;
          data?: Json | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          read_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      listing_status: 'available' | 'pending' | 'sold' | 'expired';
      listing_condition: 'new' | 'like_new' | 'good' | 'fair';
      listing_type: 'for_sale' | 'free' | 'wanted' | 'service';
      notification_type: 'new_message' | 'post_reply' | 'post_like' | 'listing_inquiry' | 'announcement';
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Post = Tables<'posts'>;
export type Comment = Tables<'comments'>;
export type Listing = Tables<'listings'>;
export type Conversation = Tables<'conversations'>;
export type Message = Tables<'messages'>;
export type Notification = Tables<'notifications'>;
