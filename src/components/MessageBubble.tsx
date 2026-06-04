import React, { useState, useCallback } from 'react';
import { Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isAI = message.role === 'assistant';
  const timeStr = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [message.content]);

  const formatContent = (content: string) => {
    // Convert markdown-like formatting to JSX
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Handle bold text **text**
      const boldPattern = /\*\*(.*?)\*\*/g;
      const boldParts: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldPattern.exec(line)) !== null) {
        if (match.index > lastIndex) {
          boldParts.push(line.substring(lastIndex, match.index));
        }
        boldParts.push(
          <strong key={match.index} className="font-semibold text-[#F8FAFC]">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < line.length) {
        boldParts.push(line.substring(lastIndex));
      }

      // Handle bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-2 flex-shrink-0" />
            <span className="text-[#E2E8F0]">{boldParts.length > 0 ? boldParts : line.substring(1).trim()}</span>
          </div>
        );
      }

      // Handle numbered steps
      const numMatch = line.match(/^(\d+)\.\s*(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <span className="text-[#818CF8] font-bold text-sm min-w-[20px]">{numMatch[1]}.</span>
            <span className="text-[#E2E8F0]">{boldParts.length > 0 ? boldParts : numMatch[2]}</span>
          </div>
        );
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }

      return <p key={i} className="py-0.5 text-[#E2E8F0]">{boldParts.length > 0 ? boldParts : line}</p>;
    });
  };

  if (isAI) {
    return (
      <div 
        className="flex items-end gap-2 px-4 py-1 group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* AI Avatar */}
        <div 
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 self-start mt-1"
          style={{ 
            boxShadow: '0 0 0 2px #6366F1, 0 0 12px rgba(99, 102, 241, 0.4)'
          }}
        >
          <img src="/ai-avatar.png" alt="AI" className="w-full h-full object-cover" />
        </div>
        
        {/* Message Bubble */}
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div 
            className="px-4 py-3 rounded-2xl rounded-bl-sm transition-all duration-200 hover:border-[rgba(99,102,241,0.4)]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.8))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {formatContent(message.content)}
            </div>
          </div>
          
          {/* Timestamp + Actions */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] text-[#94A3B8]">{timeStr}</span>
            <div 
              className="flex items-center gap-1 transition-opacity duration-200"
              style={{ opacity: showActions ? 1 : 0 }}
            >
              <button
                onClick={handleCopy}
                className="p-1 rounded-md hover:bg-[rgba(99,102,241,0.2)] transition-colors"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                )}
              </button>
              <button
                onClick={() => { setThumbsUp(!thumbsUp); setThumbsDown(false); }}
                className="p-1 rounded-md hover:bg-[rgba(99,102,241,0.2)] transition-colors"
                title="Helpful"
              >
                <ThumbsUp className={`w-3.5 h-3.5 transition-colors ${thumbsUp ? 'text-[#6366F1]' : 'text-[#94A3B8]'}`} />
              </button>
              <button
                onClick={() => { setThumbsDown(!thumbsDown); setThumbsUp(false); }}
                className="p-1 rounded-md hover:bg-[rgba(99,102,241,0.2)] transition-colors"
                title="Not helpful"
              >
                <ThumbsDown className={`w-3.5 h-3.5 transition-colors ${thumbsDown ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="flex items-end justify-end gap-2 px-4 py-1">
      <div className="flex flex-col items-end gap-1 max-w-[80%]">
        <div 
          className="px-4 py-3 rounded-2xl rounded-br-sm transition-all duration-200 hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}
        >
          <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-[11px] text-[#94A3B8] px-1">{timeStr}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
