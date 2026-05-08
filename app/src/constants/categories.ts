export const FEED_CATEGORIES = [
  { id: 'all', name: 'All', slug: 'all', icon: '📋' },
  { id: 'announcements', name: 'Announcements', slug: 'announcements', icon: '📢' },
  { id: 'events', name: 'Events', slug: 'events', icon: '🎉' },
  { id: 'schools', name: 'Schools', slug: 'schools', icon: '🏫' },
  { id: 'tutoring', name: 'Tutoring', slug: 'tutoring', icon: '📚' },
  { id: 'activities', name: 'Activities', slug: 'activities', icon: '⚽' },
  { id: 'parenting', name: 'Parenting', slug: 'parenting', icon: '👶' },
  { id: 'hoa', name: 'HOA', slug: 'hoa', icon: '🏠' },
  { id: 'general', name: 'General', slug: 'general', icon: '💬' },
] as const;

export const MARKETPLACE_CATEGORIES = [
  { id: 'all', name: 'All', slug: 'all', icon: '🛒' },
  { id: 'furniture', name: 'Furniture', slug: 'furniture', icon: '🛋️' },
  { id: 'electronics', name: 'Electronics', slug: 'electronics', icon: '📱' },
  { id: 'kids', name: 'Kids & Baby', slug: 'kids', icon: '👶' },
  { id: 'sports', name: 'Sports', slug: 'sports', icon: '⚽' },
  { id: 'clothing', name: 'Clothing', slug: 'clothing', icon: '👕' },
  { id: 'vehicles', name: 'Vehicles', slug: 'vehicles', icon: '🚗' },
  { id: 'free', name: 'Free Items', slug: 'free', icon: '🎁' },
  { id: 'services', name: 'Services', slug: 'services', icon: '🔧' },
] as const;

export const LISTING_TYPES = [
  { id: 'for_sale', name: 'For Sale', slug: 'for_sale' },
  { id: 'free', name: 'Free', slug: 'free' },
  { id: 'wanted', name: 'Wanted', slug: 'wanted' },
  { id: 'service', name: 'Service', slug: 'service' },
] as const;

export const LISTING_CONDITIONS = [
  { id: 'new', name: 'New', slug: 'new' },
  { id: 'like_new', name: 'Like New', slug: 'like_new' },
  { id: 'good', name: 'Good', slug: 'good' },
  { id: 'fair', name: 'Fair', slug: 'fair' },
] as const;

export const NEIGHBORHOODS = [
  'Lakeside',
  'River Pointe',
  'The Lakes',
  'Downtown',
  'Parkside',
  'Other',
] as const;
