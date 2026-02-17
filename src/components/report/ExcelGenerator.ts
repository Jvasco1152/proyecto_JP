import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { InspectionFormData } from '../../types/inspection';
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

function headerStyle(): Partial<ExcelJS.Style> {
  return {
    font: { bold: true, color: { argb: 'FF' + COLORS.white }, size: 11 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.primary } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    },
  };
}

function cellBorder(): Partial<ExcelJS.Borders> {
  return {
    top: { style: 'thin' }, bottom: { style: 'thin' },
    left: { style: 'thin' }, right: { style: 'thin' },
  };
}

async function collectPhotoBase64(formData: InspectionFormData): Promise<Record<string, string>> {
  const photos: Record<string, string> = {};
  for (const item of Object.values(formData.sections)) {
    for (const photoId of item.photoIds) {
      const base64 = await getPhotoBase64(photoId);
      if (base64) {
        const dataUrl = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
        photos[photoId] = dataUrl.split(',')[1];
      }
    }
  }
  return photos;
}

export async function generateExcelReport(formData: InspectionFormData) {
  const scores = calculateSectionScores(formData);
  const overall = calculateOverallScore(formData);
  const photos = await collectPhotoBase64(formData);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Auditor JP';
  workbook.created = new Date();

  // ===== HOJA 1: Datos Generales =====
  const wsDatos = workbook.addWorksheet('Datos Generales');
  wsDatos.columns = [
    { width: 25 },
    { width: 45 },
  ];

  // Title
  wsDatos.mergeCells('A1:B1');
  const titleCell = wsDatos.getCell('A1');
  titleCell.value = 'INFORME DE AUDITORÍA';
  titleCell.font = { bold: true, size: 16, color: { argb: 'FF' + COLORS.primary } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsDatos.getRow(1).height = 35;

  wsDatos.mergeCells('A2:B2');
  const subtitleCell = wsDatos.getCell('A2');
  subtitleCell.value = 'Inspección y Supervisión Integral';
  subtitleCell.font = { size: 12, color: { argb: 'FF' + COLORS.gray } };
  subtitleCell.alignment = { horizontal: 'center' };

  // Spacer row
  wsDatos.getRow(3).height = 10;

  // Info rows
  const infoData: [string, string][] = [
    ['Fecha', formData.header.fecha],
    ['Director', formData.header.director],
    ['Email Director', formData.header.directorEmail],
    ['Auditor', formData.header.auditor],
    ['Email Auditor', formData.header.auditorEmail],
    ['Copropiedad', formData.header.copropiedad],
  ];

  infoData.forEach(([label, value], i) => {
    const row = wsDatos.getRow(4 + i);
    row.getCell(1).value = label;
    row.getCell(1).font = { bold: true, color: { argb: 'FF' + COLORS.primary } };
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + COLORS.primaryLight } };
    row.getCell(1).border = cellBorder();
    row.getCell(2).value = value || '—';
    row.getCell(2).border = cellBorder();
  });

  // Overall score
  const scoreRow = 4 + infoData.length + 1;
  wsDatos.mergeCells(`A${scoreRow}:B${scoreRow}`);
  const scoreCell = wsDatos.getCell(`A${scoreRow}`);
  scoreCell.value = `Cumplimiento General: ${overall}%`;
  scoreCell.font = { bold: true, size: 18, color: { argb: 'FF' + scoreColor(overall) } };
  scoreCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsDatos.getRow(scoreRow).height = 40;

  // ===== HOJA 2: Resumen =====
  const wsResumen = workbook.addWorksheet('Resumen');
  wsResumen.columns = [
    { width: 25 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 10 },
    { width: 14 },
  ];

  // Header
  const resHeaders = ['Sección', 'Cumple', 'Parcial', 'No Cumple', 'N/A', 'Porcentaje'];
  const resHeaderRow = wsResumen.getRow(1);
  resHeaders.forEach((h, i) => {
    const cell = resHeaderRow.getCell(i + 1);
    cell.value = h;
    Object.assign(cell, headerStyle());
    cell.font = headerStyle().font!;
    cell.fill = headerStyle().fill!;
    cell.alignment = headerStyle().alignment!;
    cell.border = cellBorder();
  });
  resHeaderRow.height = 25;

  scores.forEach((s, i) => {
    const row = wsResumen.getRow(2 + i);
    row.getCell(1).value = s.sectionTitle;
    row.getCell(1).border = cellBorder();
    row.getCell(2).value = s.cumple;
    row.getCell(2).font = { color: { argb: 'FF' + COLORS.success } };
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(2).border = cellBorder();
    row.getCell(3).value = s.cumpleParcial;
    row.getCell(3).font = { color: { argb: 'FF' + COLORS.amber } };
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(3).border = cellBorder();
    row.getCell(4).value = s.noCumple;
    row.getCell(4).font = { color: { argb: 'FF' + COLORS.danger } };
    row.getCell(4).alignment = { horizontal: 'center' };
    row.getCell(4).border = cellBorder();
    row.getCell(5).value = s.noAplica;
    row.getCell(5).font = { color: { argb: 'FF' + COLORS.gray } };
    row.getCell(5).alignment = { horizontal: 'center' };
    row.getCell(5).border = cellBorder();
    row.getCell(6).value = `${s.porcentaje}%`;
    row.getCell(6).font = { bold: true, color: { argb: 'FF' + scoreColor(s.porcentaje) } };
    row.getCell(6).alignment = { horizontal: 'center' };
    row.getCell(6).border = cellBorder();
  });

  // ===== HOJA 3: Detalle Inspección =====
  const wsDetalle = workbook.addWorksheet('Detalle Inspección');
  wsDetalle.columns = [
    { width: 20 },
    { width: 30 },
    { width: 40 },
    { width: 14 },
    { width: 40 },
  ];

  // Header
  const detHeaders = ['Grupo', 'Item', 'Criterio', 'Estado', 'Observación'];
  const detHeaderRow = wsDetalle.getRow(1);
  detHeaders.forEach((h, i) => {
    const cell = detHeaderRow.getCell(i + 1);
    cell.value = h;
    cell.font = headerStyle().font!;
    cell.fill = headerStyle().fill!;
    cell.alignment = headerStyle().alignment!;
    cell.border = cellBorder();
  });
  detHeaderRow.height = 25;

  let currentRow = 2;

  for (const section of inspectionSections) {
    for (const item of section.items) {
      const data = formData.sections[item.id];
      const status = data?.status ? (STATUS_LABELS[data.status] || '—') : 'Sin evaluar';
      const obs = data?.observation || '';
      const color = statusColor(data?.status || null);

      const row = wsDetalle.getRow(currentRow);
      row.getCell(1).value = section.title;
      row.getCell(1).border = cellBorder();
      row.getCell(1).alignment = { vertical: 'top', wrapText: true };
      row.getCell(2).value = item.label;
      row.getCell(2).border = cellBorder();
      row.getCell(2).alignment = { vertical: 'top', wrapText: true };
      row.getCell(3).value = item.criterio;
      row.getCell(3).border = cellBorder();
      row.getCell(3).alignment = { vertical: 'top', wrapText: true };
      row.getCell(4).value = status;
      row.getCell(4).font = { bold: true, color: { argb: 'FF' + color } };
      row.getCell(4).alignment = { horizontal: 'center', vertical: 'top' };
      row.getCell(4).border = cellBorder();
      row.getCell(5).value = obs;
      row.getCell(5).border = cellBorder();
      row.getCell(5).alignment = { vertical: 'top', wrapText: true };
      currentRow++;

      // Photos for this item
      const photoIds = data?.photoIds || [];
      for (const photoId of photoIds) {
        if (!photos[photoId]) continue;

        const imageId = workbook.addImage({
          base64: photos[photoId],
          extension: 'jpeg',
        });

        // Merge cells A-E for the photo row
        wsDetalle.mergeCells(`A${currentRow}:E${currentRow}`);
        wsDetalle.getRow(currentRow).height = 220;

        wsDetalle.addImage(imageId, {
          tl: { col: 0.5, row: currentRow - 1 + 0.1 },
          ext: { width: 380, height: 270 },
        });

        currentRow++;
      }
    }
  }

  // ===== GENERAR Y DESCARGAR =====
  const buffer = await workbook.xlsx.writeBuffer() as unknown as ArrayBuffer;
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `Auditoria_${formData.header.copropiedad?.replace(/\s+/g, '_') || 'Inspeccion'}_${formData.header.fecha}.xlsx`;
  saveAs(blob, fileName);
}
