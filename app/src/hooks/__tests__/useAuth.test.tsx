import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { useAuthStore } from '../../stores/authStore';

// Mock the auth store
jest.mock('../../stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockAuthStore = {
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: true,
  hasCompletedOnboarding: false,
  initialize: jest.fn(),
  setSession: jest.fn(),
  fetchProfile: jest.fn(),
  updateProfile: jest.fn(),
  signOut: jest.fn(),
  setHasCompletedOnboarding: jest.fn(),
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockAuthStore);
  });

  it('returns auth state correctly', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated true when session exists', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      ...mockAuthStore,
      session: { access_token: 'token', user: { id: '1' } },
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('provides signInWithEmail function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signInWithEmail).toBe('function');
  });

  it('provides signUpWithEmail function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signUpWithEmail).toBe('function');
  });

  it('provides signOut function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signOut).toBe('function');
  });

  it('provides resetPassword function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.resetPassword).toBe('function');
  });

  it('provides updateProfile function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.updateProfile).toBe('function');
  });

  it('provides createProfile function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.createProfile).toBe('function');
  });

  it('returns profile data when available', () => {
    const mockProfile = {
      id: '1',
      email: 'test@example.com',
      display_name: 'Test User',
      neighborhood: 'Lakeside',
    };

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      ...mockAuthStore,
      profile: mockProfile,
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.profile).toEqual(mockProfile);
  });

  it('returns loading state', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      ...mockAuthStore,
      isLoading: true,
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns hasCompletedOnboarding state', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      ...mockAuthStore,
      hasCompletedOnboarding: true,
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.hasCompletedOnboarding).toBe(true);
  });
});
