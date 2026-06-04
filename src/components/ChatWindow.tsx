import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Message } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput, { type AttachedFile } from './MessageInput';
import EscalationBanner from './EscalationBanner';
import StatsPanel from './StatsPanel';
import { Package, RefreshCw, KeyRound, CreditCard, Zap } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  isEscalated: boolean;
  ticketsResolved: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  costSaved: number;
  onSendMessage: (message: string, files?: AttachedFile[]) => void;
  onCancelEscalation: () => void;
  onConfirmEscalation: () => void;
  onResetChat: () => void;
  onExportLog: () => void;
  onViewHistory: () => void;
  apiKeySet: boolean;
}

interface QuickChipProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickChip = ({ icon, label, onClick }: QuickChipProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#E2E8F0] transition-all duration-200 hover:border-[#6366F1] hover:text-[#818CF8] active:scale-95 hover:shadow-lg"
    style={{ 
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    }}
  >
    {icon}
    {label}
  </button>
);

const ChatWindow = ({
  messages,
  isTyping,
  isEscalated,
  ticketsResolved,
  avgResolutionTime,
  satisfactionScore,
  costSaved,
  onSendMessage,
  onCancelEscalation,
  onConfirmEscalation,
  onResetChat,
  onExportLog,
  onViewHistory,
  apiKeySet,
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasStarted, setHasStarted] = useState(messages.length > 1);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Track scroll position for "scroll to bottom" button
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  const handleSend = useCallback((message: string) => {
    if (!hasStarted) setHasStarted(true);
    onSendMessage(message);
  }, [hasStarted, onSendMessage]);

  const handleQuickChip = useCallback((text: string) => {
    if (!hasStarted) setHasStarted(true);
    onSendMessage(text);
  }, [hasStarted, onSendMessage]);

  const isWelcomeState = !hasStarted && messages.length <= 1;

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* API Key Banner */}
        {!apiKeySet && (
          <div 
            className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <Zap className="w-4 h-4 text-[#818CF8] flex-shrink-0" />
            <p className="text-xs text-[#A5B4FC]">
              Running in demo mode with smart mock responses. Add your Claude API key in Settings for live AI responses.
            </p>
          </div>
        )}

        {/* Escalation Banner */}
        {isEscalated && (
          <div className="mt-3">
            <EscalationBanner 
              onCancel={onCancelEscalation}
              onConfirm={onConfirmEscalation}
            />
          </div>
        )}

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-2 py-4 space-y-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(100,116,139,0.4) transparent' }}
        >
          {isWelcomeState ? (
            /* Welcome State */
            <div className="flex flex-col items-center justify-center h-full px-4 py-12">
              {/* AI Avatar with Glow */}
              <div className="relative mb-6">
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden"
                  style={{ 
                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <img src="/ai-avatar.png" alt="AI" className="w-full h-full object-cover" />
                </div>
                <div 
                  className="absolute -inset-2 rounded-full animate-pulse"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.15))',
                    filter: 'blur(8px)',
                    zIndex: -1
                  }}
                />
              </div>

              <h2 className="text-xl font-semibold text-[#F1F5F9] text-center mb-2">
                Hi there! I'm ResolveAI, your 24/7 support agent.
              </h2>
              <p className="text-sm text-[#CBD5E1] text-center mb-8 max-w-md">
                I can help with orders, refunds, billing, password resets, and more. What can I help you with today?
              </p>

              {/* Quick Start Chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                <QuickChip
                  icon={<Package className="w-4 h-4" />}
                  label="Track my order"
                  onClick={() => handleQuickChip("Where is my order? I haven't received any updates.")}
                />
                <QuickChip
                  icon={<RefreshCw className="w-4 h-4" />}
                  label="I need a refund"
                  onClick={() => handleQuickChip("I want a refund for my last order. The product was damaged.")}
                />
                <QuickChip
                  icon={<KeyRound className="w-4 h-4" />}
                  label="Forgot password"
                  onClick={() => handleQuickChip("I forgot my password and can't log in.")}
                />
                <QuickChip
                  icon={<CreditCard className="w-4 h-4" />}
                  label="Billing issue"
                  onClick={() => handleQuickChip("There's an unexpected charge on my account.")}
                />
              </div>

              {/* Empty State Image */}
              <div className="mt-8 opacity-40">
                <img src="/empty-state.png" alt="" className="w-32 h-auto" />
              </div>
            </div>
          ) : (
            /* Conversation */
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium text-white transition-all hover:scale-105 z-10"
            style={{ 
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.5)'
            }}
          >
            New messages ↓
          </button>
        )}

        {/* Input Area */}
        <MessageInput 
          onSend={handleSend}
          isLoading={isTyping}
          isEscalated={isEscalated}
        />
      </div>

      {/* Stats Panel - Right Sidebar */}
      <div 
        className="hidden lg:flex w-[260px] flex-col border-l border-[rgba(100,116,139,0.15)] p-4 overflow-y-auto"
        style={{ background: 'rgba(15, 23, 42, 0.5)' }}
      >
        <StatsPanel
          ticketsResolved={ticketsResolved}
          avgResolutionTime={avgResolutionTime}
          satisfactionScore={satisfactionScore}
          costSaved={costSaved}
          onResetChat={onResetChat}
          onExportLog={onExportLog}
          onViewHistory={onViewHistory}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
