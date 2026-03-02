import type { InspectionItemData, InspectionSectionDef } from '../../types/inspection';
import InspectionSection from '../inspection/InspectionSection';

interface StepInspectionGroupProps {
  section: InspectionSectionDef;
  items: Record<string, InspectionItemData>;
  onItemChange: (itemId: string, data: InspectionItemData) => void;
}

export default function StepInspectionGroup({ section, items, onItemChange }: StepInspectionGroupProps) {
  return (
    <InspectionSection
      section={section}
      items={items}
      onItemChange={onItemChange}
    />
  );
}
