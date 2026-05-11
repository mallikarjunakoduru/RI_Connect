import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '../../stores/authStore';

// Mock the hooks
jest.mock('../../hooks/usePosts', () => ({
  usePosts: jest.fn(() => ({
    posts: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    refresh: jest.fn(),
    toggleLike: jest.fn(),
  })),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import HomeScreen from '../../../app/(tabs)/index';
import { usePosts } from '../../hooks/usePosts';

beforeEach(() => {
  useAuthStore.setState({
    session: { user: { id: 'user-123' } } as any,
    user: { id: 'user-123' } as any,
    profile: { id: 'user-123', display_name: 'Test User' } as any,
    isLoading: false,
    isInitialized: true,
    hasCompletedOnboarding: true,
  });

  (usePosts as jest.Mock).mockClear();
});

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('RI Connect')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: [],
      isLoading: true,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      toggleLike: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Loading posts...')).toBeTruthy();
  });

  it('shows empty state when no posts', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      toggleLike: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('No posts yet')).toBeTruthy();
  });

  it('shows error state when error occurs', () => {
    (usePosts as jest.Mock).mockReturnValue({
      posts: [],
      isLoading: false,
      isRefreshing: false,
      error: 'Network error',
      refresh: jest.fn(),
      toggleLike: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText("Couldn't load posts")).toBeTruthy();
    expect(getByText('Network error')).toBeTruthy();
  });

  it('renders category chips', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('All')).toBeTruthy();
  });

  it('handles category selection', () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('All'));
    // Category selection changes internal state
  });

  it('renders posts when available', () => {
    const mockPosts = [
      {
        id: 'post-1',
        content: 'Test post content',
        author: { id: 'author-1', display_name: 'Author', avatar_url: null, neighborhood: null },
        likes_count: 5,
        comments_count: 2,
        created_at: new Date().toISOString(),
        categories: [],
        isLiked: false,
      },
    ];

    (usePosts as jest.Mock).mockReturnValue({
      posts: mockPosts,
      isLoading: false,
      isRefreshing: false,
      error: null,
      refresh: jest.fn(),
      toggleLike: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Test post content')).toBeTruthy();
    expect(getByText('Author')).toBeTruthy();
  });

  it('handles retry on error', () => {
    const mockRefresh = jest.fn();

    (usePosts as jest.Mock).mockReturnValue({
      posts: [],
      isLoading: false,
      isRefreshing: false,
      error: 'Network error',
      refresh: mockRefresh,
      toggleLike: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('Try Again'));
    expect(mockRefresh).toHaveBeenCalled();
  });
});
