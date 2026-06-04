import React, { useState } from 'react';
import { History, Trash2, MessageSquare, Clock, X, ChevronRight, RotateCcw } from 'lucide-react';
import type { HistoryItem } from '@/utils/conversationHistory';
import { getConversationHistory, deleteConversation, clearAllHistory, formatTimestamp, formatFullDateTime } from '@/utils/conversationHistory';

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConversation: (messages: HistoryItem['messages']) => void;
}

const ConversationHistoryModal: React.FC<ConversationHistoryModalProps> = ({
  isOpen,
  onClose,
  onLoadConversation,
}) => {
  const [history, setHistory] = useState<HistoryItem[]>(getConversationHistory());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(id);
    setHistory(getConversationHistory());
  };

  const handleClearAll = () => {
    clearAllHistory();
    setHistory([]);
    setShowConfirmClear(false);
  };

  const handleLoadConversation = (item: HistoryItem) => {
    onLoadConversation(item.messages);
    setSelectedId(item.id);
    setTimeout(() => {
      onClose();
      setSelectedId(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ 
          background: '#0F172A',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b border-[rgba(100,116,139,0.15)]"
          style={{ background: 'rgba(30, 41, 59, 0.6)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(6, 182, 212, 0.15)' }}
            >
              <History className="w-5 h-5 text-[#06B6D4]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Conversation History</h2>
              <p className="text-xs text-[#64748B]">{history.length} conversations saved</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgba(100,116,139,0.15)] transition-colors"
            >
              <X className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(100, 116, 139, 0.1)' }}
              >
                <MessageSquare className="w-8 h-8 text-[#64748B]" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">No conversations yet</h3>
              <p className="text-sm text-[#64748B] text-center max-w-sm">
                Your conversation history will appear here. Start chatting to save your first conversation!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLoadConversation(item)}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedId === item.id ? 'scale-[0.98]' : 'hover:-translate-y-0.5'
                  }`}
                  style={{ 
                    background: selectedId === item.id 
                      ? 'rgba(6, 182, 212, 0.15)' 
                      : 'rgba(30, 41, 59, 0.4)',
                    border: selectedId === item.id
                      ? '1px solid rgba(6, 182, 212, 0.4)'
                      : '1px solid rgba(100, 116, 139, 0.15)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-[#06B6D4]" />
                        <span className="text-xs font-medium text-[#06B6D4]">
                          {item.messageCount} messages
                        </span>
                        <span className="text-[#64748B]">•</span>
                        <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="text-xs text-[#64748B]">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-[#CBD5E1] line-clamp-2 mb-2">
                        {item.preview}
                      </p>
                      
                      <p className="text-[11px] text-[#64748B]">
                        {formatFullDateTime(item.timestamp)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-[#64748B]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-3 border-t border-[rgba(100,116,139,0.15)] text-center"
          style={{ background: 'rgba(30, 41, 59, 0.4)' }}
        >
          <p className="text-xs text-[#64748B]">
            Conversations are stored locally in your browser
          </p>
        </div>
      </div>

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmClear(false)}
          />
          <div 
            className="relative w-full max-w-md rounded-2xl p-6"
            style={{ 
              background: '#0F172A',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(239, 68, 68, 0.15)' }}
              >
                <Trash2 className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC]">Clear All History?</h3>
                <p className="text-xs text-[#64748B]">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-[#CBD5E1] mb-6">
              Are you sure you want to delete all {history.length} conversations? This will permanently remove them from your browser.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#CBD5E1] hover:bg-[rgba(100,116,139,0.1)] transition-colors"
                style={{ border: '1px solid rgba(100, 116, 139, 0.2)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ background: '#EF4444' }}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistoryModal;
