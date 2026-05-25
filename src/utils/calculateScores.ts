import type { InspectionFormData, InspectionSectionDef, SectionScore } from '../types/inspection';

export function calculateSectionScores(
  formData: InspectionFormData,
  sections: InspectionSectionDef[],
): SectionScore[] {
  return sections.map(section => {
    let cumple = 0;
    let cumpleParcial = 0;
    let noCumple = 0;
    let noAplica = 0;

    section.items.forEach(item => {
      const data = formData.sections[item.id];
      if (!data) return;
      if (data.status === 'cumple') cumple++;
      else if (data.status === 'cumple_parcial') cumpleParcial++;
      else if (data.status === 'no_cumple') noCumple++;
      else if (data.status === 'no_aplica') noAplica++;
    });

    const evaluados = cumple + cumpleParcial + noCumple;
    const noAplicable = evaluados === 0;
    const porcentaje = evaluados > 0
      ? Math.round((cumple * 100 + cumpleParcial * 50) / evaluados)
      : 0;

    return {
      sectionId: section.id,
      sectionTitle: section.title,
      total: section.items.length,
      cumple,
      cumpleParcial,
      noCumple,
      noAplica,
      porcentaje,
      noAplicable,
    };
  });
}

export function calculateOverallScore(
  formData: InspectionFormData,
  sections: InspectionSectionDef[],
): number {
  const scores = calculateSectionScores(formData, sections);
  const activeScores = scores.filter(s => !s.noAplicable);
  if (activeScores.length === 0) return 0;
  const sum = activeScores.reduce((acc, s) => acc + s.porcentaje, 0);
  return Math.round(sum / activeScores.length);
}
