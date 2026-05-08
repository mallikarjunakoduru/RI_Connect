import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { ListingWithSeller } from '../components/listings';

interface UseListingsOptions {
  categoryFilter?: string;
  typeFilter?: string;
}

export function useListings(options: UseListingsOptions = {}) {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { categoryFilter, typeFilter } = options;

  const fetchListings = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      console.log('Fetching listings...', { categoryFilter, typeFilter });

      let query = supabase
        .from('listings')
        .select('*')
        .in('status', ['available', 'pending'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('listing_type', typeFilter);
      }

      const { data: listingsData, error: listingsError } = await query;

      console.log('Listings query result:', {
        count: listingsData?.length || 0,
        error: listingsError,
      });

      if (listingsError) throw listingsError;

      if (!listingsData || listingsData.length === 0) {
        setListings([]);
        return;
      }

      // Get seller profiles
      const sellerIds = [...new Set(listingsData.map((l) => l.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', sellerIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // Get user's saved listings
      let savedListingIds: string[] = [];
      if (user) {
        const { data: saved } = await supabase
          .from('saved_listings')
          .select('listing_id')
          .eq('user_id', user.id);
        savedListingIds = saved?.map((s) => s.listing_id) || [];
      }

      // Transform the data
      const transformedListings: ListingWithSeller[] = listingsData.map((listing: any) => ({
        ...listing,
        seller: profileMap.get(listing.seller_id) || {
          id: listing.seller_id,
          display_name: 'Unknown',
          avatar_url: null,
        },
        isSaved: savedListingIds.includes(listing.id),
      }));

      console.log('Listings transformed:', transformedListings.length);
      setListings(transformedListings);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(err.message || 'Failed to load listings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, categoryFilter, typeFilter]);

  const toggleSave = useCallback(async (listingId: string) => {
    if (!user) return;

    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const isCurrentlySaved = listing.isSaved;

    // Optimistic update
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, isSaved: !isCurrentlySaved } : l
      )
    );

    try {
      if (isCurrentlySaved) {
        await supabase
          .from('saved_listings')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id);
      } else {
        await supabase.from('saved_listings').insert({
          listing_id: listingId,
          user_id: user.id,
        });
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      // Revert optimistic update
      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, isSaved: isCurrentlySaved } : l
        )
      );
    }
  }, [user, listings]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const refresh = useCallback(() => {
    fetchListings(true);
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    isRefreshing,
    error,
    refresh,
    toggleSave,
  };
}
