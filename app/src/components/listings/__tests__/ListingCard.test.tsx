import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ListingCard, ListingWithSeller } from '../ListingCard';

const mockListing: ListingWithSeller = {
  id: '1',
  seller_id: 'user1',
  title: 'Test Listing',
  description: 'This is a test listing description',
  price: 100,
  listing_type: 'for_sale',
  category: 'furniture',
  condition: 'good',
  images: ['https://example.com/image.jpg'],
  location: 'Lakeside',
  status: 'available',
  views_count: 10,
  bumped_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  seller: {
    id: 'user1',
    display_name: 'John Doe',
    avatar_url: null,
  },
  isSaved: false,
};

describe('ListingCard', () => {
  describe('Grid Variant', () => {
    it('renders listing title', () => {
      const { getByText } = render(
        <ListingCard listing={mockListing} variant="grid" />
      );
      expect(getByText('Test Listing')).toBeTruthy();
    });

    it('renders formatted price', () => {
      const { getByText } = render(
        <ListingCard listing={mockListing} variant="grid" />
      );
      expect(getByText('$100')).toBeTruthy();
    });

    it('renders location', () => {
      const { getByText } = render(
        <ListingCard listing={mockListing} variant="grid" />
      );
      expect(getByText('Lakeside')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <ListingCard listing={mockListing} onPress={onPress} variant="grid" />
      );

      fireEvent.press(getByText('Test Listing'));
      expect(onPress).toHaveBeenCalledWith('1');
    });

    it('provides save functionality', () => {
      const onSave = jest.fn();
      const { getByTestId } = render(
        <ListingCard listing={mockListing} onSave={onSave} variant="grid" />
      );

      const heartIcon = getByTestId('icon-heart');
      expect(heartIcon).toBeTruthy();
    });
  });

  describe('List Variant', () => {
    it('renders listing title', () => {
      const { getByText } = render(
        <ListingCard listing={mockListing} variant="list" />
      );
      expect(getByText('Test Listing')).toBeTruthy();
    });

    it('renders condition badge', () => {
      const { getByText } = render(
        <ListingCard listing={mockListing} variant="list" />
      );
      expect(getByText('Good')).toBeTruthy();
    });
  });

  describe('Price Formatting', () => {
    it('shows "Free" for free listings', () => {
      const freeListing = { ...mockListing, listing_type: 'free' as const, price: null };
      const { getByText } = render(<ListingCard listing={freeListing} />);
      expect(getByText('Free')).toBeTruthy();
    });

    it('shows "Wanted" for wanted listings', () => {
      const wantedListing = { ...mockListing, listing_type: 'wanted' as const };
      const { getByText } = render(<ListingCard listing={wantedListing} />);
      expect(getByText('Wanted')).toBeTruthy();
    });

    it('shows "Contact for price" when price is null', () => {
      const noPriceListing = { ...mockListing, price: null };
      const { getByText } = render(<ListingCard listing={noPriceListing} />);
      expect(getByText('Contact for price')).toBeTruthy();
    });
  });

  describe('Status Badges', () => {
    it('shows "Sold" badge for sold listings', () => {
      const soldListing = { ...mockListing, status: 'sold' as const };
      const { getByText } = render(<ListingCard listing={soldListing} />);
      expect(getByText('Sold')).toBeTruthy();
    });

    it('shows "Pending" badge for pending listings', () => {
      const pendingListing = { ...mockListing, status: 'pending' as const };
      const { getByText } = render(<ListingCard listing={pendingListing} />);
      expect(getByText('Pending')).toBeTruthy();
    });

    it('shows FREE badge for free listings', () => {
      const freeListing = { ...mockListing, listing_type: 'free' as const };
      const { getByText } = render(<ListingCard listing={freeListing} />);
      expect(getByText('FREE')).toBeTruthy();
    });
  });

  describe('Saved State', () => {
    it('shows saved state correctly', () => {
      const savedListing = { ...mockListing, isSaved: true };
      const { getByText } = render(<ListingCard listing={savedListing} />);
      expect(getByText('Test Listing')).toBeTruthy();
    });

    it('renders save icon', () => {
      const onSave = jest.fn();
      const { getByTestId } = render(
        <ListingCard listing={mockListing} onSave={onSave} />
      );

      expect(getByTestId('icon-heart')).toBeTruthy();
    });
  });

  describe('Image Handling', () => {
    it('renders placeholder when no image', () => {
      const noImageListing = { ...mockListing, images: [] };
      const { getByText } = render(<ListingCard listing={noImageListing} />);
      expect(getByText('No Image')).toBeTruthy();
    });

    it('renders image when available', () => {
      const { getByText } = render(<ListingCard listing={mockListing} />);
      expect(getByText('Test Listing')).toBeTruthy();
    });
  });
});
