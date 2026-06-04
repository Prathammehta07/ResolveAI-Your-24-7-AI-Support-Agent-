import { useState, useEffect } from 'react';
import { LogIn, LogOut, User, Users, Clock } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isOnline: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
  totalHoursToday?: number;
}

interface AgentStatusManagerProps {
  onActivityLog?: (agentName: string, action: 'login' | 'logout') => void;
}

const AgentStatusManager: React.FC<AgentStatusManagerProps> = ({ onActivityLog }) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/user-avatar.png',
      role: 'Senior Support Agent',
      isOnline: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
      totalHoursToday: 3.5,
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: '/user-avatar.png',
      role: 'Support Agent',
      isOnline: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      totalHoursToday: 5.2,
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: '/user-avatar.png',
      role: 'Team Lead',
      isOnline: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 480), // 8 hours ago
      lastLogout: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      totalHoursToday: 7.5,
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      avatar: '/user-avatar.png',
      role: 'Support Agent',
      isOnline: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
      lastLogout: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      totalHoursToday: 6.0,
    },
  ]);

  const onlineCount = agents.filter(a => a.isOnline).length;
  const offlineCount = agents.length - onlineCount;

  const handleToggleStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        const newStatus = !agent.isOnline;
        
        // Log activity
        if (onActivityLog) {
          onActivityLog(agent.name, newStatus ? 'login' : 'logout');
        }
        
        return {
          ...agent,
          isOnline: newStatus,
          lastLogin: newStatus ? new Date() : agent.lastLogin,
          lastLogout: !newStatus ? new Date() : agent.lastLogout,
        };
      }
      return agent;
    }));
  };

  const formatTime = (date?: Date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '0h';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
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
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Agent Status</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[#10B981] font-medium">{onlineCount} Online</span>
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#64748B]" />
            <span className="text-[#94A3B8] font-medium">{offlineCount} Offline</span>
          </span>
        </div>
      </div>

      {/* Agent List */}
      <div className="divide-y divide-[rgba(99,102,241,0.1)] max-h-[500px] overflow-y-auto">
        {agents.map(agent => (
          <div 
            key={agent.id} 
            className="px-6 py-4 hover:bg-[rgba(99,102,241,0.05)] transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Avatar with Status Indicator */}
              <div className="relative">
                <img 
                  src={agent.avatar} 
                  alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ 
                    border: agent.isOnline 
                      ? '2px solid #10B981' 
                      : '2px solid rgba(99, 102, 241, 0.3)',
                    opacity: agent.isOnline ? 1 : 0.7
                  }}
                />
                {/* Online Status Dot */}
                {agent.isOnline && (
                  <div 
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#1E293B]"
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                  />
                )}
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#F1F5F9]">{agent.name}</p>
                  {agent.isOnline && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ 
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981'
                      }}
                    >
                      Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">{agent.role}</p>
                
                {/* Time Info */}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#64748B]">
                  {agent.isOnline ? (
                    <>
                      <span className="flex items-center gap-1">
                        <LogIn className="w-3 h-3" />
                        Logged in {formatTime(agent.lastLogin)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(agent.totalHoursToday)} today
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <LogOut className="w-3 h-3" />
                        Logged out {formatTime(agent.lastLogout)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Worked {formatDuration(agent.totalHoursToday)} today
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => handleToggleStatus(agent.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                  agent.isOnline ? 'hover:bg-[rgba(239,68,68,0.15)]' : 'hover:bg-[rgba(16,185,129,0.15)]'
                }`}
                style={{
                  background: agent.isOnline 
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                  color: agent.isOnline ? '#EF4444' : '#10B981',
                  border: `1px solid ${agent.isOnline ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                }}
              >
                {agent.isOnline ? (
                  <span className="flex items-center gap-1.5">
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div 
        className="px-6 py-3 border-t border-[rgba(99,102,241,0.15)] flex items-center justify-between text-xs"
        style={{ background: 'rgba(30, 41, 59, 0.4)' }}
      >
        <span className="text-[#94A3B8]">Total Agents: {agents.length}</span>
        <span className="text-[#94A3B8]">
          Avg Hours: {formatDuration(agents.reduce((sum, a) => sum + (a.totalHoursToday || 0), 0) / agents.length)}
        </span>
      </div>
    </div>
  );
};

export default AgentStatusManager;
