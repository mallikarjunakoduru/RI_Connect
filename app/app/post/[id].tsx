import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react-native';

import { colors, spacing, fontSize } from '../../src/constants';
import { Avatar } from '../../src/components/ui';
import { CommentsSection } from '../../src/components/comments';
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';
import { PostWithAuthor } from '../../src/types';

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

export default function PostDetailScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!postId) return;

    let isMounted = true;

    const fetchPost = async () => {
      try {
        setIsLoading(true);

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (postError) throw postError;
        if (!isMounted) return;

        const { data: authorData } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, neighborhood')
          .eq('id', postData.author_id)
          .single();

        if (!isMounted) return;

        let userLiked = false;
        if (user) {
          const { data: likeData } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .maybeSingle();

          userLiked = !!likeData;
        }

        if (!isMounted) return;

        const postWithAuthor: PostWithAuthor = {
          ...postData,
          author: authorData || {
            id: postData.author_id,
            display_name: 'Unknown',
            avatar_url: null,
            neighborhood: null,
          },
          categories: [],
          is_liked: userLiked,
        };

        setPost(postWithAuthor);
        setLikesCount(postData.likes_count);
        setIsLiked(userLiked);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [postId, user?.id]);

  const handleLike = async () => {
    if (!user || !post) return;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        await supabase
          .from('posts')
          .update({ likes_count: likesCount - 1 })
          .eq('id', post.id);
      } else {
        await supabase.from('post_likes').insert({
          post_id: post.id,
          user_id: user.id,
        });

        await supabase
          .from('posts')
          .update({ likes_count: likesCount + 1 })
          .eq('id', post.id);
      }
    } catch (err) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      console.error('Error toggling like:', err);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.postContainer}>
          <View style={styles.authorRow}>
            <Avatar
              source={post.author.avatar_url}
              name={post.author.display_name}
              size="md"
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author.display_name}</Text>
              <Text style={styles.postMeta}>
                {post.author.neighborhood && `${post.author.neighborhood} • `}
                {formatTimeAgo(post.created_at)}
              </Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart
                size={22}
                color={isLiked ? colors.error : colors.textSecondary}
                fill={isLiked ? colors.error : 'none'}
              />
              <Text style={[styles.actionText, isLiked && styles.actionTextLiked]}>
                {likesCount}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionButton}>
              <MessageCircle size={22} color={colors.textSecondary} />
              <Text style={styles.actionText}>{post.comments_count}</Text>
            </View>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <CommentsSection postId={post.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  postContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  authorInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  postMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  postContent: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionTextLiked: {
    color: colors.error,
  },
});
