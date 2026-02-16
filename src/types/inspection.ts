export type ComplianceStatus = 'cumple' | 'cumple_parcial' | 'no_cumple' | 'no_aplica' | null;

export interface InspectionItemData {
  id: string;
  status: ComplianceStatus;
  observation: string;
  photoIds: string[]; // Keys in IndexedDB
}

export interface InspectionItemDef {
  id: string;
  label: string;
  criterio: string;
  frecuencia: string;
  allowNA: boolean; // Whether "No Aplica" is an option
}

export interface InspectionSectionDef {
  id: string;
  title: string;
  description: string;
  items: InspectionItemDef[];
}

export interface HeaderData {
  fecha: string;
  director: string;
  directorEmail: string;
  auditor: string;
  auditorEmail: string;
  copropiedad: string;
}

export interface InspectionFormData {
  header: HeaderData;
  sections: Record<string, InspectionItemData>;
  comentarios: string;
}

export interface AIAnalysis {
  resumenEjecutivo: string;
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  hallazgosCriticos: string[];
  recomendaciones: string[];
  porcentajeCumplimiento: number;
}

export interface SectionScore {
  sectionId: string;
  sectionTitle: string;
  total: number;
  cumple: number;
  cumpleParcial: number;
  noCumple: number;
  noAplica: number;
  porcentaje: number;
}

export interface DirectorInfo {
  name: string;
  email: string;
}

export interface AuditorInfo {
  name: string;
  email: string;
}
