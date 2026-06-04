import React, { useState } from 'react';
import { BookOpen, Upload, FileText, TestTube, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TrainingDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'faq';
  size: string;
  uploadDate: Date;
  status: 'processing' | 'trained' | 'failed';
}

const AITrainingDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<TrainingDocument[]>([
    {
      id: '1',
      name: 'Company Policy Handbook.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: new Date('2026-06-01'),
      status: 'trained',
    },
    {
      id: '2',
      name: 'Product FAQ 2026.docx',
      type: 'docx',
      size: '856 KB',
      uploadDate: new Date('2026-06-02'),
      status: 'trained',
    },
    {
      id: '3',
      name: 'Customer Service Guidelines.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: new Date('2026-06-03'),
      status: 'processing',
    },
  ]);

  const [testQuery, setTestQuery] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type = extension === 'pdf' ? 'pdf' : extension === 'docx' ? 'docx' : 'faq';
      
      const newDoc: TrainingDocument = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date(),
        status: 'processing',
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate training
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: 'trained' } : doc
        ));
      }, 3000);
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleTestAI = async () => {
    if (!testQuery.trim()) return;
    
    setIsTesting(true);
    // Simulate AI response
    setTimeout(() => {
      setTestResponse(`Based on the trained documents, here's what I found about "${testQuery}":\n\nThe company policy states that all customer inquiries should be responded to within 24 hours. For product-related questions, please refer to our Product FAQ document which contains detailed specifications and troubleshooting guides.\n\nIs there anything specific you'd like to know more about?`);
      setIsTesting(false);
    }, 1500);
  };

  const getStatusIcon = (status: TrainingDocument['status']) => {
    switch (status) {
      case 'trained':
        return <CheckCircle className="w-4 h-4 text-[#10B981]" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-[#F59E0B] animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-[#EF4444]" />;
    }
  };

  const getStatusColor = (status: TrainingDocument['status']) => {
    switch (status) {
      case 'trained':
        return 'rgba(16, 185, 129, 0.15)';
      case 'processing':
        return 'rgba(245, 158, 11, 0.15)';
      case 'failed':
        return 'rgba(239, 68, 68, 0.15)';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F1F5F9] flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-[#818CF8]" />
          AI Training Dashboard
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">Train your AI agent on company-specific knowledge</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="rounded-2xl p-5"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Total Documents</p>
              <p className="text-3xl font-bold text-[#F1F5F9] mt-1">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-[#818CF8]" />
          </div>
        </div>

        <div 
          className="rounded-2xl p-5"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Trained</p>
              <p className="text-3xl font-bold text-[#10B981] mt-1">
                {documents.filter(d => d.status === 'trained').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#10B981]" />
          </div>
        </div>

        <div 
          className="rounded-2xl p-5"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Processing</p>
              <p className="text-3xl font-bold text-[#F59E0B] mt-1">
                {documents.filter(d => d.status === 'processing').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div 
        className="rounded-2xl p-6 mb-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#818CF8]" />
          Upload Training Documents
        </h3>
        
        <label 
          className="block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-[#818CF8]"
          style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-center">
            <Upload className="w-12 h-12 text-[#818CF8] mx-auto mb-3" />
            <p className="text-sm text-[#E2E8F0] mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-[#94A3B8]">
              Supported formats: PDF, DOCX, TXT (Max 10MB each)
            </p>
          </div>
        </label>
      </div>

      {/* Documents List */}
      <div 
        className="rounded-2xl overflow-hidden mb-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        <div className="px-6 py-4 border-b border-[rgba(99,102,241,0.15)]">
          <h3 className="text-lg font-semibold text-[#F1F5F9]">Training Documents</h3>
        </div>
        
        <div className="divide-y divide-[rgba(99,102,241,0.1)]">
          {documents.map(doc => (
            <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-[rgba(99,102,241,0.05)] transition-colors">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: getStatusColor(doc.status) }}
                >
                  {getStatusIcon(doc.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F1F5F9]">{doc.name}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {doc.size} • Uploaded {doc.uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{ 
                    background: getStatusColor(doc.status),
                    color: doc.status === 'trained' ? '#10B981' : doc.status === 'processing' ? '#F59E0B' : '#EF4444'
                  }}
                >
                  {doc.status}
                </span>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test AI Section */}
      <div 
        className="rounded-2xl p-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4 flex items-center gap-2">
          <TestTube className="w-5 h-5 text-[#818CF8]" />
          Test AI Responses
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter a test question to see how the AI responds..."
            className="w-full px-4 py-3 rounded-xl text-sm text-[#F1F5F9] placeholder-[#64748B] resize-none outline-none"
            style={{ 
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              minHeight: '100px'
            }}
            rows={4}
          />
          
          <button
            onClick={handleTestAI}
            disabled={!testQuery.trim() || isTesting}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ 
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            {isTesting ? 'Testing...' : 'Test Response'}
          </button>
          
          {testResponse && (
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <p className="text-xs font-medium text-[#818CF8] mb-2">AI Response:</p>
              <p className="text-sm text-[#E2E8F0] whitespace-pre-wrap">{testResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITrainingDashboard;
