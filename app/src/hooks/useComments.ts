import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { CommentWithAuthor } from '../types';
import { getUserFriendlyError } from '../utils';

export function useComments(postId: string | null) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (!isMounted.current) return;

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        setIsLoading(false);
        return;
      }

      const authorIds = [...new Set(commentsData.map((c) => c.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', authorIds);

      if (!isMounted.current) return;

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const commentMap = new Map<string, CommentWithAuthor>();
      const rootComments: CommentWithAuthor[] = [];

      commentsData.forEach((comment) => {
        const author = profileMap.get(comment.author_id) || {
          id: comment.author_id,
          display_name: 'Unknown',
          avatar_url: null,
        };

        const commentWithAuthor: CommentWithAuthor = {
          ...comment,
          author,
          replies: [],
        };

        commentMap.set(comment.id, commentWithAuthor);
      });

      commentsData.forEach((comment) => {
        const commentWithAuthor = commentMap.get(comment.id)!;

        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(commentWithAuthor);
          }
        } else {
          rootComments.push(commentWithAuthor);
        }
      });

      setComments(rootComments);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      if (isMounted.current) {
        setError(getUserFriendlyError(err));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [postId]);

  const addComment = useCallback(async (content: string, parentId?: string): Promise<boolean> => {
    if (!postId || !user || !content.trim()) return false;

    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          parent_id: parentId || null,
          content: content.trim(),
        });

      if (insertError) throw insertError;

      const { data: postData } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (postData) {
        await supabase
          .from('posts')
          .update({ comments_count: (postData.comments_count || 0) + 1 })
          .eq('id', postId);
      }

      await fetchComments();
      return true;
    } catch (err: any) {
      console.error('Error adding comment:', err);
      return false;
    }
  }, [postId, user, fetchComments]);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!user || !postId) return false;

    try {
      const { error: deleteError } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', commentId)
        .eq('author_id', user.id);

      if (deleteError) throw deleteError;

      const { data: postData } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (postData && postData.comments_count > 0) {
        await supabase
          .from('posts')
          .update({ comments_count: postData.comments_count - 1 })
          .eq('id', postId);
      }

      await fetchComments();
      return true;
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      return false;
    }
  }, [user, postId, fetchComments]);

  // Initial fetch only when postId changes
  useEffect(() => {
    isMounted.current = true;
    fetchComments();

    return () => {
      isMounted.current = false;
    };
  }, [postId]);

  // Real-time subscription - separate from fetch
  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    refresh: fetchComments,
  };
}
