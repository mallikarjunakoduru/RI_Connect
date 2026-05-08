import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
} from 'lucide-react-native';

import { colors, spacing, fontSize, borderRadius } from '../../constants';
import { Avatar } from '../ui';
import { Profile, Post } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type PostWithAuthor = Post & {
  author: Pick<Profile, 'id' | 'display_name' | 'avatar_url' | 'neighborhood'>;
  categories?: { id: string; name: string; icon: string }[];
  isLiked?: boolean;
};

interface PostCardProps {
  post: PostWithAuthor;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onPress?: (postId: string) => void;
  onAuthorPress?: (authorId: string) => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onPress,
  onAuthorPress,
}: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(post.id);
  };

  const handlePress = () => {
    onPress?.(post.id);
  };

  const handleAuthorPress = () => {
    onAuthorPress?.(post.author.id);
  };

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageCount = post.images.length;

    if (imageCount === 1) {
      return (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={styles.imageGrid}>
        {post.images.slice(0, 4).map((uri, index) => (
          <View
            key={index}
            style={[
              styles.gridImageContainer,
              imageCount === 2 && styles.gridImageHalf,
              imageCount === 3 && index === 0 && styles.gridImageLarge,
              imageCount >= 4 && styles.gridImageQuarter,
            ]}
          >
            <Image
              source={{ uri }}
              style={styles.gridImage}
              resizeMode="cover"
            />
            {index === 3 && imageCount > 4 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{imageCount - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorInfo} onPress={handleAuthorPress}>
          <Avatar
            source={post.author.avatar_url}
            name={post.author.display_name}
            size="md"
          />
          <View style={styles.authorText}>
            <Text style={styles.authorName}>{post.author.display_name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.timeText}>
                {formatTimeAgo(post.created_at)}
              </Text>
              {post.author.neighborhood && (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <MapPin size={12} color={colors.textTertiary} />
                  <Text style={styles.locationText}>
                    {post.author.neighborhood}
                  </Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {post.categories && post.categories.length > 0 && (
        <View style={styles.categories}>
          {post.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryChip}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.content} numberOfLines={6}>
        {post.content}
      </Text>

      {renderImages()}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart
            size={22}
            color={isLiked ? colors.error : colors.textSecondary}
            fill={isLiked ? colors.error : 'transparent'}
          />
          {likesCount > 0 && (
            <Text
              style={[styles.actionText, isLiked && styles.actionTextActive]}
            >
              {likesCount}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment?.(post.id)}
        >
          <MessageCircle size={22} color={colors.textSecondary} />
          {post.comments_count > 0 && (
            <Text style={styles.actionText}>{post.comments_count}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare?.(post.id)}
        >
          <Share2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  authorText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  metaDot: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginLeft: 2,
  },
  moreButton: {
    padding: spacing.xs,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  content: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  singleImage: {
    width: '100%',
    height: 200,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  gridImageContainer: {
    overflow: 'hidden',
  },
  gridImageHalf: {
    width: '50%',
    height: 150,
  },
  gridImageLarge: {
    width: '100%',
    height: 150,
  },
  gridImageQuarter: {
    width: '50%',
    height: 100,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: colors.textInverse,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    paddingVertical: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  actionTextActive: {
    color: colors.error,
  },
});
