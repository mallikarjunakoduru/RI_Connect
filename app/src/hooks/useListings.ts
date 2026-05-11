import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { ListingWithSeller } from '../components/listings';
import { getUserFriendlyError } from '../utils';

interface UseListingsOptions {
  categoryFilter?: string;
  typeFilter?: string;
}

export function useListings(options: UseListingsOptions = {}) {
  const { user, isInitialized } = useAuth();
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const { categoryFilter, typeFilter } = options;

  const fetchListings = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

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

      if (listingsError) throw listingsError;
      if (!isMounted.current) return;

      if (!listingsData || listingsData.length === 0) {
        setListings([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const sellerIds = [...new Set(listingsData.map((l) => l.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', sellerIds);

      if (!isMounted.current) return;

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      let savedListingIds: string[] = [];
      if (user) {
        const { data: saved } = await supabase
          .from('saved_listings')
          .select('listing_id')
          .eq('user_id', user.id);
        savedListingIds = saved?.map((s) => s.listing_id) || [];
      }

      if (!isMounted.current) return;

      const transformedListings: ListingWithSeller[] = listingsData.map((listing: any) => ({
        ...listing,
        seller: profileMap.get(listing.seller_id) || {
          id: listing.seller_id,
          display_name: 'Unknown',
          avatar_url: null,
        },
        isSaved: savedListingIds.includes(listing.id),
      }));

      setListings(transformedListings);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      if (isMounted.current) {
        setError(getUserFriendlyError(err));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [user?.id, categoryFilter, typeFilter]);

  const toggleSave = useCallback(async (listingId: string) => {
    if (!user) return;

    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const isCurrentlySaved = listing.isSaved;

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
      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, isSaved: isCurrentlySaved } : l
        )
      );
    }
  }, [user, listings]);

  useEffect(() => {
    isMounted.current = true;

    if (isInitialized) {
      fetchListings();
    }

    return () => {
      isMounted.current = false;
    };
  }, [isInitialized, categoryFilter, typeFilter]);

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
