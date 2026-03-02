import { ClipboardList, ArrowRight, LogOut } from 'lucide-react';
import type { FormType } from '../types/inspection';
import { formRegistry } from '../data/formRegistry';

interface HomeScreenProps {
  onSelect: (formType: FormType) => void;
  onLogout: () => void;
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    btn: 'bg-blue-700 hover:bg-blue-800',
    numText: 'text-blue-700',
  },
  green: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    btn: 'bg-emerald-700 hover:bg-emerald-800',
    numText: 'text-emerald-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    btn: 'bg-purple-700 hover:bg-purple-800',
    numText: 'text-purple-700',
  },
};

const formTypes: FormType[] = ['gestion_operativa', 'unificada_completa', 'auditoria_norma'];
const formNumbers: Record<FormType, number> = {
  gestion_operativa: 1,
  unificada_completa: 2,
  auditoria_norma: 3,
};

export default function HomeScreen({ onSelect, onLogout }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-primary-800 text-white px-4 py-5 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Auditor JP</h1>
            <p className="text-primary-200 text-sm mt-0.5">Inspección de Copropiedades</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Selecciona el tipo de auditoría</h2>
          <p className="text-sm text-slate-500 mt-1">
            Elige el formulario correspondiente a la auditoría que vas a realizar.
          </p>
        </div>

        <div className="space-y-4">
          {formTypes.map(type => {
            const config = formRegistry[type];
            const colors = colorConfig[config.color];
            const num = formNumbers[type];

            return (
              <div
                key={type}
                className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-4`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.iconBg} ${colors.iconText}`}>
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold mb-0.5 ${colors.numText}`}>
                      Formulario {num}
                    </p>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {config.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3">{config.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                    {config.groups} grupos
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                    {config.items} items
                  </span>
                </div>

                <button
                  onClick={() => onSelect(type)}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-colors ${colors.btn}`}
                >
                  Iniciar auditoría
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
