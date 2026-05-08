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

// Create a proper chainable mock that also resolves as a Promise
const createChainableMock = () => {
  const chainable: any = {
    select: jest.fn(() => chainable),
    eq: jest.fn(() => chainable),
    in: jest.fn(() => chainable),
    order: jest.fn(() => chainable),
    limit: jest.fn(() => chainable),
    delete: jest.fn(() => chainable),
    // Make it thenable (acts as a Promise)
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return chainable;
};

// Mock Supabase with chainable methods
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => {
      mockFrom(...args);
      return createChainableMock();
    },
  },
}));

// Import after mocks are set up
import { useListings } from '../useListings';

describe('useListings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('finishes loading', async () => {
    const { result } = renderHook(() => useListings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('provides refresh function', async () => {
    const { result } = renderHook(() => useListings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('provides toggleSave function', async () => {
    const { result } = renderHook(() => useListings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.toggleSave).toBe('function');
  });

  it('returns listings array', async () => {
    const { result } = renderHook(() => useListings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.listings)).toBe(true);
  });

  it('returns error state', async () => {
    const { result } = renderHook(() => useListings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
  });

  describe('Category Filtering', () => {
    it('fetches all listings when categoryFilter is undefined', async () => {
      const { result } = renderHook(() => useListings());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.listings).toEqual([]);
    });

    it('accepts category filter and completes without error', async () => {
      const { result } = renderHook(() => useListings({ categoryFilter: 'furniture' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.listings).toEqual([]);
    });

    it('fetches listings when categoryFilter is "all"', async () => {
      const { result } = renderHook(() => useListings({ categoryFilter: 'all' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Type Filtering', () => {
    it('accepts type filter and completes without error', async () => {
      const { result } = renderHook(() => useListings({ typeFilter: 'free' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.listings).toEqual([]);
    });

    it('fetches listings when typeFilter is "all"', async () => {
      const { result } = renderHook(() => useListings({ typeFilter: 'all' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Combined Filtering', () => {
    it('accepts both category and type filters', async () => {
      const { result } = renderHook(() => useListings({ categoryFilter: 'furniture', typeFilter: 'sale' }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.listings).toEqual([]);
    });
  });

  describe('Pull to Refresh', () => {
    it('refresh function triggers data fetch', async () => {
      const { result } = renderHook(() => useListings());

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
      const { result } = renderHook(() => useListings());

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
