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
import { Search, Plus, SlidersHorizontal } from 'lucide-react-native';

import { colors, spacing, fontSize, MARKETPLACE_CATEGORIES, LISTING_TYPES } from '../../src/constants';
import { Button } from '../../src/components/ui';
import { ListingCard } from '../../src/components/listings';
import { useListings } from '../../src/hooks/useListings';

type Category = (typeof MARKETPLACE_CATEGORIES)[number];
type ListingType = (typeof LISTING_TYPES)[number];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const { listings, isLoading, isRefreshing, error, refresh, toggleSave } = useListings({
    categoryFilter: selectedCategory !== 'all' ? selectedCategory : undefined,
    typeFilter: selectedType !== 'all' ? selectedType : undefined,
  });

  const showComingSoon = (feature: string) => {
    const message = `${feature} will be available soon!`;
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Coming Soon', message);
    }
  };

  const renderTypeTab = (type: ListingType | { id: string; name: string }) => {
    const isSelected = selectedType === type.id;
    return (
      <TouchableOpacity
        key={type.id}
        style={[styles.typeTab, isSelected && styles.typeTabSelected]}
        onPress={() => setSelectedType(type.id)}
      >
        <Text style={[styles.typeTabText, isSelected && styles.typeTabTextSelected]}>
          {type.name}
        </Text>
      </TouchableOpacity>
    );
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
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🛒</Text>
      <Text style={styles.emptyStateTitle}>No listings yet</Text>
      <Text style={styles.emptyStateText}>
        Be the first to sell or share something!
      </Text>
      <Button
        onPress={() => router.push('/(tabs)/create')}
        size="md"
        leftIcon={<Plus size={20} color={colors.textInverse} />}
        style={styles.emptyStateButton}
      >
        Create Listing
      </Button>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading listings...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>😕</Text>
      <Text style={styles.emptyStateTitle}>Couldn't load listings</Text>
      <Text style={styles.emptyStateText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => showComingSoon('Search')}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => showComingSoon('Filters')}
          >
            <SlidersHorizontal size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.typeTabs}>
        {renderTypeTab({ id: 'all', name: 'All' })}
        {LISTING_TYPES.map(renderTypeTab)}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {MARKETPLACE_CATEGORIES.map(renderCategoryChip)}
      </ScrollView>

      {isLoading && !isRefreshing ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={listings}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={(id) => showComingSoon('Listing details')}
              onSave={toggleSave}
              variant="grid"
            />
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/create')}
      >
        <Plus size={28} color={colors.textInverse} />
      </TouchableOpacity>
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
  },
  typeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  typeTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
  },
  typeTabSelected: {
    backgroundColor: colors.primary,
  },
  typeTabText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  typeTabTextSelected: {
    color: colors.textInverse,
  },
  categoriesContainer: {
    backgroundColor: colors.surface,
    maxHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primaryLight,
  },
  categoryIcon: {
    fontSize: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
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
    marginBottom: spacing.lg,
  },
  emptyStateButton: {
    marginTop: spacing.sm,
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
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
