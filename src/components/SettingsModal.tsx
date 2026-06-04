import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Settings } from 'lucide-react';
import type { APISettings } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: APISettings;
  onSave: (settings: APISettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<APISettings>(settings);
  const [showKey, setShowKey] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ 
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[480px] rounded-2xl overflow-hidden transition-all duration-200"
        style={{ 
          background: '#1E293B',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          opacity: isVisible ? 1 : 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(100,116,139,0.15)]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#06B6D4]" />
            <h2 className="text-lg font-semibold text-[#F8FAFC]">API Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[rgba(100,116,139,0.2)] transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CBD5E1]">Claude API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={localSettings.apiKey}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="sk-ant-api03-..."
                className="w-full px-4 py-2.5 rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none transition-all"
                style={{ 
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(100, 116, 139, 0.3)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[rgba(100,116,139,0.2)] transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-[#64748B]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#64748B]" />
                )}
              </button>
            </div>
            <p className="text-xs text-[#64748B]">Your API key is stored only in memory for this session.</p>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CBD5E1]">Model</label>
            <select
              value={localSettings.model}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-[#F8FAFC] outline-none transition-all appearance-none cursor-pointer"
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(100, 116, 139, 0.3)'
              }}
            >
              <option value="claude-sonnet-4-20250514">claude-sonnet-4-20250514</option>
              <option value="claude-3-sonnet-20240229">claude-3-sonnet-20240229</option>
              <option value="claude-3-haiku-20240307">claude-3-haiku-20240307</option>
            </select>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#CBD5E1]">Max Tokens</label>
            <input
              type="number"
              value={localSettings.maxTokens}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 500 }))}
              min={100}
              max={4000}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-[#F8FAFC] outline-none transition-all"
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(100, 116, 139, 0.3)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#06B6D4';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#CBD5E1]">Temperature</label>
              <span className="text-sm text-[#06B6D4] font-medium">{localSettings.temperature}</span>
            </div>
            <input
              type="range"
              value={localSettings.temperature}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              min={0}
              max={1}
              step={0.1}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${localSettings.temperature * 100}%, rgba(100,116,139,0.3) ${localSettings.temperature * 100}%, rgba(100,116,139,0.3) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(100,116,139,0.15)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#CBD5E1] hover:bg-[rgba(100,116,139,0.15)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
