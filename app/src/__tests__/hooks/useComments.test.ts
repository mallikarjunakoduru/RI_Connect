import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useComments } from '../../hooks/useComments';
import { useAuthStore } from '../../stores/authStore';

const mockComments = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    author_id: 'author-1',
    parent_id: null,
    content: 'This is a comment',
    created_at: '2024-01-01T00:00:00Z',
    is_deleted: false,
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    author_id: 'author-2',
    parent_id: 'comment-1',
    content: 'This is a reply',
    created_at: '2024-01-01T01:00:00Z',
    is_deleted: false,
  },
];

const mockProfiles = [
  { id: 'author-1', display_name: 'Author One', avatar_url: null },
  { id: 'author-2', display_name: 'Author Two', avatar_url: null },
];

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

describe('useComments', () => {
  it('starts with loading state when postId is provided', () => {
    const { result } = renderHook(() => useComments('post-1'));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns empty when postId is null', async () => {
    const { result } = renderHook(() => useComments(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.comments).toEqual([]);
    });
  });

  it('fetches comments successfully', async () => {
    const supabase = require('../../lib/supabase').supabase;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockComments, error: null }),
    });

    const { result } = renderHook(() => useComments('post-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles empty comments list', async () => {
    const supabase = require('../../lib/supabase').supabase;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => useComments('post-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.comments).toEqual([]);
    });
  });

  it('handles fetch error', async () => {
    const supabase = require('../../lib/supabase').supabase;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Failed to fetch' } }),
    });

    const { result } = renderHook(() => useComments('post-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  it('addComment returns false when no user', async () => {
    useAuthStore.setState({ user: null } as any);

    const { result } = renderHook(() => useComments('post-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const success = await result.current.addComment('New comment');
    expect(success).toBe(false);
  });

  it('addComment returns false when content is empty', async () => {
    const { result } = renderHook(() => useComments('post-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const success = await result.current.addComment('   ');
    expect(success).toBe(false);
  });

  it('deleteComment returns false when no user', async () => {
    useAuthStore.setState({ user: null } as any);

    const { result } = renderHook(() => useComments('post-1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const success = await result.current.deleteComment('comment-1');
    expect(success).toBe(false);
  });
});
