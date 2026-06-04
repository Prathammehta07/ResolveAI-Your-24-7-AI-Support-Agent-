import { Ticket, Clock, Star, DollarSign, RotateCcw, History, Download } from 'lucide-react';

interface StatsPanelProps {
  ticketsResolved: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  costSaved: number;
  onResetChat: () => void;
  onExportLog: () => void;
  onViewHistory: () => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  glowColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, glowColor }) => (
  <div 
    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    style={{ 
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2)`
    }}
  >
    <div 
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ 
        background: `${glowColor}`,
        boxShadow: `0 0 12px ${glowColor}`
      }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({
  ticketsResolved,
  avgResolutionTime,
  satisfactionScore,
  costSaved,
  onResetChat,
  onExportLog,
  onViewHistory,
}) => {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Stat Cards */}
      <div className="space-y-3">
        <StatCard
          icon={<Ticket className="w-4 h-4 text-[#10B981]" />}
          value={`+${ticketsResolved}`}
          label="Resolved Today"
          color="#10B981"
          glowColor="rgba(16, 185, 129, 0.15)"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-[#06B6D4]" />}
          value={`${avgResolutionTime} min`}
          label="Avg Resolution"
          color="#06B6D4"
          glowColor="rgba(6, 182, 212, 0.15)"
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-[#F97316]" />}
          value={`${satisfactionScore}%`}
          label="Satisfaction"
          color="#F97316"
          glowColor="rgba(249, 115, 22, 0.15)"
        />
        <StatCard
          icon={<DollarSign className="w-4 h-4 text-[#F8FAFC]" />}
          value={`$${costSaved.toLocaleString()}`}
          label="Cost Saved Today"
          color="#F8FAFC"
          glowColor="rgba(248, 250, 252, 0.1)"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-2">
        <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 px-1">Quick Actions</p>
        <div className="space-y-2">
          <button
            onClick={onResetChat}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[#E2E8F0] transition-all duration-200 hover:bg-[rgba(99,102,241,0.15)] hover:text-[#F1F5F9] hover:border-[rgba(99,102,241,0.4)]"
            style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Chat
          </button>
          <button
            onClick={onViewHistory}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[#E2E8F0] transition-all duration-200 hover:bg-[rgba(99,102,241,0.15)] hover:text-[#F1F5F9] hover:border-[rgba(99,102,241,0.4)]"
            style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <History className="w-4 h-4" />
            View History
          </button>
          <button
            onClick={onExportLog}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[#E2E8F0] transition-all duration-200 hover:bg-[rgba(99,102,241,0.15)] hover:text-[#F1F5F9] hover:border-[rgba(99,102,241,0.4)]"
            style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <Download className="w-4 h-4" />
            Export Log
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-auto pt-3">
        <div 
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full"
          style={{ 
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.2)'
          }}
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <div 
              className="absolute inset-0 w-2 h-2 rounded-full bg-[#10B981] animate-ping"
              style={{ animationDuration: '2s' }}
            />
          </div>
          <span className="text-xs font-semibold text-[#10B981]">AI Agent Active</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
