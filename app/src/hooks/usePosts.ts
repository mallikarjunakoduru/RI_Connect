import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { PostWithAuthor } from '../components/posts';
import { getUserFriendlyError } from '../utils';

interface UsePostsOptions {
  categoryFilter?: string;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { user, isInitialized } = useAuth();
  const { categoryFilter } = options;
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      let filteredPostIds: string[] | null = null;
      if (categoryFilter && categoryFilter !== 'all') {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categoryFilter)
          .single();

        if (categoryData) {
          const { data: postCats } = await supabase
            .from('post_categories')
            .select('post_id')
            .eq('category_id', categoryData.id);

          filteredPostIds = postCats?.map((pc) => pc.post_id) || [];

          if (filteredPostIds.length === 0) {
            if (isMounted.current) {
              setPosts([]);
              setIsLoading(false);
              setIsRefreshing(false);
            }
            return;
          }
        }
      }

      let query = supabase
        .from('posts')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (filteredPostIds) {
        query = query.in('id', filteredPostIds);
      }

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;
      if (!isMounted.current) return;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const authorIds = [...new Set(postsData.map((p) => p.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, neighborhood')
        .in('id', authorIds);

      if (!isMounted.current) return;

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const postIds = postsData.map((p) => p.id);
      const { data: postCategoriesData } = await supabase
        .from('post_categories')
        .select('post_id, category_id')
        .in('post_id', postIds);

      const categoryIds = [...new Set(postCategoriesData?.map((pc) => pc.category_id) || [])];
      let categoryMap = new Map<string, { id: string; name: string; icon: string }>();

      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, name, icon')
          .in('id', categoryIds);

        categoryMap = new Map(categoriesData?.map((c) => [c.id, c]) || []);
      }

      const postCategoryMap = new Map<string, { id: string; name: string; icon: string }[]>();
      postCategoriesData?.forEach((pc) => {
        const cat = categoryMap.get(pc.category_id);
        if (cat) {
          const existing = postCategoryMap.get(pc.post_id) || [];
          existing.push(cat);
          postCategoryMap.set(pc.post_id, existing);
        }
      });

      let likedPostIds: string[] = [];
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        likedPostIds = likes?.map((l) => l.post_id) || [];
      }

      if (!isMounted.current) return;

      const transformedPosts: PostWithAuthor[] = postsData.map((post: any) => ({
        ...post,
        author: profileMap.get(post.author_id) || {
          id: post.author_id,
          display_name: 'Unknown',
          avatar_url: null,
          neighborhood: null,
        },
        categories: postCategoryMap.get(post.id) || [],
        isLiked: likedPostIds.includes(post.id),
      }));

      setPosts(transformedPosts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      if (isMounted.current) {
        setError(getUserFriendlyError(err));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [categoryFilter, user?.id]);

  const toggleLike = useCallback(async (postId: string) => {
    if (!user) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = post.isLiked;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p
      )
    );

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count - 1 })
          .eq('id', postId);
      } else {
        await supabase.from('post_likes').insert({
          post_id: postId,
          user_id: user.id,
        });

        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                isLiked: isCurrentlyLiked,
                likes_count: post.likes_count,
              }
            : p
        )
      );
    }
  }, [user, posts]);

  // Only fetch once auth is initialized
  useEffect(() => {
    isMounted.current = true;

    if (isInitialized) {
      fetchPosts();
    }

    return () => {
      isMounted.current = false;
    };
  }, [isInitialized, categoryFilter]);

  const refresh = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    isRefreshing,
    error,
    refresh,
    toggleLike,
  };
}
