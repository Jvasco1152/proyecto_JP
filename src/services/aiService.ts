import type { AIAnalysis, InspectionFormData } from '../types/inspection';
import { buildAIPrompt } from '../utils/buildAIPrompt';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

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
      messages: [{ role: 'user', content: prompt }],
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
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error del servidor: ${response.status} - ${errorData?.error || 'Error desconocido'}`);
  }

  return response.json();
}

function extractText(data: any, isDev: boolean): string {
  if (isDev) {
    // Groq direct: OpenAI-compatible format
    return data.choices?.[0]?.message?.content || '';
  }
  // Proxy returns same format
  return data.choices?.[0]?.message?.content || '';
}

export async function analyzeInspection(formData: InspectionFormData): Promise<AIAnalysis> {
  const prompt = buildAIPrompt(formData);

  const isDev = import.meta.env.DEV;
  const data = isDev
    ? await callGroqDirect(prompt)
    : await callGroqProxy(prompt);

  const text = extractText(data, isDev);

  if (!text) {
    throw new Error('La API no devolvió contenido');
  }

  // Extract JSON from potential markdown wrapping
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
