import type { InspectionFormData } from '../types/inspection';
import { inspectionSections } from '../data/inspectionSections';
import { calculateSectionScores, calculateOverallScore } from './calculateScores';

export function buildAIPrompt(formData: InspectionFormData): string {
  const scores = calculateSectionScores(formData);
  const overall = calculateOverallScore(formData);

  let prompt = `Eres un experto en administración de copropiedades en Colombia (Ley 675 de 2001). Analiza los siguientes resultados de una auditoría de inspección y genera un informe profesional.

DATOS DE LA INSPECCIÓN:
- Copropiedad: ${formData.header.copropiedad}
- Fecha: ${formData.header.fecha}
- Auditor: ${formData.header.auditor}
- Director: ${formData.header.director}

ESCALA DE EVALUACIÓN:
- Cumple (C) = 100% - El ítem cumple todos los criterios de verificación
- Cumple Parcial (CP) = 50% - El ítem cumple parcialmente los criterios
- No Cumple (NC) = 0% - El ítem no cumple los criterios
- No Aplica (NA) = Excluido del cálculo

RESULTADOS POR SECCIÓN (7 grupos):
`;

  scores.forEach(score => {
    prompt += `\n${score.sectionTitle}: ${score.porcentaje}% cumplimiento (${score.cumple} cumple, ${score.cumpleParcial} parcial, ${score.noCumple} no cumple, ${score.noAplica} N/A)`;
  });

  prompt += `\n\nPUNTAJE GENERAL: ${overall}% de cumplimiento`;

  prompt += `\n\nDETALLE DE HALLAZGOS:`;

  inspectionSections.forEach(section => {
    const itemsWithIssues = section.items.filter(item => {
      const data = formData.sections[item.id];
      return data && (data.status === 'no_cumple' || data.status === 'cumple_parcial' || (data.observation && data.observation.trim()));
    });

    if (itemsWithIssues.length > 0) {
      prompt += `\n\n${section.title}:`;
      itemsWithIssues.forEach(item => {
        const data = formData.sections[item.id];
        if (!data) return;
        const statusLabel = data.status === 'no_cumple' ? 'NO CUMPLE' : data.status === 'cumple_parcial' ? 'CUMPLE PARCIAL' : 'CUMPLE';
        prompt += `\n- ${item.label}: ${statusLabel}`;
        prompt += `\n  Criterio de verificación: ${item.criterio}`;
        if (data.observation.trim()) {
          prompt += `\n  Observación: ${data.observation}`;
        }
      });
    }
  });

  if (formData.comentarios.trim()) {
    prompt += `\n\nCOMENTARIOS GENERALES DEL AUDITOR:\n${formData.comentarios}`;
  }

  prompt += `\n\nGenera tu respuesta en formato JSON con esta estructura exacta:
{
  "resumenEjecutivo": "Párrafo de 3-5 oraciones con resumen ejecutivo profesional",
  "nivelRiesgo": "bajo|medio|alto|critico",
  "hallazgosCriticos": ["hallazgo 1", "hallazgo 2", ...],
  "recomendaciones": ["recomendación priorizada 1", "recomendación priorizada 2", ...],
  "porcentajeCumplimiento": ${overall}
}

IMPORTANTE:
- Responde SOLO con el JSON, sin markdown ni texto adicional
- Las recomendaciones deben estar priorizadas de mayor a menor urgencia
- El nivel de riesgo debe reflejar la gravedad de los hallazgos
- Usa lenguaje profesional y técnico en español
- Incluye referencias a la normatividad colombiana cuando sea relevante
- Ten en cuenta que "Cumple Parcial" indica cumplimiento incompleto que requiere atención`;

  return prompt;
}
