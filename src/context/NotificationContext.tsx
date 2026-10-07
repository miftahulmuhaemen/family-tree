import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

export interface ToastItem extends AppNotification {
  duration?: number;
}

export interface NotificationContextValue {
  notifications: AppNotification[];
  toasts: ToastItem[];
  unseenCount: number;
  notify: (opts: {
    title: string;
    message: string;
    type?: NotificationType;
    showToast?: boolean;
    duration?: number;
  }) => string;
  dismissToast: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const unseenCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const notify = useCallback((opts: {
    title: string;
    message: string;
    type?: NotificationType;
    showToast?: boolean;
    duration?: number;
  }) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNotif: AppNotification = {
      id,
      title: opts.title,
      message: opts.message,
      type: opts.type || 'info',
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (opts.showToast !== false) {
      const newToast: ToastItem = {
        ...newNotif,
        duration: opts.duration ?? 3000
      };
      setToasts(prev => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts
    }

    return id;
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const value = useMemo(() => ({
    notifications,
    toasts,
    unseenCount,
    notify,
    dismissToast,
    markAllAsRead,
    clearNotifications,
    removeNotification
  }), [notifications, toasts, unseenCount, notify, dismissToast, markAllAsRead, clearNotifications, removeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}
