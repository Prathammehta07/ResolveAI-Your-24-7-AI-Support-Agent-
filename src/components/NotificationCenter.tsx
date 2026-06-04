import { Bell, AlertTriangle, Clock, Info } from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'alert' | 'escalation' | 'sla_breach' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const NotificationCenter: React.FC<{
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}> = ({ notifications, onMarkAsRead }) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-[#EF4444]" />;
      case 'escalation':
        return <Bell className="w-5 h-5 text-[#F59E0B]" />;
      case 'sla_breach':
        return <Clock className="w-5 h-5 text-[#EF4444]" />;
      default:
        return <Info className="w-5 h-5 text-[#818CF8]" />;
    }
  };

  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'rgba(239, 68, 68, 0.2)';
      case 'high':
        return 'rgba(245, 158, 11, 0.2)';
      case 'medium':
        return 'rgba(99, 102, 241, 0.2)';
      default:
        return 'rgba(100, 116, 139, 0.2)';
    }
  };

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          onClick={() => onMarkAsRead(notification.id)}
          className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
            !notification.read ? 'border-l-4' : ''
          }`}
          style={{
            background: notification.read 
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.4))'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
            border: notification.read 
              ? '1px solid rgba(99, 102, 241, 0.2)'
              : `1px solid ${getPriorityColor(notification.priority)}`,
            borderLeftColor: !notification.read ? getPriorityColor(notification.priority) : undefined,
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: getPriorityColor(notification.priority) }}
            >
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-[#F1F5F9]">{notification.title}</h4>
                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                )}
              </div>
              <p className="text-xs text-[#CBD5E1] mb-2">{notification.message}</p>
              <p className="text-[11px] text-[#94A3B8]">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
