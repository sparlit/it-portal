import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class ReportingService {
  static generatePDF(title: string, headers: string[], rows: any[][], fileName: string) {
    const doc = new jsPDF();

    // Artemis Branding
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ARTEMIS INDUSTRIAL', 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ENTERPRISE OPERATIONAL REPORT', 15, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(title.toUpperCase(), 15, 55);

    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 62);

    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 70,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] }, // Blue 600
    });

    doc.save(`${fileName}.pdf`);
  }

  static downloadCSV(headers: string[], rows: any[][], fileName: string) {
    const content = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
