import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar } from '../../components/ui/Avatar';

describe('Avatar', () => {
  it('renders with image source', () => {
    const { toJSON } = render(
      <Avatar source="https://example.com/avatar.jpg" name="John Doe" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders initials when no image source', () => {
    const { getByText } = render(<Avatar source={null} name="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders single initial for single name', () => {
    const { getByText } = render(<Avatar source={null} name="John" />);
    expect(getByText('J')).toBeTruthy();
  });

  it('renders different sizes correctly', () => {
    const { rerender, toJSON } = render(<Avatar source={null} name="Test" size="sm" />);
    expect(toJSON()).toBeTruthy();

    rerender(<Avatar source={null} name="Test" size="md" />);
    expect(toJSON()).toBeTruthy();

    rerender(<Avatar source={null} name="Test" size="lg" />);
    expect(toJSON()).toBeTruthy();

    rerender(<Avatar source={null} name="Test" size="xl" />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles empty name gracefully', () => {
    const { getByText } = render(<Avatar source={null} name="" />);
    expect(getByText('?')).toBeTruthy();
  });

  it('handles undefined source', () => {
    const { getByText } = render(<Avatar source={undefined} name="Jane Smith" />);
    expect(getByText('JS')).toBeTruthy();
  });

  it('handles undefined name', () => {
    const { getByText } = render(<Avatar source={null} name={undefined} />);
    expect(getByText('?')).toBeTruthy();
  });

  it('handles names with multiple spaces', () => {
    const { getByText } = render(<Avatar source={null} name="John   Middle   Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('handles lowercase names', () => {
    const { getByText } = render(<Avatar source={null} name="john doe" />);
    expect(getByText('JD')).toBeTruthy();
  });
});
