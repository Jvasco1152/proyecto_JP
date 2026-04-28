import type { AIAnalysis, InspectionFormData, InspectionSectionDef } from '../types/inspection';
import { buildAIPrompt } from '../utils/buildAIPrompt';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const SYSTEM_PROMPT = `Actúa como un Consultor Senior y Auditor Externo experto en Propiedad Horizontal en Colombia, con más de 15 años de experiencia en la gestión de copropiedades residenciales, comerciales y mixtas. Tu base de conocimiento principal es:

- La Ley 675 de 2001 (Régimen de Propiedad Horizontal).
- Normatividad contable (NIIF para Pymes aplicadas a PH).
- Normas de Seguridad y Salud en el Trabajo (SGSST) aplicadas a edificios.
- Jurisprudencia de la Corte Constitucional sobre convivencia y debido proceso.

Tus tareas principales serán:
- Redactar Resúmenes Ejecutivos: Deben ser claros, concisos y dirigidos a Consejos de Administración o Asambleas de Copropietarios.
- Documentar Hallazgos de Auditoría: Utiliza una estructura técnica que incluya: Condición (qué se encontró), Criterio (qué norma se incumple), Causa, Efecto y Recomendación.

Estilo y Tono:
- Profesional, objetivo y estrictamente basado en la norma vigente.
- Capacidad para diferenciar entre áreas comunes, coeficientes de copropiedad y sanciones.
- Si un tema requiere la intervención de un abogado litigante o un contador especializado, debes mencionarlo como una sugerencia de control.`;

async function callGroqDirect(prompt: string) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('API key de Groq no configurada. Configura VITE_GROQ_API_KEY en .env.local');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error de API Groq: ${response.status} - ${errorData?.error?.message || 'Error desconocido'}`);
  }

  return response.json();
}

async function callGroqProxy(prompt: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt: SYSTEM_PROMPT }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error del servidor: ${response.status} - ${errorData?.error || 'Error desconocido'}`);
  }

  return response.json();
}

function extractText(data: any, isDev: boolean): string {
  if (isDev) {
    return data.choices?.[0]?.message?.content || '';
  }
  return data.choices?.[0]?.message?.content || '';
}

export async function analyzeInspection(
  formData: InspectionFormData,
  sections: InspectionSectionDef[],
): Promise<AIAnalysis> {
  const prompt = buildAIPrompt(formData, sections);

  const isDev = import.meta.env.DEV;
  const data = isDev
    ? await callGroqDirect(prompt)
    : await callGroqProxy(prompt);

  const text = extractText(data, isDev);

  if (!text) {
    throw new Error('La API no devolvió contenido');
  }

  let jsonText = text.trim();
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const analysis = JSON.parse(jsonText) as AIAnalysis;
    return analysis;
  } catch {
    throw new Error('Error al parsear respuesta de IA. Respuesta: ' + text.substring(0, 200));
  }
}
