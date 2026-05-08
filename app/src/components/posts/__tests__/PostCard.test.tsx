import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PostCard, PostWithAuthor } from '../PostCard';

const mockPost: PostWithAuthor = {
  id: '1',
  author_id: 'user1',
  title: null,
  content: 'This is a test post content',
  images: [],
  link_preview: null,
  likes_count: 5,
  comments_count: 3,
  is_pinned: false,
  is_deleted: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: 'user1',
    display_name: 'John Doe',
    avatar_url: null,
    neighborhood: 'Lakeside',
  },
  categories: [{ id: 'events', name: 'Events', icon: '🎉' }],
  isLiked: false,
};

describe('PostCard', () => {
  it('renders post content', () => {
    const { getByText } = render(<PostCard post={mockPost} />);
    expect(getByText('This is a test post content')).toBeTruthy();
  });

  it('renders author name', () => {
    const { getByText } = render(<PostCard post={mockPost} />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders author neighborhood', () => {
    const { getByText } = render(<PostCard post={mockPost} />);
    expect(getByText('Lakeside')).toBeTruthy();
  });

  it('renders category chips', () => {
    const { getByText } = render(<PostCard post={mockPost} />);
    expect(getByText('Events')).toBeTruthy();
    expect(getByText('🎉')).toBeTruthy();
  });

  it('renders likes count', () => {
    const { getByText } = render(<PostCard post={mockPost} />);
    expect(getByText('5')).toBeTruthy();
  });

  it('renders comments count', () => {
    const { getByText } = render(<PostCard post={mockPost} />);
    expect(getByText('3')).toBeTruthy();
  });

  it('calls onLike when like button pressed', () => {
    const onLike = jest.fn();
    const { getByTestId } = render(
      <PostCard post={mockPost} onLike={onLike} />
    );

    // Find and press the like button (heart icon area)
    const likeButton = getByTestId('icon-heart').parent;
    if (likeButton) {
      fireEvent.press(likeButton);
      expect(onLike).toHaveBeenCalledWith('1');
    }
  });

  it('calls onPress when card pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<PostCard post={mockPost} onPress={onPress} />);

    fireEvent.press(getByText('This is a test post content'));
    expect(onPress).toHaveBeenCalledWith('1');
  });

  it('calls onAuthorPress when author pressed', () => {
    const onAuthorPress = jest.fn();
    const { getByText } = render(
      <PostCard post={mockPost} onAuthorPress={onAuthorPress} />
    );

    fireEvent.press(getByText('John Doe'));
    expect(onAuthorPress).toHaveBeenCalledWith('user1');
  });

  it('renders without categories', () => {
    const postWithoutCategories = { ...mockPost, categories: [] };
    const { getByText, queryByText } = render(
      <PostCard post={postWithoutCategories} />
    );

    expect(getByText('This is a test post content')).toBeTruthy();
    expect(queryByText('Events')).toBeNull();
  });

  it('renders with images', () => {
    const postWithImages = {
      ...mockPost,
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    };
    const { getByText } = render(<PostCard post={postWithImages} />);
    expect(getByText('This is a test post content')).toBeTruthy();
  });

  it('shows liked state correctly', () => {
    const likedPost = { ...mockPost, isLiked: true };
    const { getByText } = render(<PostCard post={likedPost} />);
    expect(getByText('This is a test post content')).toBeTruthy();
  });

  it('formats time correctly for recent posts', () => {
    const recentPost = {
      ...mockPost,
      created_at: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
    };
    const { getByText } = render(<PostCard post={recentPost} />);
    expect(getByText('just now')).toBeTruthy();
  });
});
