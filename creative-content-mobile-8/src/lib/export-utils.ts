import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { format } from 'date-fns';

interface ContentFramework {
  id: string;
  title: string;
  hook: string;
  setup_context: string;
  value_delivery: string;
  climax_payoff: string;
  cta_loop: string;
  platform: string;
  niche: string;
  content_type: string;
  keywords?: string;
  created_at: string;
}

export const exportToCSV = (frameworks: ContentFramework[], filename: string = 'content-frameworks') => {
  const csvData = frameworks.map(fw => ({
    'Title': fw.title,
    'Platform': fw.platform,
    'Niche': fw.niche,
    'Content Type': fw.content_type,
    'Keywords': fw.keywords || 'N/A',
    'Hook': fw.hook,
    'Setup/Context': fw.setup_context,
    'Value/Delivery': fw.value_delivery,
    'Climax/Payoff': fw.climax_payoff,
    'CTA/Loop': fw.cta_loop,
    'Saved Date': format(new Date(fw.created_at), 'MMM dd, yyyy')
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (frameworks: ContentFramework[], filename: string = 'content-frameworks') => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.height;
  let yPosition = 20;
  
  // Add title
  pdf.setFontSize(20);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Viral Content Frameworks', 105, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Add export date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Exported: ${format(new Date(), 'MMMM dd, yyyy')}`, 105, yPosition, { align: 'center' });
  yPosition += 20;
  
  frameworks.forEach((fw, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Framework number and title
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246); // Blue
    pdf.text(`#${index + 1}: ${fw.title}`, 20, yPosition);
    yPosition += 8;
    
    // Metadata
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${fw.platform} • ${fw.niche} • ${fw.content_type}`, 20, yPosition);
    yPosition += 10;
    
    // Framework sections
    const sections = [
      { label: '🎯 HOOK', content: fw.hook, color: [239, 68, 68] }, // Red
      { label: '📝 SETUP/CONTEXT', content: fw.setup_context, color: [251, 146, 60] }, // Orange
      { label: '💡 VALUE/DELIVERY', content: fw.value_delivery, color: [34, 197, 94] }, // Green
      { label: '🎬 CLIMAX/PAYOFF', content: fw.climax_payoff, color: [147, 51, 234] }, // Purple
      { label: '🔄 CTA/LOOP', content: fw.cta_loop, color: [59, 130, 246] } // Blue
    ];
    
    sections.forEach(section => {
      pdf.setFontSize(10);
      pdf.setTextColor(...section.color);
      pdf.text(section.label, 20, yPosition);
      yPosition += 5;
      
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const lines = pdf.splitTextToSize(section.content, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    });
    
    // Add separator
    yPosition += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 10;
  });
  
  // Save the PDF
  pdf.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};