import { useState, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Paperclip, X, File, Image as ImageIcon } from 'lucide-react';

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface MessageInputProps {
  onSend: (message: string, files?: AttachedFile[]) => void;
  isLoading: boolean;
  isEscalated: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading, isEscalated }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    
    // Reset input to allow uploading same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-[#818CF8]" />;
    return <File className="w-4 h-4 text-[#94A3B8]" />;
  };

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed && attachedFiles.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onSend(trimmed, attachedFiles.length > 0 ? attachedFiles : undefined);
    setInput('');
    setAttachedFiles([]);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  }, [input, attachedFiles, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, []);

  if (isEscalated) {
    return (
      <div className="px-4 py-3 border-t border-[rgba(100,116,139,0.15)]">
        <div 
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-sm text-[#EF4444]">Chat escalated to human agent. Please wait for a specialist.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-[rgba(100,116,139,0.15)]">
      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              {getFileIcon(file.type)}
              <span className="text-[#F1F5F9] max-w-[150px] truncate">{file.name}</span>
              <span className="text-[#64748B]">({formatFileSize(file.size)})</span>
              <button
                onClick={() => removeFile(file.id)}
                className="p-0.5 rounded hover:bg-[rgba(239,68,68,0.15)] transition-colors"
              >
                <X className="w-3 h-3 text-[#94A3B8] hover:text-[#EF4444]" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div 
        className={`flex items-end gap-2 px-4 py-2 rounded-2xl transition-all duration-200 ${shake ? 'animate-shake' : ''}`}
        style={{ 
          background: 'rgba(15, 23, 42, 0.8)',
          border: isFocused 
            ? '1px solid #06B6D4' 
            : '1px solid rgba(100, 116, 139, 0.3)',
          boxShadow: isFocused 
            ? '0 0 0 3px rgba(6, 182, 212, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
        
        <button 
          className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.15)] transition-colors flex-shrink-0"
          title="Attach file"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5 text-[#818CF8]" />
        </button>
        
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); handleInput(); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isLoading ? 'AI is thinking...' : 'Describe your issue...'}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-[#F1F5F9] placeholder-[#64748B] text-sm resize-none outline-none py-2 max-h-[120px] min-h-[36px]"
        />
        
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-full transition-all duration-150 flex-shrink-0 disabled:opacity-40 hover:scale-105 active:scale-92"
          style={{ 
            background: input.trim() 
              ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' 
              : 'rgba(100, 116, 139, 0.2)',
            boxShadow: input.trim() ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
          }}
          title="Send message"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MessageInput;
