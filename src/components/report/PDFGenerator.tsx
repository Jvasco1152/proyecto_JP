import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InspectionFormData, AIAnalysis } from '../../types/inspection';
import { inspectionSections } from '../../data/inspectionSections';
import { calculateSectionScores, calculateOverallScore } from '../../utils/calculateScores';
import { PDF_COLORS, PDF_FONTS, PDF_MARGINS, STATUS_LABELS } from '../../utils/pdfStyles';
import { getPhotoBase64 } from '../../hooks/usePhotoCapture';

export async function generatePDF(formData: InspectionFormData, analysis: AIAnalysis | null) {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PDF_MARGINS.left - PDF_MARGINS.right;
  let y = PDF_MARGINS.top;

  // Collect all photos
  const allPhotoIds: string[] = [];
  Object.values(formData.sections).forEach(item => {
    allPhotoIds.push(...item.photoIds);
  });
  const photoData: Record<string, string> = {};
  for (const id of allPhotoIds) {
    const data = await getPhotoBase64(id);
    if (data) photoData[id] = data;
  }

  // ===== PAGE 1: COVER =====
  // Background header
  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Title
  doc.setTextColor(...PDF_COLORS.white);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE AUDITORÍA', pageWidth / 2, 40, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Inspección de Copropiedad', pageWidth / 2, 52, { align: 'center' });

  // Logo text
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('JP', pageWidth / 2, 78, { align: 'center' });

  // Info cards
  y = 105;
  doc.setTextColor(...PDF_COLORS.textDark);

  const infoData = [
    ['Copropiedad', formData.header.copropiedad || '—'],
    ['Fecha de Inspección', formData.header.fecha],
    ['Director', formData.header.director || '—'],
    ['Email Director', formData.header.directorEmail || '—'],
    ['Auditor', formData.header.auditor || '—'],
    ['Email Auditor', formData.header.auditorEmail || '—'],
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: infoData,
    theme: 'plain',
    margin: { left: 40, right: 40 },
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: PDF_COLORS.primary, cellWidth: 50 },
      1: { textColor: PDF_COLORS.textDark },
    },
  });

  // Overall score on cover
  const overall = calculateOverallScore(formData);
  y = (doc as any).lastAutoTable.finalY + 20;

  doc.setFillColor(...(overall >= 80 ? PDF_COLORS.successLight : overall >= 60 ? PDF_COLORS.warningLight : PDF_COLORS.dangerLight));
  doc.roundedRect(40, y, contentWidth - 40, 30, 4, 4, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_COLORS.textDark);
  doc.text('Cumplimiento General:', 50, y + 12);
  const scoreColor = overall >= 80 ? PDF_COLORS.success : overall >= 60 ? PDF_COLORS.warning : PDF_COLORS.danger;
  doc.setFontSize(24);
  doc.setTextColor(...scoreColor);
  doc.text(`${overall}%`, pageWidth - 50, y + 18, { align: 'right' });

  // ===== PAGE 2: EXECUTIVE SUMMARY (AI) =====
  if (analysis) {
    doc.addPage();
    y = PDF_MARGINS.top;

    y = addSectionTitle(doc, 'RESUMEN EJECUTIVO', y, contentWidth);

    // Risk level badge
    const riskLabels: Record<string, string> = { bajo: 'BAJO', medio: 'MEDIO', alto: 'ALTO', critico: 'CRÍTICO' };
    const riskColors: Record<string, [number, number, number]> = {
      bajo: PDF_COLORS.success, medio: PDF_COLORS.warning, alto: [249, 115, 22], critico: PDF_COLORS.danger,
    };
    const riskBgColors: Record<string, [number, number, number]> = {
      bajo: PDF_COLORS.successLight, medio: PDF_COLORS.warningLight, alto: [255, 237, 213], critico: PDF_COLORS.dangerLight,
    };

    doc.setFillColor(...(riskBgColors[analysis.nivelRiesgo] || PDF_COLORS.grayLight));
    doc.roundedRect(PDF_MARGINS.left, y, 60, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...(riskColors[analysis.nivelRiesgo] || PDF_COLORS.gray));
    doc.text(`Nivel de Riesgo: ${riskLabels[analysis.nivelRiesgo] || analysis.nivelRiesgo}`, PDF_MARGINS.left + 5, y + 7);
    y += 18;

    // Executive summary text
    doc.setFontSize(PDF_FONTS.bodySize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_COLORS.textDark);
    const summaryLines = doc.splitTextToSize(analysis.resumenEjecutivo, contentWidth);
    doc.text(summaryLines, PDF_MARGINS.left, y);
    y += summaryLines.length * 5 + 10;

    // Section scores table
    const scores = calculateSectionScores(formData);
    y = addSectionTitle(doc, 'RESULTADOS POR SECCIÓN', y, contentWidth);

    autoTable(doc, {
      startY: y,
      head: [['Sección', 'Cumple', 'No Cumple', 'N/A', '%']],
      body: scores.map(s => [s.sectionTitle, s.cumple.toString(), s.noCumple.toString(), s.noAplica.toString(), `${s.porcentaje}%`]),
      margin: { left: PDF_MARGINS.left, right: PDF_MARGINS.right },
      headStyles: { fillColor: PDF_COLORS.primary, textColor: PDF_COLORS.white, fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 55 },
        4: { fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const val = parseInt(data.cell.text[0]);
          if (val >= 80) data.cell.styles.textColor = PDF_COLORS.success;
          else if (val >= 60) data.cell.styles.textColor = PDF_COLORS.warning;
          else data.cell.styles.textColor = PDF_COLORS.danger;
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Critical findings
    if (analysis.hallazgosCriticos.length > 0) {
      if (y > 220) { doc.addPage(); y = PDF_MARGINS.top; }
      y = addSectionTitle(doc, 'HALLAZGOS CRÍTICOS', y, contentWidth);
      analysis.hallazgosCriticos.forEach(h => {
        if (y > 250) { doc.addPage(); y = PDF_MARGINS.top; }
        doc.setFillColor(...PDF_COLORS.dangerLight);
        const hLines = doc.splitTextToSize(`• ${h}`, contentWidth - 10);
        const hHeight = hLines.length * 5 + 4;
        doc.roundedRect(PDF_MARGINS.left, y - 3, contentWidth, hHeight, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...PDF_COLORS.danger);
        doc.text(hLines, PDF_MARGINS.left + 5, y + 2);
        y += hHeight + 3;
      });
      y += 5;
    }

    // Recommendations
    if (analysis.recomendaciones.length > 0) {
      if (y > 220) { doc.addPage(); y = PDF_MARGINS.top; }
      y = addSectionTitle(doc, 'RECOMENDACIONES', y, contentWidth);
      analysis.recomendaciones.forEach((r, i) => {
        if (y > 250) { doc.addPage(); y = PDF_MARGINS.top; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...PDF_COLORS.textDark);
        const rLines = doc.splitTextToSize(`${i + 1}. ${r}`, contentWidth - 5);
        doc.text(rLines, PDF_MARGINS.left + 5, y);
        y += rLines.length * 5 + 3;
      });
    }
  }

  // ===== DETAIL PAGES: Each section =====
  for (const section of inspectionSections) {
    doc.addPage();
    y = PDF_MARGINS.top;
    y = addSectionTitle(doc, section.title.toUpperCase(), y, contentWidth);

    const tableBody = section.items.map(item => {
      const data = formData.sections[item.id];
      const status = data?.status ? (STATUS_LABELS[data.status] || '—') : 'Sin evaluar';
      const obs = data?.observation || '';
      return [item.label, status, obs];
    });

    autoTable(doc, {
      startY: y,
      head: [['Item', 'Estado', 'Observación']],
      body: tableBody,
      margin: { left: PDF_MARGINS.left, right: PDF_MARGINS.right },
      headStyles: { fillColor: PDF_COLORS.primary, textColor: PDF_COLORS.white, fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: contentWidth - 90 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const text = data.cell.text[0];
          if (text === 'Cumple') {
            data.cell.styles.textColor = PDF_COLORS.success;
            data.cell.styles.fontStyle = 'bold';
          } else if (text === 'No Cumple') {
            data.cell.styles.textColor = PDF_COLORS.danger;
            data.cell.styles.fontStyle = 'bold';
          } else if (text === 'N/A') {
            data.cell.styles.textColor = PDF_COLORS.gray;
          }
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    // Add photos for this section inline
    const sectionPhotos: { itemLabel: string; photoId: string }[] = [];
    section.items.forEach(item => {
      const data = formData.sections[item.id];
      if (data?.photoIds?.length) {
        data.photoIds.forEach(photoId => {
          if (photoData[photoId]) {
            sectionPhotos.push({ itemLabel: item.label, photoId });
          }
        });
      }
    });

    if (sectionPhotos.length > 0) {
      if (y > 200) { doc.addPage(); y = PDF_MARGINS.top; }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_COLORS.primary);
      doc.text('Evidencia Fotográfica', PDF_MARGINS.left, y);
      y += 6;

      for (const photo of sectionPhotos) {
        if (y > 200) { doc.addPage(); y = PDF_MARGINS.top; }

        try {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(...PDF_COLORS.textMuted);
          const label = photo.itemLabel.length > 70 ? photo.itemLabel.substring(0, 67) + '...' : photo.itemLabel;
          doc.text(label, PDF_MARGINS.left, y);
          y += 4;

          doc.addImage(photoData[photo.photoId], 'JPEG', PDF_MARGINS.left, y, 70, 50);
          y += 55;
        } catch {
          y += 5;
        }
      }
    }
  }

  // ===== GENERAL COMMENTS PAGE =====
  if (formData.comentarios.trim()) {
    doc.addPage();
    y = PDF_MARGINS.top;
    y = addSectionTitle(doc, 'COMENTARIOS GENERALES', y, contentWidth);
    doc.setFontSize(PDF_FONTS.bodySize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_COLORS.textDark);
    const commentLines = doc.splitTextToSize(formData.comentarios, contentWidth);
    doc.text(commentLines, PDF_MARGINS.left, y);
  }

  // ===== FOOTER ON ALL PAGES =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text(
      `Auditor JP | ${formData.header.copropiedad} | ${formData.header.fecha}`,
      PDF_MARGINS.left,
      doc.internal.pageSize.getHeight() - 10,
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - PDF_MARGINS.right,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' },
    );
  }

  // Download
  const fileName = `Informe_${formData.header.copropiedad?.replace(/\s+/g, '_') || 'Inspeccion'}_${formData.header.fecha}.pdf`;
  doc.save(fileName);
}

function addSectionTitle(doc: jsPDF, title: string, y: number, contentWidth: number): number {
  doc.setFillColor(...PDF_COLORS.primary);
  doc.rect(PDF_MARGINS.left, y, contentWidth, 8, 'F');
  doc.setFontSize(PDF_FONTS.headingSize);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_COLORS.white);
  doc.text(title, PDF_MARGINS.left + 4, y + 6);
  return y + 14;
}
