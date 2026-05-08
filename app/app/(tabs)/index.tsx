import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Search } from 'lucide-react-native';

import { colors, spacing, fontSize, FEED_CATEGORIES } from '../../src/constants';
import { useAuth } from '../../src/hooks/useAuth';
import { usePosts } from '../../src/hooks/usePosts';
import { PostCard } from '../../src/components/posts';

type Category = (typeof FEED_CATEGORIES)[number];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { posts, isLoading, isRefreshing, error, refresh, toggleLike } = usePosts({
    categoryFilter: selectedCategory,
  });

  const showComingSoon = (feature: string) => {
    const message = `${feature} will be available soon!`;
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Coming Soon', message);
    }
  };

  const renderCategoryChip = (category: Category) => {
    const isSelected = selectedCategory === category.id;
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
        onPress={() => setSelectedCategory(category.id)}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    const selectedCat = FEED_CATEGORIES.find((c) => c.id === selectedCategory);
    const isFiltered = selectedCategory !== 'all';

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>{isFiltered ? selectedCat?.icon || '🔍' : '📝'}</Text>
        <Text style={styles.emptyStateTitle}>
          {isFiltered ? `No ${selectedCat?.name || ''} posts` : 'No posts yet'}
        </Text>
        <Text style={styles.emptyStateText}>
          {isFiltered
            ? `Be the first to share something in ${selectedCat?.name}!`
            : 'Be the first to share something with your community!'}
        </Text>
        {isFiltered && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={styles.retryButtonText}>View All Posts</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading posts...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>😕</Text>
      <Text style={styles.emptyStateTitle}>Couldn't load posts</Text>
      <Text style={styles.emptyStateText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>RI Connect</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => showComingSoon('Search')}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => showComingSoon('Notifications')}
          >
            <Bell size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {FEED_CATEGORIES.map(renderCategoryChip)}
      </ScrollView>

      {isLoading && !isRefreshing ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onLike={toggleLike}
              onComment={(id) => showComingSoon('Comments')}
              onShare={(id) => showComingSoon('Share')}
              onPress={(id) => showComingSoon('Post details')}
              onAuthorPress={(id) => showComingSoon('User profile')}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIcon: {
    padding: spacing.xs,
    position: 'relative',
  },
  categoriesContainer: {
    backgroundColor: colors.surface,
    maxHeight: 56,
  },
  categoriesContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  categoryTextSelected: {
    color: colors.textInverse,
  },
  listContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textInverse,
  },
});
