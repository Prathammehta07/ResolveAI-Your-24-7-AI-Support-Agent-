import React from 'react';
import { FileText, Download, X, FileSpreadsheet, FileJson, FileType } from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'csv' | 'json' | 'text') => void;
}

const ReportExportModal: React.FC<ReportExportModalProps> = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  const exportOptions = [
    {
      format: 'pdf' as const,
      icon: <FileText className="w-8 h-8" />,
      title: 'PDF Report',
      description: 'Professional report with charts and tables',
      color: '#EF4444',
    },
    {
      format: 'csv' as const,
      icon: <FileSpreadsheet className="w-8 h-8" />,
      title: 'CSV Export',
      description: 'Spreadsheet format for data analysis',
      color: '#10B981',
    },
    {
      format: 'json' as const,
      icon: <FileJson className="w-8 h-8" />,
      title: 'JSON Data',
      description: 'Complete data in JSON format',
      color: '#F59E0B',
    },
    {
      format: 'text' as const,
      icon: <FileType className="w-8 h-8" />,
      title: 'Text File',
      description: 'Simple text format for quick viewing',
      color: '#6366F1',
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        style={{ 
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(99,102,241,0.2)]">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#F1F5F9]">Export Analytics Report</h2>
              <p className="text-sm text-[#94A3B8]">Choose your preferred format</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.15)] transition-colors"
            title="Close"
          >
            <X className="w-6 h-6 text-[#94A3B8] hover:text-[#EF4444]" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => onExport(option.format)}
              className="group p-6 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl text-left"
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = option.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${option.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div 
                className="mb-4 transition-transform group-hover:scale-110"
                style={{ color: option.color }}
              >
                {option.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-[#94A3B8]">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-[rgba(99,102,241,0.2)] bg-[rgba(15,23,42,0.5)]">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[rgba(99,102,241,0.2)] flex items-center justify-center mt-0.5">
              <span className="text-xs text-[#818CF8]">ℹ️</span>
            </div>
            <div className="text-sm text-[#94A3B8]">
              <p className="font-medium text-[#CBD5E1] mb-1">What's included in the report:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Key performance metrics (tickets, resolution time, satisfaction)</li>
                <li>Cost savings analysis</li>
                <li>Recent conversation history</li>
                <li>Issue type distribution</li>
                <li>Date range and generation timestamp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExportModal;
