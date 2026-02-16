import { useCallback, useEffect, useRef } from 'react';
import type { InspectionFormData } from '../types/inspection';

const STORAGE_KEY = 'auditor_jp_form_data';
const STORAGE_VERSION_KEY = 'auditor_jp_form_version';
const CURRENT_VERSION = 2; // v2: 17 items / 7 groups / cumple_parcial
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
      const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      const version = savedVersion ? parseInt(savedVersion, 10) : 1;

      // Clear incompatible data from old versions
      if (version < CURRENT_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
        return;
      }

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
        localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
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
    localStorage.removeItem(STORAGE_VERSION_KEY);
  }, []);

  return { clearSavedData };
}
