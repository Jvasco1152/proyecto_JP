import type { InspectionItemData } from '../../types/inspection';
import { inspectionSections } from '../../data/inspectionSections';
import InspectionSection from '../inspection/InspectionSection';

interface StepInspectionGroupProps {
  sectionId: string;
  items: Record<string, InspectionItemData>;
  onItemChange: (itemId: string, data: InspectionItemData) => void;
}

export default function StepInspectionGroup({ sectionId, items, onItemChange }: StepInspectionGroupProps) {
  const section = inspectionSections.find(s => s.id === sectionId)!;

  return (
    <InspectionSection
      section={section}
      items={items}
      onItemChange={onItemChange}
    />
  );
}
