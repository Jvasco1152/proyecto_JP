import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ImageRun,
  TableLayoutType, ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { InspectionFormData, AIAnalysis } from '../../types/inspection';
import { inspectionSections } from '../../data/inspectionSections';
import { calculateSectionScores, calculateOverallScore } from '../../utils/calculateScores';
import { STATUS_LABELS } from '../../utils/reportStyles';
import { getPhotoBase64 } from '../../hooks/usePhotoCapture';

const COLORS = {
  primary: '1e40af',
  primaryLight: 'dbeafe',
  success: '16a34a',
  successLight: 'dcfce7',
  danger: 'dc2626',
  dangerLight: 'fee2e2',
  amber: 'd97706',
  amberLight: 'fef3c7',
  gray: '6b7280',
  grayLight: 'f3f4f6',
  white: 'ffffff',
  black: '0f172a',
};

function statusColor(status: string | null): string {
  if (status === 'cumple') return COLORS.success;
  if (status === 'cumple_parcial') return COLORS.amber;
  if (status === 'no_cumple') return COLORS.danger;
  return COLORS.gray;
}

function scoreColor(pct: number): string {
  if (pct >= 80) return COLORS.success;
  if (pct >= 60) return COLORS.amber;
  return COLORS.danger;
}

function riskLabel(nivel: string): string {
  const labels: Record<string, string> = { bajo: 'BAJO', medio: 'MEDIO', alto: 'ALTO', critico: 'CRITICO' };
  return labels[nivel] || nivel.toUpperCase();
}

function riskColor(nivel: string): string {
  const colors: Record<string, string> = { bajo: COLORS.success, medio: COLORS.amber, alto: 'f97316', critico: COLORS.danger };
  return colors[nivel] || COLORS.gray;
}

function heading(text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1): Paragraph {
  return new Paragraph({ heading: level, children: [new TextRun({ text, bold: true, color: COLORS.primary })] });
}

function spacer(): Paragraph {
  return new Paragraph({ children: [] });
}

function createInfoRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: COLORS.primaryLight },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: COLORS.primary })] })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: value || '—', size: 20 })] })],
      }),
    ],
  });
}

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: COLORS.white };
  return { top: none, bottom: none, left: none, right: none };
}

async function collectPhotos(formData: InspectionFormData): Promise<Record<string, Uint8Array>> {
  const photos: Record<string, Uint8Array> = {};
  for (const item of Object.values(formData.sections)) {
    for (const photoId of item.photoIds) {
      const base64 = await getPhotoBase64(photoId);
      if (base64) {
        const dataUrl = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
        const raw = dataUrl.split(',')[1];
        const binary = atob(raw);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        photos[photoId] = bytes;
      }
    }
  }
  return photos;
}

export async function generateWordReport(formData: InspectionFormData, analysis: AIAnalysis | null) {
  const scores = calculateSectionScores(formData);
  const overall = calculateOverallScore(formData);
  const photos = await collectPhotos(formData);

  const sections: Paragraph[] = [];

  // ===== PORTADA =====
  sections.push(spacer(), spacer(), spacer());
  sections.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'INFORME DE AUDITORÍA', bold: true, size: 52, color: COLORS.primary })],
  }));
  sections.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Inspección y Supervisión Integral', size: 28, color: COLORS.gray })],
  }));
  sections.push(spacer());
  sections.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: formData.header.copropiedad || 'Copropiedad', bold: true, size: 36, color: COLORS.black })],
  }));
  sections.push(spacer());

  // Info table
  sections.push(new Paragraph({ children: [] }));
  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      createInfoRow('Fecha', formData.header.fecha),
      createInfoRow('Director', formData.header.director),
      createInfoRow('Email Director', formData.header.directorEmail),
      createInfoRow('Auditor', formData.header.auditor),
      createInfoRow('Email Auditor', formData.header.auditorEmail),
    ],
  });

  // Overall score
  const overallColor = scoreColor(overall);
  const overallParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [
      new TextRun({ text: 'Cumplimiento General: ', bold: true, size: 28, color: COLORS.primary }),
      new TextRun({ text: `${overall}%`, bold: true, size: 48, color: overallColor }),
    ],
  });

  // ===== RESUMEN EJECUTIVO (IA) =====
  const aiSections: Paragraph[] = [];
  if (analysis) {
    aiSections.push(spacer());
    aiSections.push(heading('RESUMEN EJECUTIVO'));
    aiSections.push(spacer());

    // Risk level
    aiSections.push(new Paragraph({
      children: [
        new TextRun({ text: 'Nivel de Riesgo: ', bold: true, size: 22 }),
        new TextRun({ text: riskLabel(analysis.nivelRiesgo), bold: true, size: 22, color: riskColor(analysis.nivelRiesgo) }),
      ],
    }));
    aiSections.push(spacer());

    // Summary
    aiSections.push(new Paragraph({
      children: [new TextRun({ text: analysis.resumenEjecutivo, size: 22 })],
    }));
    aiSections.push(spacer());

    // Score summary table
    aiSections.push(heading('RESULTADOS POR SECCIÓN', HeadingLevel.HEADING_2));
    aiSections.push(spacer());

    const scoreTableRows = [
      new TableRow({
        tableHeader: true,
        children: ['Sección', 'Cumple', 'Parcial', 'No Cumple', 'N/A', '%'].map(h =>
          new TableCell({
            shading: { type: ShadingType.SOLID, color: COLORS.primary },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 18, color: COLORS.white })] })],
          })
        ),
      }),
      ...scores.map(s => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s.sectionTitle, size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(s.cumple), size: 18, color: COLORS.success })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(s.cumpleParcial), size: 18, color: COLORS.amber })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(s.noCumple), size: 18, color: COLORS.danger })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(s.noAplica), size: 18, color: COLORS.gray })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.porcentaje}%`, bold: true, size: 18, color: scoreColor(s.porcentaje) })] })] }),
        ],
      })),
    ];

    const scoreTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      rows: scoreTableRows,
    });

    aiSections.push(scoreTable as unknown as Paragraph);
    aiSections.push(spacer());

    // Hallazgos Criticos
    if (analysis.hallazgosCriticos.length > 0) {
      aiSections.push(heading('HALLAZGOS CRITICOS', HeadingLevel.HEADING_2));
      aiSections.push(spacer());
      analysis.hallazgosCriticos.forEach(h => {
        aiSections.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: h, size: 22, color: COLORS.danger })],
        }));
      });
      aiSections.push(spacer());
    }

    // Recomendaciones
    if (analysis.recomendaciones.length > 0) {
      aiSections.push(heading('RECOMENDACIONES', HeadingLevel.HEADING_2));
      aiSections.push(spacer());
      analysis.recomendaciones.forEach((r, i) => {
        aiSections.push(new Paragraph({
          children: [new TextRun({ text: `${i + 1}. ${r}`, size: 22 })],
        }));
      });
      aiSections.push(spacer());
    }
  }

  // ===== DETALLE POR SECCIÓN =====
  const detailSections: Paragraph[] = [];
  detailSections.push(heading('DETALLE POR SECCIÓN'));
  detailSections.push(spacer());

  for (const section of inspectionSections) {
    detailSections.push(heading(section.title.toUpperCase(), HeadingLevel.HEADING_2));
    detailSections.push(new Paragraph({
      children: [new TextRun({ text: section.description, size: 20, italics: true, color: COLORS.gray })],
    }));
    detailSections.push(spacer());

    // Detail table
    const headerRow = new TableRow({
      tableHeader: true,
      children: ['Item', 'Criterio', 'Estado', 'Observación'].map(h =>
        new TableCell({
          shading: { type: ShadingType.SOLID, color: COLORS.primary },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 16, color: COLORS.white })] })],
        })
      ),
    });

    const dataRows = section.items.map(item => {
      const data = formData.sections[item.id];
      const status = data?.status ? (STATUS_LABELS[data.status] || '—') : 'Sin evaluar';
      const obs = data?.observation || '';
      const color = statusColor(data?.status || null);

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: item.label, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: item.criterio, size: 14, color: COLORS.gray })] })],
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: status, bold: true, size: 16, color })] })],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: obs, size: 16 })] })],
          }),
        ],
      });
    });

    const detailTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      rows: [headerRow, ...dataRows],
    });

    detailSections.push(detailTable as unknown as Paragraph);
    detailSections.push(spacer());

    // Photos for this section
    const sectionPhotos: { label: string; photoId: string }[] = [];
    section.items.forEach(item => {
      const data = formData.sections[item.id];
      if (data?.photoIds?.length) {
        data.photoIds.forEach(pid => {
          if (photos[pid]) sectionPhotos.push({ label: item.label, photoId: pid });
        });
      }
    });

    if (sectionPhotos.length > 0) {
      detailSections.push(new Paragraph({
        children: [new TextRun({ text: 'Evidencia Fotográfica', bold: true, size: 20, color: COLORS.primary })],
      }));
      detailSections.push(spacer());

      for (const photo of sectionPhotos) {
        detailSections.push(new Paragraph({
          children: [new TextRun({ text: photo.label, italics: true, size: 16, color: COLORS.gray })],
        }));
        detailSections.push(new Paragraph({
          children: [
            new ImageRun({
              data: photos[photo.photoId],
              transformation: { width: 400, height: 280 },
              type: 'jpg',
            }),
          ],
        }));
        detailSections.push(spacer());
      }
    }
  }

  // ===== COMENTARIOS GENERALES =====
  const commentSections: Paragraph[] = [];
  if (formData.comentarios.trim()) {
    commentSections.push(heading('COMENTARIOS GENERALES'));
    commentSections.push(spacer());
    commentSections.push(new Paragraph({
      children: [new TextRun({ text: formData.comentarios, size: 22 })],
    }));
  }

  // ===== BUILD DOCUMENT =====
  const doc = new Document({
    creator: 'Auditor JP',
    title: `Informe de Auditoría - ${formData.header.copropiedad}`,
    description: 'Informe de inspección y supervisión integral',
    sections: [
      {
        properties: {
          page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } },
        },
        children: [
          ...sections,
          infoTable as unknown as Paragraph,
          overallParagraph,
          ...aiSections,
          ...detailSections,
          ...commentSections,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Informe_${formData.header.copropiedad?.replace(/\s+/g, '_') || 'Inspeccion'}_${formData.header.fecha}.docx`;
  saveAs(blob, fileName);
}
