import { useCallback, useEffect, useRef } from 'react';
import type { InspectionFormData } from '../types/inspection';

const STORAGE_KEY = 'auditor_jp_form_data';
const SAVE_DEBOUNCE_MS = 500;

export function getDefaultFormData(): InspectionFormData {
  return {
    header: {
      fecha: new Date().toISOString().split('T')[0],
      director: '',
      directorEmail: '',
      auditor: '',
      auditorEmail: '',
      copropiedad: '',
    },
    sections: {},
    comentarios: '',
  };
}

export function useFormPersistence(formData: InspectionFormData, setFormData: (data: InspectionFormData) => void) {
  const timeoutRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  // Load saved data on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InspectionFormData;
        setFormData(parsed);
      }
    } catch (e) {
      console.error('Error loading saved form data:', e);
    }
  }, [setFormData]);

  // Auto-save on changes (debounced)
  const save = useCallback((data: InspectionFormData) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving form data:', e);
      }
    }, SAVE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (initializedRef.current) {
      save(formData);
    }
  }, [formData, save]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { clearSavedData };
}
