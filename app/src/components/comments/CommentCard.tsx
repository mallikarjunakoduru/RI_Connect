import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MessageCircle, Trash2 } from 'lucide-react-native';

import { colors, spacing, fontSize } from '../../constants';
import { Avatar } from '../ui';
import { CommentWithAuthor } from '../../types';

interface CommentCardProps {
  comment: CommentWithAuthor;
  currentUserId?: string;
  onReply: (parentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  depth?: number;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CommentCard({
  comment,
  currentUserId,
  onReply,
  onDelete,
  depth = 0,
}: CommentCardProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnComment = currentUserId === comment.author_id;
  const maxDepth = 2;

  const handleReply = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onReply(comment.id, replyText);
    setIsSubmitting(false);

    if (success) {
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(comment.id);
  };

  return (
    <View style={[styles.container, { marginLeft: depth > 0 ? spacing.lg : 0 }]}>
      <View style={styles.commentRow}>
        <Avatar
          source={comment.author.avatar_url}
          name={comment.author.display_name}
          size="sm"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.authorName}>{comment.author.display_name}</Text>
            <Text style={styles.time}>{formatTimeAgo(comment.created_at)}</Text>
          </View>
          <Text style={styles.commentText}>{comment.content}</Text>
          <View style={styles.actions}>
            {depth < maxDepth && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageCircle size={14} color={colors.textSecondary} />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
            )}
            {isOwnComment && (
              <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                <Trash2 size={14} color={colors.error} />
                <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {showReplyInput && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            placeholderTextColor={colors.textTertiary}
            value={replyText}
            onChangeText={setReplyText}
            multiline
            maxLength={500}
          />
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowReplyInput(false);
                setReplyText('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, (!replyText.trim() || isSubmitting) && styles.submitButtonDisabled]}
              onPress={handleReply}
              disabled={!replyText.trim() || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Posting...' : 'Reply'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  commentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  authorName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  commentText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  replyInputContainer: {
    marginTop: spacing.sm,
    marginLeft: spacing.lg + spacing.sm,
  },
  replyInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text,
    minHeight: 60,
    maxHeight: 100,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  cancelButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textInverse,
  },
  replies: {
    marginTop: spacing.sm,
  },
});
