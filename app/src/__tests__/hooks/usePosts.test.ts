import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePosts } from '../../hooks/usePosts';
import { useAuthStore } from '../../stores/authStore';

const mockPosts = [
  {
    id: 'post-1',
    content: 'Test post 1',
    author_id: 'author-1',
    likes_count: 5,
    comments_count: 2,
    created_at: '2024-01-01T00:00:00Z',
    is_deleted: false,
  },
  {
    id: 'post-2',
    content: 'Test post 2',
    author_id: 'author-2',
    likes_count: 10,
    comments_count: 5,
    created_at: '2024-01-02T00:00:00Z',
    is_deleted: false,
  },
];

const mockProfiles = [
  { id: 'author-1', display_name: 'Author One', avatar_url: null, neighborhood: 'North' },
  { id: 'author-2', display_name: 'Author Two', avatar_url: null, neighborhood: 'South' },
];

// Setup auth state
beforeEach(() => {
  useAuthStore.setState({
    session: { user: { id: 'user-123' } } as any,
    user: { id: 'user-123' } as any,
    profile: null,
    isLoading: false,
    isInitialized: true,
    hasCompletedOnboarding: true,
  });
});

describe('usePosts', () => {
  it('starts with loading state', () => {
    const { result } = renderHook(() => usePosts());
    expect(result.current.isLoading).toBe(true);
  });

  it('fetches posts successfully', async () => {
    const supabase = require('../../lib/supabase').supabase;

    // Mock posts query
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles empty posts list', async () => {
    const supabase = require('../../lib/supabase').supabase;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.posts).toEqual([]);
    });
  });

  it('handles fetch error', async () => {
    const supabase = require('../../lib/supabase').supabase;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: null, error: { message: 'Network error' } }),
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Network error');
    });
  });

  it('filters posts by category', async () => {
    const supabase = require('../../lib/supabase').supabase;

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockPosts.slice(0, 1), error: null }),
      single: jest.fn().mockResolvedValue({ data: { id: 'cat-1' }, error: null }),
    };

    supabase.from.mockReturnValue(mockQuery);

    const { result } = renderHook(() => usePosts({ categoryFilter: 'events' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('refresh function triggers refetch', async () => {
    const supabase = require('../../lib/supabase').supabase;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.refresh();
    });

    expect(result.current.isRefreshing).toBe(true);

    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(false);
    });
  });
});
