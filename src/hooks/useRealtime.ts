import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useRealtimeMessages = (conversationId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !conversationId) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId]);

  return messages;
};

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(payload.new.title, {
              body: payload.new.message,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return notifications;
};

export const useRealtimeOrderUpdates = (orderId?: string) => {
  const { user } = useAuth();
  const [orderUpdates, setOrderUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !orderId) return;

    const channel = supabase
      .channel('order_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          setOrderUpdates(prev => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'milestones',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          setOrderUpdates(prev => [...prev, { type: 'milestone', ...payload.new }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, orderId]);

  return orderUpdates;
};

export const useRealtimeUserStatus = (userIds: string[]) => {
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userIds.length === 0) return;

    const channel = supabase
      .channel('user_status')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const statuses: Record<string, boolean> = {};
        
        Object.keys(state).forEach(userId => {
          statuses[userId] = state[userId].length > 0;
        });
        
        setUserStatuses(statuses);
      })
      .subscribe();

    // Track current user presence
    channel.track({
      user_id: userIds[0], // Assuming first ID is current user
      online_at: new Date().toISOString()
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userIds]);

  return userStatuses;
};

export const useRealtimeTyping = (conversationId: string) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !conversationId) return;

    const channel = supabase
      .channel(`typing_${conversationId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.user_id !== user.id) {
          setTypingUsers(prev => {
            if (payload.typing && !prev.includes(payload.user_id)) {
              return [...prev, payload.user_id];
            } else if (!payload.typing) {
              return prev.filter(id => id !== payload.user_id);
            }
            return prev;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId]);

  const sendTypingIndicator = (isTyping: boolean) => {
    supabase
      .channel(`typing_${conversationId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user?.id, typing: isTyping }
      });
  };

  return { typingUsers, sendTypingIndicator };
};