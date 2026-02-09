import { MessageSquare } from 'lucide-react';

interface StepComentariosProps {
  comentarios: string;
  onChange: (value: string) => void;
}

export default function StepComentarios({ comentarios, onChange }: StepComentariosProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Comentarios Generales</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Observaciones adicionales sobre la inspección
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium text-slate-700">Comentarios del auditor</span>
        </div>
        <textarea
          value={comentarios}
          onChange={e => onChange(e.target.value)}
          placeholder="Escriba aquí cualquier observación general sobre la inspección, aspectos destacados, situaciones especiales encontradas, etc."
          className="w-full px-3 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white placeholder:text-slate-400"
          rows={8}
        />
        <p className="text-xs text-slate-400 mt-2">
          Estos comentarios se incluirán en el informe final y serán considerados por el análisis de IA.
        </p>
      </div>
    </div>
  );
}
