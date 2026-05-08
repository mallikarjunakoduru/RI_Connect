import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Profile, Conversation, Message } from '../types';

export type ConversationWithDetails = Conversation & {
  otherUser: Pick<Profile, 'id' | 'display_name' | 'avatar_url'>;
  unreadCount: number;
};

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async (refresh = false) => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      console.log('Fetching conversations...');

      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false })
        .limit(20);

      if (convError) throw convError;

      console.log('Conversations fetched:', convData?.length || 0);

      if (!convData || convData.length === 0) {
        setConversations([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Get participant profiles
      const participantIds = new Set<string>();
      convData.forEach((c) => {
        participantIds.add(c.participant_1);
        participantIds.add(c.participant_2);
      });

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', [...participantIds]);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // Transform data
      const transformedConversations: ConversationWithDetails[] = convData.map((conv: any) => {
        const otherUserId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
        const otherUser = profileMap.get(otherUserId) || {
          id: otherUserId,
          display_name: 'Unknown',
          avatar_url: null,
        };
        return {
          ...conv,
          otherUser,
          unreadCount: 0,
        };
      });

      setConversations(transformedConversations);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  return {
    conversations,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchConversations(true),
  };
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !user || !content.trim()) return;

    try {
      const { error: sendError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (sendError) throw sendError;

      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message_preview: content.trim().slice(0, 100),
        })
        .eq('id', conversationId);
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId, user?.id]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
}
