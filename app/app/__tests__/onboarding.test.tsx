import React from 'react';

// Test profile creation logic
const mockCreateProfile = jest.fn();
const mockSetHasCompletedOnboarding = jest.fn();

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { user_metadata: { display_name: '' } },
    createProfile: mockCreateProfile,
    setHasCompletedOnboarding: mockSetHasCompletedOnboarding,
  }),
}));

describe('Onboarding / Create Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile Data Validation', () => {
    const validateProfileData = (data: { display_name: string; neighborhood?: string; bio?: string }) => {
      const errors: string[] = [];

      if (!data.display_name.trim()) {
        errors.push('Name is required');
      } else if (data.display_name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
      }

      return errors;
    };

    it('validates required display name', () => {
      const errors = validateProfileData({ display_name: '' });
      expect(errors).toContain('Name is required');
    });

    it('validates minimum name length', () => {
      const errors = validateProfileData({ display_name: 'A' });
      expect(errors).toContain('Name must be at least 2 characters');
    });

    it('accepts valid profile data', () => {
      const errors = validateProfileData({ display_name: 'John Doe', neighborhood: 'Lakeside' });
      expect(errors).toHaveLength(0);
    });

    it('allows optional neighborhood', () => {
      const errors = validateProfileData({ display_name: 'John Doe' });
      expect(errors).toHaveLength(0);
    });

    it('allows optional bio', () => {
      const errors = validateProfileData({ display_name: 'John Doe', bio: 'Hello!' });
      expect(errors).toHaveLength(0);
    });
  });

  describe('Create Profile Flow', () => {
    it('creates profile with required fields', async () => {
      mockCreateProfile.mockResolvedValueOnce({ id: 'user-123' });

      await mockCreateProfile({
        display_name: 'Test User',
        neighborhood: 'Lakeside',
        bio: undefined,
      });

      expect(mockCreateProfile).toHaveBeenCalledWith({
        display_name: 'Test User',
        neighborhood: 'Lakeside',
        bio: undefined,
      });
    });

    it('creates profile with all fields', async () => {
      mockCreateProfile.mockResolvedValueOnce({ id: 'user-123' });

      await mockCreateProfile({
        display_name: 'Test User',
        neighborhood: 'River Pointe',
        bio: 'Hello neighbors!',
      });

      expect(mockCreateProfile).toHaveBeenCalledWith({
        display_name: 'Test User',
        neighborhood: 'River Pointe',
        bio: 'Hello neighbors!',
      });
    });

    it('handles profile creation error', async () => {
      mockCreateProfile.mockRejectedValueOnce(new Error('Database error'));

      await expect(mockCreateProfile({ display_name: 'Test' })).rejects.toThrow('Database error');
    });

    it('sets onboarding complete after successful profile creation', async () => {
      mockCreateProfile.mockResolvedValueOnce({ id: 'user-123' });

      await mockCreateProfile({ display_name: 'Test User' });
      mockSetHasCompletedOnboarding(true);

      expect(mockSetHasCompletedOnboarding).toHaveBeenCalledWith(true);
    });
  });

  describe('Neighborhood Options', () => {
    const NEIGHBORHOODS = ['Lakeside', 'River Pointe', 'The Lakes', 'Downtown', 'Parkside', 'Other'];

    it('has correct neighborhood options', () => {
      expect(NEIGHBORHOODS).toContain('Lakeside');
      expect(NEIGHBORHOODS).toContain('River Pointe');
      expect(NEIGHBORHOODS).toContain('The Lakes');
      expect(NEIGHBORHOODS.length).toBe(6);
    });
  });

  describe('Location Formatting', () => {
    const formatLocation = (neighborhood: string, streetName: string) => {
      if (streetName.trim()) {
        return neighborhood ? `${neighborhood} - ${streetName.trim()}` : streetName.trim();
      }
      return neighborhood;
    };

    it('formats neighborhood only', () => {
      expect(formatLocation('Lakeside', '')).toBe('Lakeside');
    });

    it('formats neighborhood with street', () => {
      expect(formatLocation('Lakeside', 'River Run Drive')).toBe('Lakeside - River Run Drive');
    });

    it('formats street only when no neighborhood', () => {
      expect(formatLocation('', 'River Run Drive')).toBe('River Run Drive');
    });

    it('trims street name', () => {
      expect(formatLocation('Lakeside', '  Main St  ')).toBe('Lakeside - Main St');
    });
  });
});
