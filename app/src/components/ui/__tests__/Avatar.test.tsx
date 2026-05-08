import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders with image source', () => {
    const { toJSON } = render(
      <Avatar source="https://example.com/avatar.jpg" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders initials when no image provided', () => {
    const { getByText } = render(<Avatar name="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders single initial for single name', () => {
    const { getByText } = render(<Avatar name="John" />);
    expect(getByText('J')).toBeTruthy();
  });

  it('renders placeholder when no name or image', () => {
    const { getByText } = render(<Avatar />);
    expect(getByText('?')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { rerender, getByText } = render(<Avatar name="Test" size="sm" />);
    expect(getByText('T')).toBeTruthy();

    rerender(<Avatar name="Test" size="md" />);
    expect(getByText('T')).toBeTruthy();

    rerender(<Avatar name="Test" size="lg" />);
    expect(getByText('T')).toBeTruthy();

    rerender(<Avatar name="Test" size="xl" />);
    expect(getByText('T')).toBeTruthy();
  });

  it('extracts initials correctly from full name', () => {
    const { getByText } = render(<Avatar name="Jane Mary Smith" />);
    expect(getByText('JS')).toBeTruthy();
  });

  it('handles empty string name', () => {
    const { getByText } = render(<Avatar name="" />);
    expect(getByText('?')).toBeTruthy();
  });
});
