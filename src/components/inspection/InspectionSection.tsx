import type { InspectionItemData, InspectionSectionDef } from '../../types/inspection';
import InspectionItem from './InspectionItem';

interface InspectionSectionProps {
  section: InspectionSectionDef;
  items: Record<string, InspectionItemData>;
  onItemChange: (itemId: string, data: InspectionItemData) => void;
}

export default function InspectionSection({ section, items, onItemChange }: InspectionSectionProps) {
  const completed = section.items.filter(def => items[def.id]?.status !== null).length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(completed / section.items.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {completed}/{section.items.length}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {section.items.map((def, index) => (
          <InspectionItem
            key={def.id}
            definition={def}
            index={index}
            data={items[def.id] || { id: def.id, status: null, observation: '', photoIds: [] }}
            onChange={data => onItemChange(def.id, data)}
          />
        ))}
      </div>
    </div>
  );
}
