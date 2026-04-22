import { Calendar, Mail, User, Building2 } from 'lucide-react';
import type { HeaderData } from '../../types/inspection';
import Input from '../ui/Input';

interface StepHeaderProps {
  data: HeaderData;
  onChange: (data: HeaderData) => void;
}

export default function StepHeader({ data, onChange }: StepHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Datos Generales</h2>
        <p className="text-sm text-slate-500 mt-0.5">Información básica de la inspección</p>
      </div>

      <Input
        label="Fecha de inspección"
        type="date"
        value={data.fecha}
        onChange={e => onChange({ ...data, fecha: e.target.value })}
        icon={<Calendar className="w-4 h-4" />}
        required
      />

      <Input
        label="Director"
        type="text"
        value={data.director}
        onChange={e => onChange({ ...data, director: e.target.value })}
        icon={<User className="w-4 h-4" />}
        placeholder="Nombre del director"
        required
      />

      <Input
        label="Email director"
        type="email"
        value={data.directorEmail}
        onChange={e => onChange({ ...data, directorEmail: e.target.value })}
        icon={<Mail className="w-4 h-4" />}
        placeholder="correo@ejemplo.com"
      />

      <Input
        label="Auditor"
        type="text"
        value={data.auditor}
        onChange={e => onChange({ ...data, auditor: e.target.value })}
        icon={<User className="w-4 h-4" />}
        placeholder="Nombre del auditor"
        required
      />

      <Input
        label="Email auditor"
        type="email"
        value={data.auditorEmail}
        onChange={e => onChange({ ...data, auditorEmail: e.target.value })}
        icon={<Mail className="w-4 h-4" />}
        placeholder="correo@ejemplo.com"
      />

      <Input
        label="Copropiedad"
        type="text"
        value={data.copropiedad}
        onChange={e => onChange({ ...data, copropiedad: e.target.value })}
        icon={<Building2 className="w-4 h-4" />}
        placeholder="Nombre de la copropiedad"
        required
      />
    </div>
  );
}
