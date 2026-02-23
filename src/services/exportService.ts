import html2pdf from 'html2pdf.js';

export const ExportService = {
  async exportToPDF(elementId: string, filename: string = 'boletin-corporativo.pdf') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' as const
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intente de nuevo.');
    }
  }
};
