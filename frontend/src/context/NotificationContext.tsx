import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextProps {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  }, [removeNotification]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon text-success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon text-danger" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon text-warning" size={20} />;
      case 'info':
      default:
        return <Info className="toast-icon text-info" size={20} />;
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      
      {/* Toast Stack Container */}
      <div className="toast-container">
        {notifications.map(n => (
          <div key={n.id} className={`toast-notification toast-${n.type}`}>
            <div className="toast-content-wrapper">
              {getIcon(n.type)}
              <span className="toast-message">{n.message}</span>
            </div>
            <button className="toast-close-btn" onClick={() => removeNotification(n.id)}>
              <X size={16} />
            </button>
            <div className="toast-progress-bar" />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
