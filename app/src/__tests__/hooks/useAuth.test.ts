import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '../../stores/authStore';

// Reset store before each test
beforeEach(() => {
  useAuthStore.setState({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
    hasCompletedOnboarding: false,
  });
});

describe('useAuthStore', () => {
  describe('initialize', () => {
    it('sets isInitialized to true after initialization', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('sets session and user when session exists', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token',
      };

      const supabase = require('../../lib/supabase').supabase;
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.user).toEqual(mockSession.user);
    });
  });

  describe('setSession', () => {
    it('updates session and user', () => {
      const mockSession = {
        user: { id: 'user-456', email: 'new@example.com' },
        access_token: 'new-token',
      };

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setSession(mockSession as any);
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.user).toEqual(mockSession.user);
    });

    it('clears profile when session is null', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setProfile({ id: 'profile-1', display_name: 'Test' } as any);
      });

      act(() => {
        result.current.setSession(null);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
    });
  });

  describe('setHasCompletedOnboarding', () => {
    it('updates onboarding status', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.hasCompletedOnboarding).toBe(false);

      act(() => {
        result.current.setHasCompletedOnboarding(true);
      });

      expect(result.current.hasCompletedOnboarding).toBe(true);
    });
  });

  describe('signOut', () => {
    it('clears all auth state', async () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setSession({ user: { id: '123' } } as any);
        result.current.setProfile({ id: '123', display_name: 'Test' } as any);
        result.current.setHasCompletedOnboarding(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.session).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
      expect(result.current.hasCompletedOnboarding).toBe(false);
    });
  });
});
