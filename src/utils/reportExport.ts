import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  ticketsResolved: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  costSaved: number;
  dateRange: string;
  generatedAt: Date;
}

interface ConversationData {
  id: string;
  messages: Array<{ role: string; content: string; timestamp: Date }>;
  issueType: string;
  resolutionTime: number;
  status: string;
}

// Generate PDF Report
export const exportToPDF = (data: ReportData, conversations: ConversationData[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('ResolveAI Analytics Report', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Period: ${data.dateRange}`, 14, 30);
  doc.text(`Generated: ${data.generatedAt.toLocaleDateString()}`, 14, 36);
  
  let yPos = 55;
  
  // Key Metrics Section
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(18);
  doc.text('Key Performance Metrics', 14, yPos);
  yPos += 15;
  
  // Metrics table
  const metricsData = [
    ['Tickets Resolved', data.ticketsResolved.toString()],
    ['Avg Resolution Time', `${data.avgResolutionTime} min`],
    ['Satisfaction Score', `${data.satisfactionScore}%`],
    ['Cost Saved', `$${data.costSaved.toLocaleString()}`],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: metricsData,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 11,
      cellPadding: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 20;
  
  // Conversations Summary
  if (conversations.length > 0) {
    doc.setFontSize(18);
    doc.text('Recent Conversations', 14, yPos);
    yPos += 10;
    
    const conversationData = conversations.slice(0, 10).map(conv => [
      conv.id.substring(0, 8),
      conv.issueType,
      `${conv.resolutionTime} min`,
      conv.status,
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['ID', 'Issue Type', 'Resolution Time', 'Status']],
      body: conversationData,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
      },
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | ResolveAI Support Platform`,
      14,
      doc.internal.pageSize.height - 10
    );
  }
  
  doc.save(`resolveai-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Generate CSV Export
export const exportToCSV = (conversations: ConversationData[]) => {
  const headers = ['ID', 'Issue Type', 'Status', 'Resolution Time (min)', 'Message Count', 'Date'];
  
  const rows = conversations.map(conv => [
    conv.id,
    conv.issueType,
    conv.status,
    conv.resolutionTime.toString(),
    conv.messages.length.toString(),
    new Date(conv.messages[0]?.timestamp || Date.now()).toLocaleDateString(),
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `resolveai-conversations-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate JSON Export
export const exportToJSON = (data: ReportData, conversations: ConversationData[]) => {
  const exportData = {
    reportMetadata: {
      title: 'ResolveAI Analytics Report',
      generatedAt: data.generatedAt.toISOString(),
      period: data.dateRange,
      version: '1.0',
    },
    summary: {
      ticketsResolved: data.ticketsResolved,
      avgResolutionTime: data.avgResolutionTime,
      satisfactionScore: data.satisfactionScore,
      costSaved: data.costSaved,
    },
    conversations: conversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
    })),
  };
  
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `resolveai-report-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate Text Report
export const exportToText = (data: ReportData, conversations: ConversationData[]) => {
  let text = '='.repeat(60) + '\n';
  text += 'RESOLVEAI ANALYTICS REPORT\n';
  text += '='.repeat(60) + '\n\n';
  
  text += `Report Period: ${data.dateRange}\n`;
  text += `Generated: ${data.generatedAt.toLocaleString()}\n\n`;
  
  text += '-'.repeat(60) + '\n';
  text += 'KEY PERFORMANCE METRICS\n';
  text += '-'.repeat(60) + '\n\n';
  
  text += `📊 Tickets Resolved:        ${data.ticketsResolved}\n`;
  text += `⏱️  Avg Resolution Time:     ${data.avgResolutionTime} minutes\n`;
  text += `⭐ Satisfaction Score:       ${data.satisfactionScore}%\n`;
  text += `💰 Cost Saved:               $${data.costSaved.toLocaleString()}\n\n`;
  
  text += '-'.repeat(60) + '\n';
  text += 'RECENT CONVERSATIONS\n';
  text += '-'.repeat(60) + '\n\n';
  
  conversations.slice(0, 10).forEach((conv, index) => {
    text += `[${index + 1}] Conversation ID: ${conv.id.substring(0, 8)}\n`;
    text += `    Issue Type: ${conv.issueType}\n`;
    text += `    Status: ${conv.status}\n`;
    text += `    Resolution Time: ${conv.resolutionTime} minutes\n`;
    text += `    Messages: ${conv.messages.length}\n`;
    text += `    Date: ${new Date(conv.messages[0]?.timestamp || Date.now()).toLocaleString()}\n\n`;
  });
  
  text += '='.repeat(60) + '\n';
  text += 'End of Report\n';
  text += '='.repeat(60) + '\n';
  
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `resolveai-report-${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
