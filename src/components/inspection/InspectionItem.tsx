import { ChevronDown, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { useState } from 'react';
import type { ComplianceStatus, InspectionItemData, InspectionItemDef } from '../../types/inspection';
import PhotoCapture from './PhotoCapture';

interface InspectionItemProps {
  definition: InspectionItemDef;
  data: InspectionItemData;
  index: number;
  onChange: (data: InspectionItemData) => void;
}

const statusConfig: Record<string, { label: string; color: string; activeColor: string }> = {
  cumple: { label: 'Cumple', color: 'text-green-600', activeColor: 'bg-green-50 border-green-500 text-green-700' },
  no_cumple: { label: 'No Cumple', color: 'text-red-600', activeColor: 'bg-red-50 border-red-500 text-red-700' },
  no_aplica: { label: 'N/A', color: 'text-slate-500', activeColor: 'bg-slate-50 border-slate-400 text-slate-600' },
};

function StatusIcon({ status }: { status: ComplianceStatus }) {
  if (status === 'cumple') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  if (status === 'no_cumple') return <XCircle className="w-5 h-5 text-red-500" />;
  if (status === 'no_aplica') return <MinusCircle className="w-5 h-5 text-slate-400" />;
  return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
}

export default function InspectionItem({ definition, data, index, onChange }: InspectionItemProps) {
  const [expanded, setExpanded] = useState(false);

  const statuses: ComplianceStatus[] = definition.allowNA
    ? ['cumple', 'no_cumple', 'no_aplica']
    : ['cumple', 'no_cumple'];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      data.status === 'cumple' ? 'border-green-200 bg-green-50/30' :
      data.status === 'no_cumple' ? 'border-red-200 bg-red-50/30' :
      data.status === 'no_aplica' ? 'border-slate-200 bg-slate-50/30' :
      'border-slate-200 bg-white'
    }`}>
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <StatusIcon status={data.status} />
        <span className="flex-1 text-sm font-medium text-slate-800 leading-tight">
          {definition.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3">
          {/* Status radio buttons */}
          <div className="flex gap-2">
            {statuses.map(s => {
              const config = statusConfig[s!];
              const isActive = data.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ ...data, status: s })}
                  className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg border-2 transition-all ${
                    isActive ? config.activeColor : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>

          {/* Observation */}
          <div>
            <textarea
              value={data.observation}
              onChange={e => onChange({ ...data, observation: e.target.value })}
              placeholder="Observación (opcional)..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white placeholder:text-slate-400"
              rows={2}
            />
          </div>

          {/* Photo capture */}
          <PhotoCapture
            itemId={definition.id}
            photoIds={data.photoIds}
            onPhotosChange={photoIds => onChange({ ...data, photoIds })}
          />
        </div>
      )}
    </div>
  );
}
