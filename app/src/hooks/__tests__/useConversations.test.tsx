import { renderHook, waitFor } from '@testing-library/react-native';

// Create stable user object outside the mock
const mockUser = { id: 'user1' };

// Mock useAuth with stable reference
jest.mock('../useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isInitialized: true,
  }),
}));

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Import after mocks
import { useConversations, useMessages } from '../useConversations';

describe('useConversations', () => {
  it('finishes loading', async () => {
    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
  });

  it('provides refresh function', async () => {
    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('returns conversations array', async () => {
    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(Array.isArray(result.current.conversations)).toBe(true);
  });
});

describe('useMessages', () => {
  it('finishes loading', async () => {
    const { result } = renderHook(() => useMessages('conv1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
  });

  it('provides sendMessage function', async () => {
    const { result } = renderHook(() => useMessages('conv1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(typeof result.current.sendMessage).toBe('function');
  });

  it('handles null conversationId', async () => {
    const { result } = renderHook(() => useMessages(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.messages).toEqual([]);
  });
});
