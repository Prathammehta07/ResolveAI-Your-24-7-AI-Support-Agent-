import { useState, useCallback, useEffect } from 'react';
import { Settings, ExternalLink, MessageSquare, LayoutDashboard, Keyboard, Users, BookOpen } from 'lucide-react';
import type { Message, TabType, APISettings } from '@/types';
import { detectIntent } from '@/utils/intentDetector';
import { useClaudeAPI } from '@/hooks/useClaudeAPI';
import { useNotifications } from '@/hooks/useNotifications';
import { getInitialMessages, generateId } from '@/utils/demoData';
import { saveConversationToHistory, type HistoryItem } from '@/utils/conversationHistory';
import ChatWindow from '@/components/ChatWindow';
import Dashboard from '@/components/Dashboard';
import SettingsModal from '@/components/SettingsModal';
import ConversationHistoryModal from '@/components/ConversationHistoryModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import NotificationToast from '@/components/NotificationToast';
import TeamManagement from '@/components/TeamManagement';
import Documentation from '@/components/Documentation';
import LoginPage from '@/components/LoginPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [tabTransitioning, setTabTransitioning] = useState(false);

  // Notifications
  const { notifications, dismissNotification, showSuccess, showError, showInfo } = useNotifications();

  // Stats
  const [ticketsResolved, setTicketsResolved] = useState(47);
  const [avgResolutionTime] = useState(2.3);
  const [satisfactionScore] = useState(94);
  const [costSaved, setCostSaved] = useState(3200);

  const { sendMessage, isLoading, error, settings, updateSettings, clearError } = useClaudeAPI();

  // Sync isTyping with hook loading state
  useEffect(() => {
    setIsTyping(isLoading);
  }, [isLoading]);

  // Show error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleTabSwitch = useCallback((tab: TabType) => {
    if (tab === activeTab) return;
    setTabTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTabTransitioning(false);
    }, 150);
  }, [activeTab]);

  const createMessage = useCallback((role: 'user' | 'assistant', content: string, intent?: string): Message => ({
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
    intent,
    actions: role === 'assistant' ? { copy: false, thumbsUp: false, thumbsDown: false } : undefined,
  }), []);

  const handleSendMessage = useCallback(async (userContent: string, files?: any[]) => {
    if (isEscalated) return;

    const intent = detectIntent(userContent);
    
    // Create user message with file info if present
    let messageContent = userContent;
    if (files && files.length > 0) {
      const fileList = files.map(f => f.name).join(', ');
      messageContent += `\n\n[Attached ${files.length} file(s): ${fileList}]`;
    }
    
    const userMessage = createMessage('user', messageContent, intent);
    setMessages(prev => [...prev, userMessage]);

    // Check for escalation triggers
    const escalationKeywords = ['human', 'agent', 'person', 'representative', 'supervisor', 'manager'];
    const wantsHuman = escalationKeywords.some(kw => userContent.toLowerCase().includes(kw));
    
    if (wantsHuman) {
      setIsEscalated(true);
      const escalationMsg = createMessage('assistant', 
        "I understand you'd like to speak with a human agent. I'm connecting you with a specialist right now. I've shared your full conversation history so you won't have to repeat yourself. They should be with you shortly!",
        'escalation'
      );
      setMessages(prev => [...prev, escalationMsg]);
      return;
    }

    setIsTyping(true);

    try {
      // Use updated messages array including the new user message
      const updatedMessages = [...messages, userMessage];
      const response = await sendMessage(userContent, updatedMessages);
      
      const aiMessage = createMessage('assistant', response, intent);
      setMessages(prev => [...prev, aiMessage]);
      
      // Update stats
      setTicketsResolved(prev => prev + 1);
      setCostSaved(prev => prev + 68);
    } catch {
      // Error handled in hook, fallback response will be provided
    } finally {
      setIsTyping(false);
    }
  }, [messages, isEscalated, createMessage, sendMessage]);

  const handleCancelEscalation = useCallback(() => {
    setIsEscalated(false);
    const resumeMsg = createMessage('assistant',
      "No problem! I'm back to help you. What else can I assist you with?",
      'general'
    );
    setMessages(prev => [...prev, resumeMsg]);
  }, [createMessage]);

  const handleConfirmEscalation = useCallback(() => {
    const confirmedMsg = createMessage('assistant',
      "A human specialist has been notified and will join this conversation within 2-3 minutes. Your conversation history has been shared. Please hold on...",
      'escalation'
    );
    setMessages(prev => [...prev, confirmedMsg]);
  }, [createMessage]);

  const handleResetChat = useCallback(() => {
    // Save current conversation to history before resetting
    saveConversationToHistory({
      messages,
      isTyping,
      isEscalated,
      stats: {
        ticketsResolved,
        avgResolutionTime,
        satisfactionScore,
        costSaved,
      },
    });
    setMessages(getInitialMessages());
    setIsEscalated(false);
    showSuccess('Chat Reset', 'Started a new conversation');
  }, [messages, isTyping, isEscalated, ticketsResolved, avgResolutionTime, satisfactionScore, costSaved, showSuccess]);

  // Login handler
  const handleLogin = useCallback((email: string, password: string) => {
    // Simulate authentication (in production, this would call an API)
    const userName = email.split('@')[0];
    setCurrentUser({ email, name: userName.charAt(0).toUpperCase() + userName.slice(1) });
    setIsLoggedIn(true);
    showSuccess('Welcome!', `Successfully logged in as ${userName}`);
  }, [showSuccess]);

  // Logout handler
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('chat');
    showInfo('Logged Out', 'You have been successfully logged out');
  }, [showInfo]);

  const handleExportLog = useCallback(() => {
    const log = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resolveai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);

  const handleLoadConversation = useCallback((loadedMessages: HistoryItem['messages']) => {
    setMessages(loadedMessages);
    setIsEscalated(false);
    setIsTyping(false);
  }, []);

  const handleSaveSettings = useCallback((newSettings: APISettings) => {
    updateSettings(newSettings);
  }, [updateSettings]);

  // Keyboard shortcuts - moved after all function definitions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Show shortcuts modal
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Alt + 1/2/3 for tab switching
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        handleTabSwitch('chat');
        showInfo('Navigation', 'Switched to Chat');
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        handleTabSwitch('dashboard');
        showInfo('Navigation', 'Switched to Dashboard');
      }
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        handleTabSwitch('team');
        showInfo('Navigation', 'Switched to Team');
      }

      // Ctrl/Cmd shortcuts
      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (isCtrl && e.key === 'r') {
        e.preventDefault();
        handleResetChat();
        showSuccess('Chat Reset', 'Started a new conversation');
      }
      
      if (isCtrl && e.key === 'e') {
        e.preventDefault();
        handleExportLog();
        showSuccess('Export', 'Chat log exported successfully');
      }
      
      if (isCtrl && e.key === 'h') {
        e.preventDefault();
        setShowHistory(true);
      }
      
      if (isCtrl && e.key === 's') {
        e.preventDefault();
        setShowSettings(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTabSwitch, handleResetChat, handleExportLog, showInfo, showSuccess]);

  const apiKeySet = !!settings.apiKey && settings.apiKey.trim().length > 0;

  return (
    <>
      {/* Login Page */}
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
          {/* Background Gradient Overlay */}
          <div 
            className="fixed inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
            }}
          />

          {/* Dot Grid Pattern */}
          <div 
            className="fixed inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Navigation Bar */}
          <nav 
            className="relative z-50 flex items-center justify-between px-6 h-14 flex-shrink-0"
            style={{ 
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(100, 116, 139, 0.15)'
            }}
          >
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                <img src="/resolveai-logo.png" alt="ResolveAI" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold text-[#F8FAFC]">ResolveAI</span>
              <div className="flex items-center gap-1.5 ml-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <div 
                    className="absolute inset-0 w-2 h-2 rounded-full bg-[#10B981]"
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                  />
                </div>
                <span className="text-[11px] text-[#10B981] font-medium">Online</span>
              </div>
            </div>

            {/* Center: Tab Navigation */}
            <div 
              className="flex items-center rounded-xl p-1"
              style={{ 
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(100, 116, 139, 0.15)'
              }}
            >
              <button
                onClick={() => handleTabSwitch('chat')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === 'chat' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                  color: activeTab === 'chat' ? '#FFFFFF' : '#94A3B8',
                  boxShadow: activeTab === 'chat' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => handleTabSwitch('dashboard')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                  color: activeTab === 'dashboard' ? '#FFFFFF' : '#94A3B8',
                  boxShadow: activeTab === 'dashboard' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => handleTabSwitch('team')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === 'team' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                  color: activeTab === 'team' ? '#FFFFFF' : '#94A3B8',
                  boxShadow: activeTab === 'team' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                <Users className="w-4 h-4" />
                Team
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcuts(true)}
                className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.15)] transition-colors"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="w-5 h-5 text-[#818CF8] hover:text-[#A5B4FC] transition-colors" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.15)] transition-colors"
                title="API Settings"
              >
                <Settings className="w-5 h-5 text-[#818CF8] hover:text-[#A5B4FC] transition-colors" />
              </button>
              <button
                onClick={() => setShowDocs(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[rgba(99,102,241,0.1)]"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
                  color: '#818CF8',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Docs
              </button>

              {/* User Profile & Logout */}
              {currentUser && (
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-[rgba(99,102,241,0.2)]">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-[#CBD5E1] font-medium hidden md:block">
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[rgba(239,68,68,0.1)] flex items-center gap-1.5"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#F87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Error Toast - Replaced by notification system */}
          {error && (
            <div 
              className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl text-sm text-white animate-slideDown"
              style={{ 
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
              }}
            >
              {error}
            </div>
          )}

          {/* Notification Container */}
          <div className="fixed top-16 right-4 z-[70] space-y-2 max-w-sm">
            {notifications.map(notification => (
              <NotificationToast
                key={notification.id}
                notification={notification}
                onDismiss={dismissNotification}
              />
            ))}
          </div>

          {/* Main Content */}
          <main 
            className="relative flex-1 overflow-hidden transition-opacity duration-300"
            style={{ opacity: tabTransitioning ? 0 : 1 }}
          >
            {activeTab === 'chat' ? (
              <ChatWindow
                messages={messages}
                isTyping={isTyping}
                isEscalated={isEscalated}
                ticketsResolved={ticketsResolved}
                avgResolutionTime={avgResolutionTime}
                satisfactionScore={satisfactionScore}
                costSaved={costSaved}
                onSendMessage={handleSendMessage}
                onCancelEscalation={handleCancelEscalation}
                onConfirmEscalation={handleConfirmEscalation}
                onResetChat={handleResetChat}
                onExportLog={handleExportLog}
                onViewHistory={() => setShowHistory(true)}
                apiKeySet={apiKeySet}
              />
            ) : activeTab === 'team' ? (
              <div className="h-full overflow-y-auto p-6">
                <TeamManagement />
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <Dashboard
                  ticketsResolved={ticketsResolved}
                  avgResolutionTime={avgResolutionTime}
                  satisfactionScore={satisfactionScore}
                  costSaved={costSaved}
                />
              </div>
            )}
          </main>

          {/* Settings Modal */}
          {showSettings && (
            <SettingsModal
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              settings={settings}
              onSave={(newSettings) => {
                handleSaveSettings(newSettings);
                showSuccess('Settings Saved', 'Your API configuration has been updated');
              }}
            />
          )}

          {/* Conversation History Modal */}
          <ConversationHistoryModal
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            onLoadConversation={(loadedMessages) => {
              handleLoadConversation(loadedMessages);
              showSuccess('Conversation Loaded', 'Previous conversation restored');
            }}
          />

          {/* Keyboard Shortcuts Modal */}
          <KeyboardShortcutsModal
            isOpen={showShortcuts}
            onClose={() => setShowShortcuts(false)}
          />

          {/* Documentation Modal */}
          {showDocs && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDocs(false)}
              />
              
              {/* Modal Content */}
              <div 
                className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowDocs(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[rgba(239,68,68,0.15)] transition-colors z-10"
                  title="Close Documentation"
                >
                  <svg className="w-5 h-5 text-[#94A3B8] hover:text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Documentation Component */}
                <Documentation />
              </div>
            </div>
          )}

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.2); }
            }
            @keyframes slideDown {
              from { opacity: 0; transform: translate(-50%, -10px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
            
            /* Custom Scrollbar */
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.3);
            }
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #6366F1, #8B5CF6);
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #818CF8, #A78BFA);
            }

            /* Range Input Styling */
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              cursor: pointer;
              box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
              border: 2px solid white;
            }
            input[type="range"]::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
            }

            /* Selection */
            ::selection {
              background: rgba(99, 102, 241, 0.3);
              color: #FFFFFF;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default App;
