
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Notification } from '@/types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  getUserNotifications: (userId: string) => Notification[];
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'New Event: Tech Hackathon',
    message: 'A new tech event has been added that matches your interests!',
    type: 'event',
    isRead: false,
    timestamp: '2025-04-18T10:00:00Z',
    eventId: '1'
  },
  {
    id: '2',
    userId: '1',
    title: 'Reminder: AI Seminar Tomorrow',
    message: "Don't forget about the AI seminar tomorrow at 2 PM!",
    type: 'reminder',
    isRead: false,
    timestamp: '2025-04-18T14:00:00Z',
    eventId: '3'
  },
  {
    id: '3',
    userId: '2',
    title: 'New Comment on Basketball Tournament',
    message: 'Someone commented on an event you\'re attending.',
    type: 'comment',
    isRead: true,
    timestamp: '2025-04-17T09:30:00Z',
    eventId: '4'
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Update unread count when notifications or user changes
  useEffect(() => {
    if (user) {
      const count = notifications.filter(notification => 
        notification.userId === user.id && !notification.isRead
      ).length;
      setUnreadCount(count);
    } else {
      setUnreadCount(0);
    }
  }, [notifications, user]);
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: (notifications.length + 1).toString(),
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read for the current user
  const markAllAsRead = () => {
    if (!user) return;
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.userId === user.id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  // Clear/delete a notification
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Get notifications for a specific user
  const getUserNotifications = (userId: string) => {
    return notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    getUserNotifications
  };
  
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
