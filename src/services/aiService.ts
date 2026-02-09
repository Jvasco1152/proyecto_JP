import type { AIAnalysis, InspectionFormData } from '../types/inspection';
import { buildAIPrompt } from '../utils/buildAIPrompt';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGeminiDirect(prompt: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('API key de Gemini no configurada. Configura VITE_GEMINI_API_KEY en .env.local');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error de API Gemini: ${response.status} - ${errorData?.error?.message || 'Error desconocido'}`);
  }

  return response.json();
}

async function callGeminiProxy(prompt: string) {
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

export async function analyzeInspection(formData: InspectionFormData): Promise<AIAnalysis> {
  const prompt = buildAIPrompt(formData);

  const isDev = import.meta.env.DEV;
  const data = isDev
    ? await callGeminiDirect(prompt)
    : await callGeminiProxy(prompt);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

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
