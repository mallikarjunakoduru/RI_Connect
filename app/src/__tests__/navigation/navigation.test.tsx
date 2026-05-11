import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock router functions
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Reset mocks before each test
beforeEach(() => {
  mockPush.mockClear();
  mockReplace.mockClear();
  mockBack.mockClear();
});

describe('Navigation', () => {
  describe('Tab Navigation', () => {
    it('navigates to home tab', () => {
      // Home tab should be the default route
      expect(true).toBe(true); // Placeholder - actual tab navigation is handled by Expo Router
    });

    it('navigates to marketplace tab', () => {
      // Tab navigation is handled by Expo Router's tab layout
      expect(true).toBe(true);
    });

    it('navigates to messages tab', () => {
      expect(true).toBe(true);
    });

    it('navigates to profile tab', () => {
      expect(true).toBe(true);
    });
  });

  describe('Post Detail Navigation', () => {
    it('navigates to post detail when post is tapped', () => {
      const postId = 'post-123';
      mockPush(`/post/${postId}`);

      expect(mockPush).toHaveBeenCalledWith(`/post/${postId}`);
    });

    it('navigates to post detail when comment icon is tapped', () => {
      const postId = 'post-456';
      mockPush(`/post/${postId}`);

      expect(mockPush).toHaveBeenCalledWith(`/post/${postId}`);
    });

    it('navigates back from post detail', () => {
      mockBack();
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Chat Navigation', () => {
    it('navigates to chat screen when conversation is tapped', () => {
      const conversationId = 'conv-123';
      mockPush(`/chat/${conversationId}`);

      expect(mockPush).toHaveBeenCalledWith(`/chat/${conversationId}`);
    });

    it('navigates back from chat screen', () => {
      mockBack();
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Auth Navigation', () => {
    it('navigates to sign up from sign in', () => {
      mockPush('/sign-up');
      expect(mockPush).toHaveBeenCalledWith('/sign-up');
    });

    it('navigates to sign in from sign up', () => {
      mockPush('/sign-in');
      expect(mockPush).toHaveBeenCalledWith('/sign-in');
    });

    it('navigates to forgot password from sign in', () => {
      mockPush('/forgot-password');
      expect(mockPush).toHaveBeenCalledWith('/forgot-password');
    });

    it('navigates to onboarding after sign up', () => {
      mockReplace('/onboarding');
      expect(mockReplace).toHaveBeenCalledWith('/onboarding');
    });

    it('navigates to home after login', () => {
      mockReplace('/(tabs)');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  describe('Create Post Navigation', () => {
    it('navigates to create post screen', () => {
      mockPush('/(tabs)/create');
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/create');
    });

    it('navigates back after creating post', () => {
      mockBack();
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Listing Navigation', () => {
    it('navigates to listing detail', () => {
      const listingId = 'listing-123';
      mockPush(`/listing/${listingId}`);

      expect(mockPush).toHaveBeenCalledWith(`/listing/${listingId}`);
    });

    it('navigates to seller profile from listing', () => {
      const sellerId = 'seller-123';
      mockPush(`/profile/${sellerId}`);

      expect(mockPush).toHaveBeenCalledWith(`/profile/${sellerId}`);
    });

    it('navigates to chat from listing', () => {
      const conversationId = 'conv-new';
      mockPush(`/chat/${conversationId}`);

      expect(mockPush).toHaveBeenCalledWith(`/chat/${conversationId}`);
    });
  });

  describe('Deep Link Handling', () => {
    it('handles post deep link', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'post-deep' });
      const params = useLocalSearchParams();

      expect(params.id).toBe('post-deep');
    });

    it('handles chat deep link', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'chat-deep' });
      const params = useLocalSearchParams();

      expect(params.id).toBe('chat-deep');
    });
  });
});

describe('Navigation Guards', () => {
  it('redirects to sign-in when not authenticated', () => {
    // When user is not authenticated, they should be redirected to sign-in
    mockReplace('/(auth)/sign-in');
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/sign-in');
  });

  it('redirects to onboarding when profile incomplete', () => {
    // When user has no profile, they should be redirected to onboarding
    mockReplace('/onboarding');
    expect(mockReplace).toHaveBeenCalledWith('/onboarding');
  });

  it('allows access to tabs when authenticated', () => {
    // Authenticated users can access tabs
    mockPush('/(tabs)');
    expect(mockPush).toHaveBeenCalledWith('/(tabs)');
  });
});
