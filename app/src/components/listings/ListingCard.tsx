import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';

import { colors, spacing, fontSize, borderRadius } from '../../constants';
import { Listing, Profile } from '../../types';

export type ListingWithSeller = Listing & {
  seller: Pick<Profile, 'id' | 'display_name' | 'avatar_url'>;
  isSaved?: boolean;
};

interface ListingCardProps {
  listing: ListingWithSeller;
  onPress?: (listingId: string) => void;
  onSave?: (listingId: string) => void;
  variant?: 'grid' | 'list';
}

function formatPrice(price: number | null, listingType: string): string {
  if (listingType === 'free') return 'Free';
  if (listingType === 'wanted') return 'Wanted';
  if (price === null) return 'Contact for price';
  return `$${price.toLocaleString()}`;
}

function formatCondition(condition: string | null): string {
  if (!condition) return '';
  const labels: Record<string, string> = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
  };
  return labels[condition] || condition;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 3600) return 'Just now';
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ListingCard({
  listing,
  onPress,
  onSave,
  variant = 'grid',
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(listing.isSaved ?? false);

  const handleSave = (e: any) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(listing.id);
  };

  const handlePress = () => {
    onPress?.(listing.id);
  };

  const imageUri = listing.images?.[0];
  const priceText = formatPrice(listing.price, listing.listing_type);
  const conditionText = formatCondition(listing.condition);

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.listImageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.listImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.listImagePlaceholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          {listing.status !== 'available' && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {listing.status === 'sold' ? 'Sold' : 'Pending'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {listing.title}
          </Text>

          <Text style={styles.listPrice}>{priceText}</Text>

          <View style={styles.listMeta}>
            {conditionText && (
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{conditionText}</Text>
              </View>
            )}
            {listing.location && (
              <View style={styles.locationRow}>
                <MapPin size={12} color={colors.textTertiary} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {listing.location}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.listTime}>
            {formatTimeAgo(listing.created_at)}
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Heart
            size={22}
            color={isSaved ? colors.error : colors.textSecondary}
            fill={isSaved ? colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.gridContainer}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.gridImageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.gridImagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <TouchableOpacity style={styles.gridSaveButton} onPress={handleSave}>
          <Heart
            size={20}
            color={isSaved ? colors.error : colors.textInverse}
            fill={isSaved ? colors.error : 'transparent'}
          />
        </TouchableOpacity>

        {listing.status !== 'available' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {listing.status === 'sold' ? 'Sold' : 'Pending'}
            </Text>
          </View>
        )}

        {listing.listing_type === 'free' && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
        )}
      </View>

      <View style={styles.gridContent}>
        <Text style={styles.gridPrice}>{priceText}</Text>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={styles.gridFooter}>
          {listing.location && (
            <View style={styles.locationRow}>
              <MapPin size={10} color={colors.textTertiary} />
              <Text style={styles.gridLocationText} numberOfLines={1}>
                {listing.location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    width: '48%',
    marginBottom: spacing.sm,
  },
  gridImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  gridSaveButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: spacing.xs,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textInverse,
    textTransform: 'uppercase',
  },
  freeBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  freeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textInverse,
  },
  gridContent: {
    padding: spacing.sm,
  },
  gridPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  gridTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  gridFooter: {
    marginTop: spacing.xs,
  },
  gridLocationText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginLeft: 2,
    flex: 1,
  },
  listContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  listImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
  },
  listPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  conditionBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  conditionText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginLeft: 2,
    flex: 1,
  },
  listTime: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  saveButton: {
    padding: spacing.sm,
    justifyContent: 'center',
  },
});
