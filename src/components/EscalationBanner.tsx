import { Headphones, X, Check } from 'lucide-react';

interface EscalationBannerProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const EscalationBanner: React.FC<EscalationBannerProps> = ({ onCancel, onConfirm }) => {
  return (
    <div 
      className="mx-4 mb-3 rounded-xl overflow-hidden animate-slideDown"
      style={{ 
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 2px 12px rgba(239, 68, 68, 0.1)'
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(239, 68, 68, 0.2)' }}
        >
          <Headphones className="w-5 h-5 text-[#EF4444]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#F8FAFC]">Human Agent Requested</p>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            I'm connecting you with a specialist. I've shared your full conversation history so you won't repeat yourself.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.2)] transition-colors"
            title="Continue with AI"
          >
            <X className="w-4 h-4 text-[#CBD5E1]" />
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            style={{ 
              background: 'rgba(239, 68, 68, 0.3)',
              color: '#F8FAFC'
            }}
          >
            <Check className="w-3.5 h-3.5" />
            Confirm
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EscalationBanner;
