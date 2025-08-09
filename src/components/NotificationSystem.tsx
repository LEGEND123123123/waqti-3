import React, { useState, useEffect, createContext, useContext } from 'react';
import { Bell, X, Check, AlertCircle, MessageSquare, DollarSign, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, subscribeToNotifications } from '../lib/supabaseClient';

interface Notification {
  id: string;
  type: 'message' | 'booking' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  metadata: any;
  created_at: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to real-time notifications
      const subscription = subscribeToNotifications(user.id, (payload) => {
        const newNotification = {
          ...payload.new,
          created_at: new Date(payload.new.created_at)
        };
        setNotifications(prev => [newNotification, ...prev]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data?.map(notif => ({
        ...notif,
        created_at: new Date(notif.created_at)
      })) || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationBell: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F18F01] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown 
          onClose={() => setShowDropdown(false)}
          setActivePage={setActivePage}
        />
      )}
    </div>
  );
};

const NotificationDropdown: React.FC<{
  onClose: () => void;
  setActivePage: (page: string) => void;
}> = ({ onClose, setActivePage }) => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'booking':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">الإشعارات</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#2E86AB] hover:text-[#1e5f7a]"
              >
                تحديد الكل كمقروء
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.slice(0, 10).map(notification => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              !notification.is_read ? 'bg-blue-50' : ''
            }`}
            onClick={() => {
              markAsRead(notification.id);
              if (notification.action_url) {
                setActivePage(notification.action_url);
              }
              onClose();
            }}
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h4>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-[#F18F01] rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(notification.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 10 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => {
              setActivePage('notifications');
              onClose();
            }}
            className="w-full text-center text-sm text-[#2E86AB] hover:text-[#1e5f7a] font-medium"
          >
            عرض جميع الإشعارات
          </button>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد إشعارات</p>
        </div>
      )}
    </div>
  );
};