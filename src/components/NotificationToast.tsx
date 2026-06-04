import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 means no auto-dismiss
}

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(true);
    
    if (notification.duration && notification.duration > 0) {
      const startTime = Date.now();
      const duration = notification.duration;
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(() => onDismiss(notification.id), 300);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [notification, onDismiss]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#10B981]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <Info className="w-5 h-5 text-[#6366F1]" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      default:
        return 'rgba(99, 102, 241, 0.4)';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.9))',
        border: `1px solid ${getBorderColor()}`,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#F1F5F9] mb-1">{notification.title}</h4>
          <p className="text-xs text-[#CBD5E1]">{notification.message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(notification.id), 300);
          }}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-[rgba(100,116,139,0.2)] transition-colors"
        >
          <X className="w-4 h-4 text-[#94A3B8]" />
        </button>
      </div>
      
      {/* Progress bar */}
      {notification.duration && notification.duration > 0 && (
        <div className="h-1 bg-[rgba(100,116,139,0.2)] rounded-b-xl overflow-hidden">
          <div
            className="h-full transition-all duration-50 ease-linear"
            style={{
              width: `${progress}%`,
              background: getBorderColor(),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationToast;
