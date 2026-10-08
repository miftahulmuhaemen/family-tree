import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Trash2, Bell } from 'lucide-react';
import { useNotifications, type AppNotification } from '@/context/NotificationContext';
import { useIsNeumorphic } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface NotificationsViewProps {
  terms?: any;
}

export function NotificationsView({ terms }: NotificationsViewProps) {
  const { notifications, markAllAsRead, clearNotifications, removeNotification } = useNotifications();
  const isNeu = useIsNeumorphic();

  // Mark all notifications as read when viewing the notifications tab
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const formatTimestamp = (date: Date) => {
    try {
      const d = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);

      if (diffMin < 1) return 'Baru saja';
      if (diffMin < 60) return `${diffMin}m lalu`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}j lalu`;
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 space-y-3">
      {/* Header with actions */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-500 fill-blue-500" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {terms?.notifications || "Notifikasi"}
          </h3>
          <span className="text-xs text-zinc-500">
            ({notifications.length})
          </span>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={clearNotifications}
              className={cn(
                "p-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer",
                isNeu ? "hover:bg-black/5 dark:hover:bg-white/5" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
              title="Hapus semua notifikasi"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-zinc-400 space-y-2">
            <Bell className="w-8 h-8 stroke-1 text-zinc-300 dark:text-zinc-700" />
            <p className="text-xs">{terms?.no_notifications || "Belum ada notifikasi"}</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "group p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5",
                isNeu
                  ? "shadow-neu-raised-sm bg-[#e6e9ef] dark:bg-[#1c2027] border-white/60 dark:border-white/5"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                {getIcon(notif.type)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {formatTimestamp(notif.timestamp)}
                    </span>
                  </div>
                  {notif.message && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 break-words">
                      {notif.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeNotification(notif.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-opacity cursor-pointer shrink-0"
                title="Hapus"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsView;
