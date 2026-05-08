import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Profile } from '../types';

export function useAuth() {
  const {
    session,
    user,
    profile,
    isLoading,
    isInitialized,
    hasCompletedOnboarding,
    initialize,
    setSession,
    fetchProfile,
    updateProfile,
    signOut,
    setHasCompletedOnboarding,
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (event === 'SIGNED_IN' && session) {
          await fetchProfile();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;

    if (data.user && !data.user.email_confirmed_at) {
      return { user: data.user, needsEmailConfirmation: true };
    }

    return { user: data.user, needsEmailConfirmation: false };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'riverislands://reset-password',
    });

    if (error) throw error;
  };

  const createProfile = async (profileData: {
    display_name: string;
    neighborhood?: string;
    bio?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');

    const insertData = {
      id: user.id,
      email: user.email!,
      display_name: profileData.display_name,
      neighborhood: profileData.neighborhood || null,
      bio: profileData.bio || null,
    };

    // @ts-ignore - Types will work correctly when Supabase is connected
    const { data, error } = await supabase
      .from('profiles')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    useAuthStore.getState().setProfile(data as Profile);
    return data as Profile;
  };

  return {
    session,
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: !!session,
    hasCompletedOnboarding,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updateProfile,
    createProfile,
    fetchProfile,
    setHasCompletedOnboarding,
  };
}
