import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  hasCompletedOnboarding: boolean;

  initialize: () => Promise<void>;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  fetchProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
  hasCompletedOnboarding: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        set({ session, user: session.user });
        await get().fetchProfile();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      profile: session ? get().profile : null,
    });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  setHasCompletedOnboarding: (value) => {
    set({ hasCompletedOnboarding: value });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return null;

    try {
      // @ts-ignore - Types will work correctly when Supabase is connected
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      set({ profile: data as Profile });
      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) throw new Error('Not authenticated');

    // @ts-ignore - Types will work correctly when Supabase is connected
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    set({ profile: data as Profile });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      profile: null,
      hasCompletedOnboarding: false,
    });
  },
}));
