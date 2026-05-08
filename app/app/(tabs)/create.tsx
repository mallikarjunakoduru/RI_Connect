import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Camera,
  ChevronDown,
  FileText,
  ShoppingBag,
  DollarSign,
} from 'lucide-react-native';

import {
  colors,
  spacing,
  fontSize,
  borderRadius,
  FEED_CATEGORIES,
  MARKETPLACE_CATEGORIES,
  LISTING_TYPES,
  LISTING_CONDITIONS,
  NEIGHBORHOODS,
} from '../../src/constants';
import { Button, StatusMessage, Input } from '../../src/components/ui';
import { useAuth } from '../../src/hooks/useAuth';
import { supabase } from '../../src/lib/supabase';

type StatusState = {
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
} | null;

type CreateMode = 'post' | 'listing';

export default function CreateScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const [mode, setMode] = useState<CreateMode>('post');

  // Post state
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [postCategory, setPostCategory] = useState<string>('general');
  const [showPostCategoryPicker, setShowPostCategoryPicker] = useState(false);

  // Listing state
  const [listingTitle, setListingTitle] = useState('');
  const [listingDescription, setListingDescription] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingType, setListingType] = useState<string>('for_sale');
  const [listingCategory, setListingCategory] = useState<string>('furniture');
  const [listingCondition, setListingCondition] = useState<string>('good');
  const [listingLocation, setListingLocation] = useState<string>('');
  const [listingImages, setListingImages] = useState<string[]>([]);

  // Shared state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const selectedPostCategoryData = FEED_CATEGORIES.find(
    (c) => c.id === postCategory
  );

  const pickImages = async (forListing = false) => {
    const { status: permissionStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionStatus !== 'granted') {
      if (Platform.OS === 'web') {
        window.alert('Please allow access to your photos to upload images.');
      } else {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos to upload images.'
        );
      }
      return;
    }

    const currentImages = forListing ? listingImages : postImages;
    const maxImages = forListing ? 6 : 4;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages - currentImages.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      if (forListing) {
        setListingImages([...listingImages, ...newImages].slice(0, maxImages));
      } else {
        setPostImages([...postImages, ...newImages].slice(0, maxImages));
      }
    }
  };

  const removeImage = (index: number, forListing = false) => {
    if (forListing) {
      setListingImages(listingImages.filter((_, i) => i !== index));
    } else {
      setPostImages(postImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmitPost = async () => {
    if (!postContent.trim()) {
      setStatus({ type: 'error', message: 'Please write something to post.' });
      return;
    }

    if (!profile) {
      setStatus({
        type: 'error',
        message: 'You must be logged in to create a post.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'info', message: 'Publishing your post...' });

    try {
      // First, get the category ID from the database
      let categoryId: string | null = null;
      if (postCategory && postCategory !== 'all') {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', postCategory)
          .single();

        categoryId = categoryData?.id || null;
        console.log('Category lookup:', postCategory, '->', categoryId);
      }

      // Create the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          author_id: profile.id,
          content: postContent.trim(),
          images: postImages,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Link the category if found
      if (categoryId && post) {
        const { error: linkError } = await supabase
          .from('post_categories')
          .insert({
            post_id: post.id,
            category_id: categoryId,
          });

        if (linkError) {
          console.error('Error linking category:', linkError);
        } else {
          console.log('Category linked successfully');
        }
      }

      setStatus({ type: 'success', title: 'Posted!', message: 'Your post has been published.' });
      setTimeout(() => router.replace('/(tabs)'), 1500);
    } catch (error: any) {
      console.error('Error creating post:', error);
      setStatus({
        type: 'error',
        title: 'Failed to Post',
        message: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitListing = async () => {
    if (!listingTitle.trim()) {
      setStatus({ type: 'error', message: 'Please enter a title for your listing.' });
      return;
    }

    if (!listingDescription.trim()) {
      setStatus({ type: 'error', message: 'Please add a description.' });
      return;
    }

    if (!profile) {
      setStatus({
        type: 'error',
        message: 'You must be logged in to create a listing.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'info', message: 'Creating your listing...' });

    try {
      const price = listingType === 'free' ? null : parseFloat(listingPrice) || null;

      console.log('Creating listing with:', {
        seller_id: profile.id,
        title: listingTitle.trim(),
        listing_type: listingType,
        category: listingCategory,
      });

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          seller_id: profile.id,
          title: listingTitle.trim(),
          description: listingDescription.trim(),
          price,
          listing_type: listingType,
          category: listingCategory,
          condition: listingType === 'service' ? null : listingCondition,
          images: listingImages,
          location: listingLocation || profile.neighborhood || null,
          status: 'available',
        })
        .select()
        .single();

      if (listingError) throw listingError;

      console.log('Listing created successfully:', listing);

      setStatus({
        type: 'success',
        title: 'Listed!',
        message: 'Your listing is now live.',
      });
      setTimeout(() => router.replace('/(tabs)/marketplace'), 1500);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      setStatus({
        type: 'error',
        title: 'Failed to Create Listing',
        message: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPostForm = () => (
    <>
      <TouchableOpacity
        style={styles.categorySelector}
        onPress={() => setShowPostCategoryPicker(!showPostCategoryPicker)}
      >
        <Text style={styles.categorySelectorIcon}>
          {selectedPostCategoryData?.icon}
        </Text>
        <Text style={styles.categorySelectorText}>
          {selectedPostCategoryData?.name}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {showPostCategoryPicker && (
        <View style={styles.categoryPicker}>
          {FEED_CATEGORIES.filter((c) => c.id !== 'all').map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryOption,
                postCategory === category.id && styles.categoryOptionSelected,
              ]}
              onPress={() => {
                setPostCategory(category.id);
                setShowPostCategoryPicker(false);
              }}
            >
              <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryOptionText,
                  postCategory === category.id && styles.categoryOptionTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        placeholderTextColor={colors.textTertiary}
        multiline
        value={postContent}
        onChangeText={setPostContent}
        maxLength={2000}
      />

      {postImages.length > 0 && (
        <View style={styles.imagesContainer}>
          {postImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => removeImage(index, false)}
              >
                <X size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.characterCount}>
        <Text style={styles.characterCountText}>{postContent.length}/2000</Text>
      </View>
    </>
  );

  const renderListingForm = () => (
    <>
      <View style={styles.listingTypeRow}>
        {LISTING_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.listingTypeChip,
              listingType === type.id && styles.listingTypeChipSelected,
            ]}
            onPress={() => setListingType(type.id)}
          >
            <Text
              style={[
                styles.listingTypeText,
                listingType === type.id && styles.listingTypeTextSelected,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Title"
        placeholder="What are you selling?"
        value={listingTitle}
        onChangeText={setListingTitle}
        containerStyle={styles.inputContainer}
      />

      {listingType !== 'free' && (
        <Input
          label="Price"
          placeholder="0.00"
          value={listingPrice}
          onChangeText={setListingPrice}
          keyboardType="decimal-pad"
          leftIcon={<DollarSign size={20} color={colors.textSecondary} />}
          containerStyle={styles.inputContainer}
        />
      )}

      <Text style={styles.sectionLabel}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {MARKETPLACE_CATEGORIES.filter((c) => c.id !== 'all').map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              listingCategory === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => setListingCategory(category.id)}
          >
            <Text style={styles.categoryChipIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryChipText,
                listingCategory === category.id && styles.categoryChipTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {listingType !== 'service' && (
        <>
          <Text style={styles.sectionLabel}>Condition</Text>
          <View style={styles.conditionRow}>
            {LISTING_CONDITIONS.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionChip,
                  listingCondition === condition.id && styles.conditionChipSelected,
                ]}
                onPress={() => setListingCondition(condition.id)}
              >
                <Text
                  style={[
                    styles.conditionText,
                    listingCondition === condition.id && styles.conditionTextSelected,
                  ]}
                >
                  {condition.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Input
        label="Description"
        placeholder="Describe your item..."
        value={listingDescription}
        onChangeText={setListingDescription}
        multiline
        numberOfLines={4}
        containerStyle={styles.inputContainer}
      />

      <Text style={styles.sectionLabel}>Location</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {NEIGHBORHOODS.map((neighborhood) => (
          <TouchableOpacity
            key={neighborhood}
            style={[
              styles.locationChip,
              listingLocation === neighborhood && styles.locationChipSelected,
            ]}
            onPress={() => setListingLocation(neighborhood)}
          >
            <Text
              style={[
                styles.locationText,
                listingLocation === neighborhood && styles.locationTextSelected,
              ]}
            >
              {neighborhood}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {listingImages.length > 0 && (
        <View style={styles.imagesContainer}>
          {listingImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => removeImage(index, true)}
              >
                <X size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </>
  );

  const currentImages = mode === 'post' ? postImages : listingImages;
  const maxImages = mode === 'post' ? 4 : 6;
  const canSubmit =
    mode === 'post'
      ? postContent.trim().length > 0
      : listingTitle.trim().length > 0 && listingDescription.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'post' ? 'New Post' : 'New Listing'}
          </Text>
          <Button
            onPress={mode === 'post' ? handleSubmitPost : handleSubmitListing}
            size="sm"
            disabled={!canSubmit || isSubmitting}
            loading={isSubmitting}
          >
            {mode === 'post' ? 'Post' : 'List'}
          </Button>
        </View>

        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'post' && styles.modeTabSelected]}
            onPress={() => setMode('post')}
          >
            <FileText
              size={20}
              color={mode === 'post' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.modeTabText,
                mode === 'post' && styles.modeTabTextSelected,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'listing' && styles.modeTabSelected]}
            onPress={() => setMode('listing')}
          >
            <ShoppingBag
              size={20}
              color={mode === 'listing' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.modeTabText,
                mode === 'listing' && styles.modeTabTextSelected,
              ]}
            >
              Listing
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {status && (
            <StatusMessage
              type={status.type}
              title={status.title}
              message={status.message}
            />
          )}

          {mode === 'post' ? renderPostForm() : renderListingForm()}
        </ScrollView>

        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => pickImages(mode === 'listing')}
            disabled={currentImages.length >= maxImages}
          >
            <Camera
              size={24}
              color={
                currentImages.length >= maxImages
                  ? colors.textTertiary
                  : colors.text
              }
            />
            <Text
              style={[
                styles.toolbarButtonText,
                currentImages.length >= maxImages &&
                  styles.toolbarButtonTextDisabled,
              ]}
            >
              Photo ({currentImages.length}/{maxImages})
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  modeTabSelected: {
    backgroundColor: colors.surface,
  },
  modeTabText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modeTabTextSelected: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  categorySelectorIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categorySelectorText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
    marginRight: spacing.xs,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  categoryOptionSelected: {
    backgroundColor: colors.primary,
  },
  categoryOptionIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryOptionText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  categoryOptionTextSelected: {
    color: colors.textInverse,
  },
  textInput: {
    fontSize: fontSize.lg,
    color: colors.text,
    lineHeight: 26,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  characterCountText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
  },
  toolbarButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  toolbarButtonTextDisabled: {
    color: colors.textTertiary,
  },
  listingTypeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  listingTypeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
  },
  listingTypeChipSelected: {
    backgroundColor: colors.primary,
  },
  listingTypeText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  listingTypeTextSelected: {
    color: colors.textInverse,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  horizontalScroll: {
    marginBottom: spacing.sm,
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
  categoryChipIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  categoryChipTextSelected: {
    color: colors.textInverse,
  },
  conditionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  conditionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
  },
  conditionChipSelected: {
    backgroundColor: colors.primary,
  },
  conditionText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  conditionTextSelected: {
    color: colors.textInverse,
  },
  locationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  locationChipSelected: {
    backgroundColor: colors.primary,
  },
  locationText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  locationTextSelected: {
    color: colors.textInverse,
  },
});
