
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { getRelativeTime } from '@/utils/dateUtils';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotification 
  } = useNotifications();
  
  if (!user) return null;
  
  const notifications = getUserNotifications(user.id);
  
  const handleClick = (id: string) => {
    markAsRead(id);
  };
  
  const handleClear = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    clearNotification(id);
  };
  
  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg glass border border-border z-50">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-medium">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            className="text-xs text-primary hover:underline"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 hover:bg-accent/5 transition-colors cursor-pointer relative ${
                !notification.isRead ? 'bg-primary/5' : ''
              }`}
              onClick={() => handleClick(notification.id)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {getRelativeTime(notification.timestamp)}
                </span>
              </div>
              <p className="text-sm mt-1">{notification.message}</p>
              
              {notification.eventId && (
                <Link 
                  to={`/events/${notification.eventId}`}
                  className="text-xs text-primary mt-2 inline-block hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                    onClose();
                  }}
                >
                  View Event
                </Link>
              )}
              
              <div className="absolute right-2 bottom-2 flex gap-2">
                {!notification.isRead && (
                  <button 
                    className="p-1 rounded-full hover:bg-primary/10 text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    aria-label="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button 
                  className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
                  onClick={(e) => handleClear(e, notification.id)}
                  aria-label="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
