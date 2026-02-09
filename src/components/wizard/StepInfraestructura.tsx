import type { InspectionItemData } from '../../types/inspection';
import { inspectionSections } from '../../data/inspectionSections';
import InspectionSection from '../inspection/InspectionSection';

interface StepInfraestructuraProps {
  items: Record<string, InspectionItemData>;
  onItemChange: (itemId: string, data: InspectionItemData) => void;
}

export default function StepInfraestructura({ items, onItemChange }: StepInfraestructuraProps) {
  const section = inspectionSections.find(s => s.id === 'infraestructura')!;

  return (
    <InspectionSection
      section={section}
      items={items}
      onItemChange={onItemChange}
    />
  );
}
