import React from 'react';
import { Users, LogIn, LogOut, Activity, Clock } from 'lucide-react';

interface TeamActivity {
  id: string;
  agentName: string;
  agentAvatar: string;
  action: 'login' | 'logout' | 'escalation' | 'note';
  timestamp: Date;
  details?: string;
}

interface TeamActivityFeedProps {
  activities?: TeamActivity[];
}

const TeamActivityFeed: React.FC<TeamActivityFeedProps> = ({ activities: propActivities }) => {
  // Use prop activities directly, fallback to default if not provided
  const activities = propActivities || [
    {
      id: '1',
      agentName: 'Sarah Johnson',
      agentAvatar: '/user-avatar.png',
      action: 'login',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    },
    {
      id: '2',
      agentName: 'Mike Chen',
      agentAvatar: '/user-avatar.png',
      action: 'escalation',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      details: 'Took over conversation #12345',
    },
    {
      id: '3',
      agentName: 'Emily Davis',
      agentAvatar: '/user-avatar.png',
      action: 'logout',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    },
    {
      id: '4',
      agentName: 'Alex Rodriguez',
      agentAvatar: '/user-avatar.png',
      action: 'login',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    },
    {
      id: '5',
      agentName: 'Lisa Wang',
      agentAvatar: '/user-avatar.png',
      action: 'note',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      details: 'Updated FAQ document',
    },
  ];

  const getActionIcon = (action: TeamActivity['action']) => {
    switch (action) {
      case 'login':
        return <LogIn className="w-4 h-4 text-[#10B981]" />;
      case 'logout':
        return <LogOut className="w-4 h-4 text-[#EF4444]" />;
      case 'escalation':
        return <Activity className="w-4 h-4 text-[#F59E0B]" />;
      case 'note':
        return <Clock className="w-4 h-4 text-[#818CF8]" />;
    }
  };

  const getActionColor = (action: TeamActivity['action']) => {
    switch (action) {
      case 'login':
        return 'rgba(16, 185, 129, 0.15)';
      case 'logout':
        return 'rgba(239, 68, 68, 0.15)';
      case 'escalation':
        return 'rgba(245, 158, 11, 0.15)';
      case 'note':
        return 'rgba(99, 102, 241, 0.15)';
    }
  };

  const getActionText = (action: TeamActivity['action']) => {
    switch (action) {
      case 'login':
        return 'logged in';
      case 'logout':
        return 'logged out';
      case 'escalation':
        return 'took escalation';
      case 'note':
        return 'added note';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(99,102,241,0.15)]">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#818CF8]" />
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Team Activity</h3>
        </div>
        <span className="text-xs text-[#94A3B8]">{activities.length} recent activities</span>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-[rgba(99,102,241,0.1)] max-h-[400px] overflow-y-auto">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            className="px-6 py-4 flex items-start gap-4 hover:bg-[rgba(99,102,241,0.05)] transition-colors"
          >
            {/* Avatar */}
            <div className="relative">
              <img 
                src={activity.agentAvatar} 
                alt={activity.agentName}
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: '2px solid rgba(99, 102, 241, 0.3)' }}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: getActionColor(activity.action) }}
              >
                {getActionIcon(activity.action)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#E2E8F0]">
                <span className="font-semibold text-[#F1F5F9]">{activity.agentName}</span>
                {' '}
                <span className="text-[#94A3B8]">{getActionText(activity.action)}</span>
              </p>
              
              {activity.details && (
                <p className="text-xs text-[#94A3B8] mt-1">{activity.details}</p>
              )}
              
              <p className="text-[11px] text-[#64748B] mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div 
        className="px-6 py-3 border-t border-[rgba(99,102,241,0.15)] text-center"
        style={{ background: 'rgba(30, 41, 59, 0.4)' }}
      >
        <button className="text-xs text-[#818CF8] hover:text-[#A5B4FC] transition-colors font-medium">
          View All Activity →
        </button>
      </div>
    </div>
  );
};

export default TeamActivityFeed;
