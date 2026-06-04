

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
        style={{ 
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          boxShadow: '0 0 0 2px #F97316, 0 0 0 3px #0F172A'
        }}>
        <img src="/ai-avatar.png" alt="AI" className="w-full h-full object-cover" />
      </div>
      <div 
        className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ 
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.08)'
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ 
                backgroundColor: '#F97316',
                animation: `typingBounce 0.6s ease-in-out ${i * 0.15}s infinite`
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes typingBounce {
          0%, 100% { transform: scale(0.5); opacity: 0.4; }
          50% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
