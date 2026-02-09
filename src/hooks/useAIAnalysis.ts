import { useState, useCallback } from 'react';
import type { AIAnalysis, InspectionFormData } from '../types/inspection';
import { analyzeInspection } from '../services/aiService';

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (formData: InspectionFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeInspection(formData);
      setAnalysis(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, analyze, reset };
}
