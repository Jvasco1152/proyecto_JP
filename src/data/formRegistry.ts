import type { FormType, InspectionSectionDef } from '../types/inspection';
import { form1Sections } from './form1Sections';
import { form2Sections } from './form2Sections';
import { form3Sections } from './form3Sections';

export interface FormConfig {
  title: string;
  shortTitle: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
  groups: number;
  items: number;
  sections: InspectionSectionDef[];
  stepLabels: string[];
}

export const formRegistry: Record<FormType, FormConfig> = {
  gestion_operativa: {
    title: 'Gestión Operativa e Infraestructura',
    shortTitle: 'Gestión Operativa',
    description: 'Auditoría operativa de seguridad, aseo, infraestructura, comunicación y servicios de la copropiedad.',
    color: 'blue',
    groups: 7,
    items: 18,
    sections: form1Sections,
    stepLabels: ['Datos', ...form1Sections.map(s => s.stepLabel), 'Coment.', 'Informe'],
  },
  unificada_completa: {
    title: 'Unificada Completa',
    shortTitle: 'Unificada Completa',
    description: 'Revisión integral que incluye fundamentación legal, SG-SST, gestión ambiental, ley de piscinas y bienestar.',
    color: 'green',
    groups: 5,
    items: 25,
    sections: form2Sections,
    stepLabels: ['Datos', ...form2Sections.map(s => s.stepLabel), 'Coment.', 'Informe'],
  },
  auditoria_norma: {
    title: 'Auditoría Norma',
    shortTitle: 'Auditoría Norma',
    description: 'Evaluación documental exhaustiva, de conocimientos procedimentales y de infraestructura según normatividad.',
    color: 'purple',
    groups: 3,
    items: 34,
    sections: form3Sections,
    stepLabels: ['Datos', ...form3Sections.map(s => s.stepLabel), 'Coment.', 'Informe'],
  },
};
