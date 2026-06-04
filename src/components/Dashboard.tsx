import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Ticket, Clock, Star, DollarSign, TrendingUp, TrendingDown,
  Download, FileText, CheckCircle, AlertTriangle, XCircle
} from 'lucide-react';
import { getHourlyDistribution, getTopIssues, getSavingsTrend, getResolutionTrend, getDemoConversations } from '@/utils/demoData';
import { getIntentColor, getIntentLabel } from '@/utils/intentDetector';
import { exportToPDF, exportToCSV, exportToJSON, exportToText } from '@/utils/reportExport';
import ReportExportModal from './ReportExportModal';

interface DashboardProps {
  ticketsResolved: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  costSaved: number;
}

type DateRange = 'today' | 'week' | 'month';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  chart?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon, iconBg, chart }) => (
  <div 
    className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    style={{ 
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-[#F1F5F9] mt-0.5">{value}</p>
        </div>
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {change}
      </div>
    </div>
    {chart && <div className="h-16 mt-2">{chart}</div>}
  </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="px-3 py-2 rounded-lg text-xs"
        style={{ 
          background: 'linear-gradient(135deg, #1E293B, #334155)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <p className="text-[#94A3B8] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({
  ticketsResolved,
  avgResolutionTime,
  satisfactionScore,
  costSaved,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [animatedTickets, setAnimatedTickets] = useState(0);
  const [animatedTime, setAnimatedTime] = useState(0);
  const [animatedSat, setAnimatedSat] = useState(0);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  // Filter data based on date range
  const getFilteredData = () => {
    let multiplier = 1;
    
    switch (dateRange) {
      case 'week':
        multiplier = 7;
        break;
      case 'month':
        multiplier = 30;
        break;
      default:
        multiplier = 1;
    }
    
    return {
      ticketsResolved: Math.round(ticketsResolved * multiplier),
      costSaved: Math.round(costSaved * multiplier),
      hourlyData: getHourlyDistribution().map(h => ({
        ...h,
        resolved: Math.round(h.resolved * multiplier),
        escalated: Math.round(h.escalated * multiplier)
      })),
      resolutionTrend: getResolutionTrend().map(r => ({
        ...r,
        resolved: Math.round(r.resolved * multiplier),
        escalated: Math.round(r.escalated * multiplier)
      })),
      savingsData: getSavingsTrend().map(s => ({
        ...s,
        savings: Math.round(s.savings * multiplier)
      }))
    };
  };

  const filteredData = getFilteredData();

  // Number animation on mount and when date range changes
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      setAnimatedTickets(Math.round(filteredData.ticketsResolved * eased));
      setAnimatedTime(Math.round(avgResolutionTime * 10 * eased) / 10);
      setAnimatedSat(Math.round(satisfactionScore * eased));
      setAnimatedCost(Math.round(filteredData.costSaved * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [filteredData.ticketsResolved, avgResolutionTime, satisfactionScore, filteredData.costSaved, dateRange]);

  const topIssues = getTopIssues();
  const demoConversations = getDemoConversations();

  const satisfactionData = [
    { name: 'Satisfied', value: satisfactionScore, color: '#F97316' },
    { name: 'Neutral', value: 100 - satisfactionScore - 3, color: '#64748B' },
    { name: 'Dissatisfied', value: 3, color: '#EF4444' },
  ];

  const COLORS = ['#F97316', '#06B6D4', '#10B981', '#8B5CF6', '#EF4444', '#64748B'];

  const recentActivity = demoConversations.slice(0, 8).map(conv => ({
    time: conv.messages[0]?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '10:00 AM',
    issueType: getIntentLabel(conv.issueType),
    issueColor: getIntentColor(conv.issueType),
    status: conv.status,
    resolutionTime: `${conv.resolutionTime} min`,
  }));

  const statusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-[#10B981]" />;
      case 'escalated': return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      default: return <XCircle className="w-4 h-4 text-[#EF4444]" />;
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      resolved: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981' },
      escalated: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
      'in_progress': { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
    };
    const style = styles[status] || styles['in_progress'];
    return (
      <span 
        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize"
        style={{ background: style.bg, color: style.text }}
      >
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Export handlers
  const handleExport = (format: 'pdf' | 'csv' | 'json' | 'text') => {
    const reportData = {
      ticketsResolved,
      avgResolutionTime,
      satisfactionScore,
      costSaved,
      dateRange: dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'This Week' : 'This Month',
      generatedAt: new Date(),
    };

    const conversations = getDemoConversations().map(conv => ({
      id: conv.id,
      messages: conv.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
      issueType: getIntentLabel(conv.issueType),
      resolutionTime: conv.resolutionTime,
      status: conv.status,
    }));

    switch (format) {
      case 'pdf':
        exportToPDF(reportData, conversations);
        break;
      case 'csv':
        exportToCSV(conversations);
        break;
      case 'json':
        exportToJSON(reportData, conversations);
        break;
      case 'text':
        exportToText(reportData, conversations);
        break;
    }

    setShowExportModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 h-full" style={{ maxHeight: '100%' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Analytics Dashboard</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">Real-time support performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>

          {/* Date Range Picker */}
          <div 
            className="flex items-center rounded-xl p-1"
            style={{ 
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(100, 116, 139, 0.2)'
            }}
          >
            {(['today', 'week', 'month'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: dateRange === range ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                  color: dateRange === range ? '#FFFFFF' : '#94A3B8',
                  boxShadow: dateRange === range ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Tickets Resolved"
          value={String(animatedTickets)}
          change="+23%"
          isPositive={true}
          icon={<Ticket className="w-5 h-5 text-[#10B981]" />}
          iconBg="rgba(16, 185, 129, 0.15)"
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.resolutionTrend}>
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10B981" 
                  fill="rgba(16, 185, 129, 0.1)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          }
        />
        <StatCard
          title="Avg Resolution"
          value={`${animatedTime} min`}
          change="-18%"
          isPositive={true}
          icon={<Clock className="w-5 h-5 text-[#06B6D4]" />}
          iconBg="rgba(6, 182, 212, 0.15)"
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.hourlyData.slice(0, 6)}>
                <Bar dataKey="resolved" fill="#06B6D4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          }
        />
        <StatCard
          title="Satisfaction"
          value={`${animatedSat}%`}
          change="+5%"
          isPositive={true}
          icon={<Star className="w-5 h-5 text-[#F97316]" />}
          iconBg="rgba(249, 115, 22, 0.15)"
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={18}
                  outerRadius={28}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          }
        />
        <StatCard
          title="Cost Saved"
          value={`$${animatedCost.toLocaleString()}`}
          change="+31%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-[#F8FAFC]" />}
          iconBg="rgba(248, 250, 252, 0.1)"
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.savingsData}>
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#F8FAFC" 
                  fill="rgba(248, 250, 252, 0.05)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Resolution Trend */}
        <div 
          className="rounded-2xl p-5 transition-all duration-200 hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Resolution Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={filteredData.resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#64748B', fontSize: 11 }} 
                axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748B', fontSize: 11 }} 
                axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                name="Resolved" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="escalated" 
                name="Escalated" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Issues */}
        <div 
          className="rounded-2xl p-5 transition-all duration-200 hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Top Issues</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topIssues} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
              <XAxis 
                type="number" 
                tick={{ fill: '#64748B', fontSize: 11 }} 
                axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#64748B', fontSize: 11 }} 
                axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {topIssues.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div 
        className="rounded-2xl p-5 mb-6 transition-all duration-200 hover:shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Hourly Distribution</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={filteredData.hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#64748B', fontSize: 11 }} 
              axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#64748B', fontSize: 11 }} 
              axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="resolved" 
              name="Resolved" 
              fill="#06B6D4" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="escalated" 
              name="Escalated" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Table */}
      <div 
        className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(99,102,241,0.15)]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#818CF8]" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Recent Activity</h3>
          </div>
          <span className="text-xs text-[#94A3B8]">{recentActivity.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(99,102,241,0.15)]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Issue Type</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Resolution</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr 
                  key={index}
                  className="border-b border-[rgba(99,102,241,0.08)] transition-colors hover:bg-[rgba(99,102,241,0.08)]"
                  style={{ background: index % 2 === 0 ? 'rgba(30, 41, 59, 0.4)' : 'transparent' }}
                >
                  <td className="px-5 py-3 text-sm text-[#E2E8F0]">{activity.time}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ background: activity.issueColor }}
                      />
                      <span className="text-sm text-[#F1F5F9]">{activity.issueType}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {statusIcon(activity.status)}
                      {statusBadge(activity.status)}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#E2E8F0]">{activity.resolutionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-xs text-[#94A3B8]">
          ResolveAI Analytics — Data refreshes in real-time
        </p>
      </div>

      {/* Export Modal */}
      <ReportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default Dashboard;
