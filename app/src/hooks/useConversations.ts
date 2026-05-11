import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Profile, Conversation, Message } from '../types';
import { getUserFriendlyError } from '../utils';

export type ConversationWithDetails = Conversation & {
  otherUser: Pick<Profile, 'id' | 'display_name' | 'avatar_url'>;
  unreadCount: number;
};

export function useConversations() {
  const { user, isInitialized } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

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

      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false })
        .limit(20);

      if (convError) throw convError;
      if (!isMounted.current) return;

      if (!convData || convData.length === 0) {
        setConversations([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const participantIds = new Set<string>();
      convData.forEach((c) => {
        participantIds.add(c.participant_1);
        participantIds.add(c.participant_2);
      });

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', [...participantIds]);

      if (!isMounted.current) return;

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

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
      if (isMounted.current) {
        setError(err.message || 'Failed to load conversations');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    isMounted.current = true;

    if (isInitialized && user) {
      fetchConversations();
    } else if (isInitialized) {
      setConversations([]);
      setIsLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [isInitialized, user?.id]);

  const startConversation = useCallback(async (otherUserId: string, listingId?: string): Promise<string | null> => {
    if (!user || user.id === otherUserId) return null;

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`)
        .maybeSingle();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: otherUserId,
          listing_id: listingId || null,
        })
        .select('id')
        .single();

      if (createError) throw createError;

      return newConv.id;
    } catch (err) {
      console.error('Error starting conversation:', err);
      return null;
    }
  }, [user]);

  return {
    conversations,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchConversations(true),
    startConversation,
  };
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

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
      if (!isMounted.current) return;

      setMessages(data || []);

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to load messages');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [conversationId, user?.id]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !user || !content.trim()) return;

    try {
      const { error: sendError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (sendError) throw sendError;

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
  }, [conversationId, user?.id]);

  useEffect(() => {
    isMounted.current = true;
    fetchMessages();

    return () => {
      isMounted.current = false;
    };
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
}
