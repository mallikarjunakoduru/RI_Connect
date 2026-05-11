import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '../../stores/authStore';

// Mock the hooks
jest.mock('../../hooks/useConversations', () => ({
  useConversations: jest.fn(() => ({
    conversations: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    refresh: jest.fn(),
    startConversation: jest.fn(),
  })),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import MessagesScreen from '../../../app/(tabs)/messages';
import { useConversations } from '../../hooks/useConversations';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

beforeEach(() => {
  useAuthStore.setState({
    session: { user: { id: 'user-123' } } as any,
    user: { id: 'user-123' } as any,
    profile: { id: 'user-123', display_name: 'Test User' } as any,
    isLoading: false,
    isInitialized: true,
    hasCompletedOnboarding: true,
  });

  (useConversations as jest.Mock).mockClear();
  mockRouter.push.mockClear();
});

describe('MessagesScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MessagesScreen />);
    expect(getByText('Messages')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    (useConversations as jest.Mock).mockReturnValue({
      conversations: [],
      isLoading: true,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      startConversation: jest.fn(),
    });

    const { getByText } = render(<MessagesScreen />);
    expect(getByText('Loading messages...')).toBeTruthy();
  });

  it('shows empty state when no conversations', () => {
    (useConversations as jest.Mock).mockReturnValue({
      conversations: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      startConversation: jest.fn(),
    });

    const { getByText } = render(<MessagesScreen />);
    expect(getByText('No messages yet')).toBeTruthy();
  });

  it('renders conversations when available', () => {
    const mockConversations = [
      {
        id: 'conv-1',
        participant_1: 'user-123',
        participant_2: 'other-user',
        last_message_at: new Date().toISOString(),
        last_message_preview: 'Hey there!',
        otherUser: { id: 'other-user', display_name: 'Other User', avatar_url: null },
        unreadCount: 2,
      },
    ];

    (useConversations as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      startConversation: jest.fn(),
    });

    const { getByText } = render(<MessagesScreen />);
    expect(getByText('Other User')).toBeTruthy();
    expect(getByText('Hey there!')).toBeTruthy();
  });

  it('navigates to chat when conversation is tapped', () => {
    const mockConversations = [
      {
        id: 'conv-1',
        participant_1: 'user-123',
        participant_2: 'other-user',
        last_message_at: new Date().toISOString(),
        last_message_preview: 'Hey there!',
        otherUser: { id: 'other-user', display_name: 'Other User', avatar_url: null },
        unreadCount: 0,
      },
    ];

    (useConversations as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      startConversation: jest.fn(),
    });

    const { getByText } = render(<MessagesScreen />);

    fireEvent.press(getByText('Other User'));
    expect(mockRouter.push).toHaveBeenCalledWith('/chat/conv-1');
  });

  it('shows unread badge when there are unread messages', () => {
    const mockConversations = [
      {
        id: 'conv-1',
        participant_1: 'user-123',
        participant_2: 'other-user',
        last_message_at: new Date().toISOString(),
        last_message_preview: 'New message',
        otherUser: { id: 'other-user', display_name: 'Other User', avatar_url: null },
        unreadCount: 3,
      },
    ];

    (useConversations as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      startConversation: jest.fn(),
    });

    const { getByText } = render(<MessagesScreen />);
    expect(getByText('3')).toBeTruthy();
  });
});
