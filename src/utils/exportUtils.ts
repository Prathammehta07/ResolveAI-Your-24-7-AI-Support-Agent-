import type { Message } from '@/types';

// Export to CSV
export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

// Export to JSON
export function exportToJSON(data: any, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

// Export chat messages to text
export function exportChatToText(messages: Message[], filename: string): void {
  const content = messages.map(msg => 
    `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`
  ).join('\n\n');
  
  downloadFile(content, filename, 'text/plain');
}

// Download chart as PNG
export function downloadChartAsPNG(): void {
  // This would typically use html2canvas or similar library
  // For now, we'll create a placeholder implementation
  console.log('Downloading chart as PNG');
  
  // In production, use:
  // import html2canvas from 'html2canvas';
  // html2canvas(chartElement).then(canvas => {
  //   canvas.toBlob(blob => {
  //     const url = URL.createObjectURL(blob);
  //     downloadFile(url, filename, 'image/png');
  //   });
  // });
}

// Helper function to download file
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Format data for export
export function formatMessagesForExport(messages: Message[]): any[] {
  return messages.map(msg => ({
    Timestamp: msg.timestamp.toLocaleString(),
    Role: msg.role,
    Content: msg.content,
    Intent: msg.intent || 'N/A',
  }));
}

// Export to Excel (XLSX format simulation - in production use xlsx library)
export function exportToExcel(data: any[], filename: string): void {
  // In production, use the xlsx library:
  // import * as XLSX from 'xlsx';
  // const worksheet = XLSX.utils.json_to_sheet(data);
  // const workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // XLSX.writeFile(workbook, filename);
  
  // For now, export as CSV which Excel can open
  exportToCSV(data, filename.replace('.xlsx', '.csv'));
}

// Export to PDF (simulation - in production use jsPDF or react-pdf)
export function exportToPDF(): void {
  // In production, use jsPDF:
  // import jsPDF from 'jspdf';
  // const doc = new jsPDF();
  // doc.text(title, 10, 10);
  // doc.save(filename);
  
  console.log('Exporting to PDF');
  alert('PDF export feature coming soon! For now, please use Print to PDF (Ctrl+P)');
}
