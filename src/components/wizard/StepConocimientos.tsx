import type { InspectionItemData } from '../../types/inspection';
import { inspectionSections } from '../../data/inspectionSections';
import InspectionSection from '../inspection/InspectionSection';

interface StepConocimientosProps {
  items: Record<string, InspectionItemData>;
  onItemChange: (itemId: string, data: InspectionItemData) => void;
}

export default function StepConocimientos({ items, onItemChange }: StepConocimientosProps) {
  const section = inspectionSections.find(s => s.id === 'conocimientos')!;

  return (
    <InspectionSection
      section={section}
      items={items}
      onItemChange={onItemChange}
    />
  );
}
