import { renderHook, waitFor, act } from '@testing-library/react-native';

// Create mock function that can be tracked
const mockFrom = jest.fn();

// Mock useAuth
jest.mock('../useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user1' },
    isInitialized: true,
  }),
}));

// Mock Supabase with a trackable mock
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => {
      mockFrom(...args);
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        single: jest.fn().mockResolvedValue({ data: { id: 'cat-1' }, error: null }),
      };
    },
  },
}));

// Import after mocks are set up
import { usePosts } from '../usePosts';

describe('usePosts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('finishes loading', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('provides refresh function', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('provides toggleLike function', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.toggleLike).toBe('function');
  });

  it('returns posts array', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.posts)).toBe(true);
  });

  it('returns error state', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
  });

  describe('Category Filtering', () => {
    it('fetches all posts when categoryFilter is undefined', async () => {
      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
    });

    it('fetches all posts when categoryFilter is "all"', async () => {
      const { result } = renderHook(() => usePosts({ categoryFilter: 'all' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
    });

    it('filters posts by category when categoryFilter is set', async () => {
      mockFrom.mockClear();

      const { result } = renderHook(() => usePosts({ categoryFilter: 'events' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // When filtering by category, should query categories table
      const fromCalls = mockFrom.mock.calls.flat();
      expect(fromCalls).toContain('categories');
    });

    it('returns empty array when category has no posts', async () => {
      const { result } = renderHook(() => usePosts({ categoryFilter: 'events' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
    });
  });

  describe('Pull to Refresh', () => {
    it('refresh function triggers data fetch', async () => {
      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFrom.mockClear();

      await act(async () => {
        result.current.refresh();
      });

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });

      // Should have made new queries
      expect(mockFrom.mock.calls.length).toBeGreaterThan(0);
    });

    it('isRefreshing returns to false after refresh completes', async () => {
      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.refresh();
      });

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });
    });
  });
});
