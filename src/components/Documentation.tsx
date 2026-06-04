import React, { useState } from 'react';
import { BookOpen, ChevronRight, Search, ExternalLink, MessageSquare, Users, BarChart3, Settings, Keyboard } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections: DocSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <BookOpen className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Welcome to ResolveAI</h2>
            <p className="text-[#94A3B8] leading-relaxed">
              ResolveAI is an intelligent customer support platform powered by Claude AI. 
              It helps businesses automate customer service, track performance metrics, 
              and manage support teams efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="rounded-xl p-4"
              style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-2">🤖 AI-Powered Chat</h3>
              <p className="text-xs text-[#94A3B8]">Intelligent responses using Claude API with intent detection</p>
            </div>
            <div 
              className="rounded-xl p-4"
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-2">📊 Real-time Analytics</h3>
              <p className="text-xs text-[#94A3B8]">Track tickets, resolution time, and satisfaction scores</p>
            </div>
            <div 
              className="rounded-xl p-4"
              style={{ 
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-2">👥 Team Management</h3>
              <p className="text-xs text-[#94A3B8]">Monitor agent activity and manage team status</p>
            </div>
            <div 
              className="rounded-xl p-4"
              style={{ 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <h3 className="text-sm font-semibold text-[#F1F5F9] mb-2">💬 Conversation History</h3>
              <p className="text-xs text-[#94A3B8]">Save and restore previous conversations</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Key Features</h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li className="flex items-start gap-2">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Smart intent detection for accurate responses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Real-time conversation tracking and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Team collaboration with agent status management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Customizable API settings and model configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <span>Keyboard shortcuts for efficient navigation</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'chat',
      title: 'Chat Guide',
      icon: <MessageSquare className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Using the Chat Interface</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Getting Started</h3>
            <ol className="space-y-3 text-sm text-[#94A3B8] list-decimal list-inside">
              <li>Enter your message in the input field at the bottom</li>
              <li>Press Enter or click the Send button</li>
              <li>Wait for the AI to respond (typically 1-2 seconds)</li>
              <li>Review the response and take action if needed</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Intent Detection</h3>
            <p className="text-sm text-[#94A3B8] mb-3">
              The system automatically detects the intent of user messages:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['Order Tracking', 'Refund Request', 'Password Reset', 'Billing Issue', 'Product Info', 'Technical Support'].map(intent => (
                <div 
                  key={intent}
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ 
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: '#818CF8'
                  }}
                >
                  {intent}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Escalation</h3>
            <p className="text-sm text-[#94A3B8]">
              If the AI cannot resolve an issue, you can escalate the conversation to a human agent.
              Click the "Escalate" button when it appears, or type keywords like "agent", "human", or "support".
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Message Actions</h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>Copy</span>
                <span>Copy message content to clipboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>👍</span>
                <span>Rate response as helpful</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>👎</span>
                <span>Rate response as unhelpful</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Analytics Dashboard</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Key Metrics</h3>
            <div className="space-y-3 text-sm text-[#94A3B8]">
              <p><strong className="text-[#F1F5F9]">Tickets Resolved:</strong> Total number of customer issues resolved</p>
              <p><strong className="text-[#F1F5F9]">Avg Resolution Time:</strong> Average time to resolve a ticket (in hours)</p>
              <p><strong className="text-[#F1F5F9]">Satisfaction Score:</strong> Customer satisfaction percentage</p>
              <p><strong className="text-[#F1F5F9]">Cost Saved:</strong> Estimated cost savings from automation</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Date Range Filter</h3>
            <p className="text-sm text-[#94A3B8] mb-3">
              Use the date range selector to view metrics for different periods:
            </p>
            <div className="flex gap-2">
              {['Today', 'This Week', 'This Month'].map(range => (
                <span 
                  key={range}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ 
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818CF8',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Charts & Visualizations</h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>• <strong>Trend Line:</strong> Shows ticket volume over time</li>
              <li>• <strong>Category Distribution:</strong> Pie chart of issue types</li>
              <li>• <strong>Hourly Activity:</strong> Bar chart of peak hours</li>
              <li>• <strong>Resolution Status:</strong> Breakdown of resolved vs escalated</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'team',
      title: 'Team Management',
      icon: <Users className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Managing Your Team</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Agent Status</h3>
            <p className="text-sm text-[#94A3B8] mb-3">
              Monitor and manage agent login/logout status in real-time:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[#94A3B8]"><strong className="text-[#F1F5F9]">Online:</strong> Agent is active and available</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-[#64748B]" />
                <span className="text-[#94A3B8]"><strong className="text-[#F1F5F9]">Offline:</strong> Agent is not available</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Login/Logout</h3>
            <p className="text-sm text-[#94A3B8]">
              Click the Login/Logout button next to each agent to change their status.
              The system automatically logs the activity with timestamps.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Activity Feed</h3>
            <p className="text-sm text-[#94A3B8]">
              View recent team activities including logins, logouts, escalations, and notes.
              Activities are displayed in reverse chronological order.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Work Hours Tracking</h3>
            <p className="text-sm text-[#94A3B8]">
              The system tracks total hours worked by each agent today,
              helping you monitor productivity and schedule shifts.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      title: 'Settings & API',
      icon: <Settings className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Configuration</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Claude API Setup</h3>
            <ol className="space-y-3 text-sm text-[#94A3B8] list-decimal list-inside">
              <li>Click the Settings icon in the top navigation bar</li>
              <li>Enter your Anthropic API key</li>
              <li>Select your preferred model (e.g., claude-3-opus)</li>
              <li>Adjust max tokens and temperature settings</li>
              <li>Click "Save Settings"</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">API Key Security</h3>
            <div 
              className="rounded-lg p-4 text-sm"
              style={{ 
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#F59E0B'
              }}
            >
              ⚠️ Keep your API key secure. Never share it publicly or commit it to version control.
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Model Parameters</h3>
            <div className="space-y-3 text-sm text-[#94A3B8]">
              <p><strong className="text-[#F1F5F9]">Max Tokens:</strong> Maximum length of AI response (default: 1000)</p>
              <p><strong className="text-[#F1F5F9]">Temperature:</strong> Creativity level (0.0 = deterministic, 1.0 = creative)</p>
              <p><strong className="text-[#F1F5F9]">Model:</strong> Choose from available Claude models</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Demo Mode</h3>
            <p className="text-sm text-[#94A3B8]">
              Without an API key, the app runs in demo mode with simulated responses.
              This is useful for testing the UI and features before connecting to the API.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      icon: <Keyboard className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-4">Keyboard Shortcuts</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Navigation</h3>
            <div className="space-y-2">
              {[
                { keys: ['Alt', '1'], action: 'Switch to Chat' },
                { keys: ['Alt', '2'], action: 'Switch to Dashboard' },
                { keys: ['Alt', '3'], action: 'Switch to Team' },
              ].map(shortcut => (
                <div key={shortcut.action} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(30, 41, 59, 0.6)' }}>
                  <span className="text-sm text-[#94A3B8]">{shortcut.action}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && <span className="text-[#64748B]">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Actions</h3>
            <div className="space-y-2">
              {[
                { keys: ['Ctrl', 'R'], action: 'Reset Chat' },
                { keys: ['Ctrl', 'E'], action: 'Export Log' },
                { keys: ['Ctrl', 'H'], action: 'View History' },
                { keys: ['Ctrl', 'S'], action: 'Open Settings' },
                { keys: ['?'], action: 'Show Shortcuts' },
              ].map(shortcut => (
                <div key={shortcut.action} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(30, 41, 59, 0.6)' }}>
                  <span className="text-sm text-[#94A3B8]">{shortcut.action}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && <span className="text-[#64748B]">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Chat Input</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(30, 41, 59, 0.6)' }}>
                <span className="text-sm text-[#94A3B8]">Send Message</span>
                <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(30, 41, 59, 0.6)' }}>
                <span className="text-sm text-[#94A3B8]">New Line</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>Shift</kbd>
                  <span className="text-[#64748B]">+</span>
                  <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>Enter</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContent = sections.find(s => s.id === activeSection)?.content;

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div 
        className="w-64 flex-shrink-0 overflow-y-auto"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          borderRight: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-[rgba(99,102,241,0.15)]">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#818CF8]" />
            <h2 className="text-lg font-bold text-[#F1F5F9]">Documentation</h2>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[rgba(15,23,42,0.6)] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[rgba(99,102,241,0.5)]"
              style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          {filteredSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                activeSection === section.id ? 'scale-[1.02]' : 'hover:bg-[rgba(99,102,241,0.1)]'
              }`}
              style={{
                background: activeSection === section.id 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                  : 'transparent',
                color: activeSection === section.id ? '#F1F5F9' : '#94A3B8',
                border: activeSection === section.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              }}
            >
              {section.icon}
              <span>{section.title}</span>
              {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[rgba(99,102,241,0.15)] mt-auto">
          <a 
            href="#"
            className="flex items-center gap-2 text-xs text-[#818CF8] hover:text-[#A5B4FC] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View API Reference</span>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl">
          {activeContent}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
