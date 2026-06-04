import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Chat Shortcuts
  { keys: ['Enter'], description: 'Send message', category: 'Chat' },
  { keys: ['Shift', 'Enter'], description: 'New line', category: 'Chat' },
  { keys: ['Esc'], description: 'Cancel escalation', category: 'Chat' },
  
  // Navigation
  { keys: ['Alt', '1'], description: 'Switch to Chat', category: 'Navigation' },
  { keys: ['Alt', '2'], description: 'Switch to Dashboard', category: 'Navigation' },
  
  // Actions
  { keys: ['Ctrl', 'R'], description: 'Reset chat', category: 'Actions' },
  { keys: ['Ctrl', 'E'], description: 'Export log', category: 'Actions' },
  { keys: ['Ctrl', 'H'], description: 'View history', category: 'Actions' },
  { keys: ['Ctrl', 'S'], description: 'Open settings', category: 'Actions' },
  
  // System
  { keys: ['?'], description: 'Show shortcuts', category: 'System' },
];

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        if (!prev.includes(key)) {
          return [...prev, key];
        }
        return prev;
      });
      
      // Close on Escape
      if (key === 'escape') {
        onClose();
      }
    };

    const handleKeyUp = () => {
      setPressedKeys([]);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

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
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b border-[rgba(99,102,241,0.2)]"
          style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99, 102, 241, 0.2)' }}
            >
              <Keyboard className="w-5 h-5 text-[#818CF8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9]">Keyboard Shortcuts</h2>
              <p className="text-xs text-[#94A3B8]">Boost your productivity with keyboard shortcuts</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(100,116,139,0.2)] transition-colors"
          >
            <X className="w-5 h-5 text-[#94A3B8]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-[#818CF8] uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-[rgba(99,102,241,0.1)]"
                    style={{ border: '1px solid rgba(99, 102, 241, 0.1)' }}
                  >
                    <span className="text-sm text-[#E2E8F0]">{shortcut.description}</span>
                    <div className="flex items-center gap-1.5">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
                            style={{
                              background: pressedKeys.includes(key.toLowerCase())
                                ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                                : 'rgba(30, 41, 59, 0.8)',
                              color: pressedKeys.includes(key.toLowerCase()) ? '#FFFFFF' : '#CBD5E1',
                              border: pressedKeys.includes(key.toLowerCase())
                                ? '1px solid rgba(99, 102, 241, 0.5)'
                                : '1px solid rgba(100, 116, 139, 0.3)',
                              boxShadow: pressedKeys.includes(key.toLowerCase())
                                ? '0 0 12px rgba(99, 102, 241, 0.4)'
                                : '0 2px 4px rgba(0, 0, 0, 0.2)',
                              transform: pressedKeys.includes(key.toLowerCase()) ? 'scale(0.95)' : 'scale(1)',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-[#64748B] text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-3 border-t border-[rgba(99,102,241,0.2)] text-center"
          style={{ background: 'rgba(30, 41, 59, 0.4)' }}
        >
          <p className="text-xs text-[#94A3B8]">
            Press any key above to see it highlighted • Press <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(99,102,241,0.2)] text-[#818CF8]">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
