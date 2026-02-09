import type { InspectionItemData } from '../../types/inspection';
import { inspectionSections } from '../../data/inspectionSections';
import InspectionSection from '../inspection/InspectionSection';

interface StepDocumentosLegalesProps {
  items: Record<string, InspectionItemData>;
  onItemChange: (itemId: string, data: InspectionItemData) => void;
}

export default function StepDocumentosLegales({ items, onItemChange }: StepDocumentosLegalesProps) {
  const section = inspectionSections.find(s => s.id === 'documentos_legales')!;

  return (
    <InspectionSection
      section={section}
      items={items}
      onItemChange={onItemChange}
    />
  );
}
