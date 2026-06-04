import React, { useState } from 'react';
import AgentStatusManager from './AgentStatusManager';
import TeamActivityFeed from './TeamActivityFeed';

interface TeamActivity {
  id: string;
  agentName: string;
  agentAvatar: string;
  action: 'login' | 'logout' | 'escalation' | 'note';
  timestamp: Date;
  details?: string;
}

interface TeamManagementProps {
  className?: string;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ className = '' }) => {
  const [activities, setActivities] = useState<TeamActivity[]>([
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
  ]);

  const handleActivityLog = (agentName: string, action: 'login' | 'logout') => {
    const newActivity: TeamActivity = {
      id: `${Date.now()}`,
      agentName,
      agentAvatar: '/user-avatar.png',
      action,
      timestamp: new Date(),
    };

    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <AgentStatusManager onActivityLog={handleActivityLog} />
      <TeamActivityFeed activities={activities} />
    </div>
  );
};

export default TeamManagement;
