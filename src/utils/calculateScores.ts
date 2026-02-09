import type { InspectionFormData, SectionScore } from '../types/inspection';
import { inspectionSections } from '../data/inspectionSections';

export function calculateSectionScores(formData: InspectionFormData): SectionScore[] {
  return inspectionSections.map(section => {
    let cumple = 0;
    let noCumple = 0;
    let noAplica = 0;

    section.items.forEach(item => {
      const data = formData.sections[item.id];
      if (!data) return;
      if (data.status === 'cumple') cumple++;
      else if (data.status === 'no_cumple') noCumple++;
      else if (data.status === 'no_aplica') noAplica++;
    });

    const evaluados = cumple + noCumple;
    const porcentaje = evaluados > 0 ? Math.round((cumple / evaluados) * 100) : 0;

    return {
      sectionId: section.id,
      sectionTitle: section.title,
      total: section.items.length,
      cumple,
      noCumple,
      noAplica,
      porcentaje,
    };
  });
}

export function calculateOverallScore(formData: InspectionFormData): number {
  const scores = calculateSectionScores(formData);
  const totalCumple = scores.reduce((acc, s) => acc + s.cumple, 0);
  const totalNoCumple = scores.reduce((acc, s) => acc + s.noCumple, 0);
  const totalEvaluados = totalCumple + totalNoCumple;
  return totalEvaluados > 0 ? Math.round((totalCumple / totalEvaluados) * 100) : 0;
}
