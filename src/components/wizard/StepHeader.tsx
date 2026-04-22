import { Calendar, Mail } from 'lucide-react';
import type { HeaderData } from '../../types/inspection';
import { directors } from '../../data/directors';
import { auditors } from '../../data/auditors';
import { copropiedades } from '../../data/copropiedades';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface StepHeaderProps {
  data: HeaderData;
  onChange: (data: HeaderData) => void;
}

export default function StepHeader({ data, onChange }: StepHeaderProps) {
  const directorOptions = directors.map(d => ({ value: d.name, label: d.name }));
  const auditorOptions = auditors.map(a => ({ value: a.name, label: a.name }));
  const copropiedadOptions = copropiedades.map(c => ({ value: c, label: c }));

  function handleDirectorChange(name: string) {
    const dir = directors.find(d => d.name === name);
    onChange({ ...data, director: name, directorEmail: dir?.email || data.directorEmail || '' });
  }

  function handleAuditorChange(name: string) {
    const aud = auditors.find(a => a.name === name);
    onChange({ ...data, auditor: name, auditorEmail: aud?.email || data.auditorEmail || '' });
  }

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

      <Select
        label="Director"
        value={data.director}
        onChange={handleDirectorChange}
        options={directorOptions}
        placeholder="Escribe o selecciona un director..."
        searchable
        allowCustom
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

      <Select
        label="Auditor"
        value={data.auditor}
        onChange={handleAuditorChange}
        options={auditorOptions}
        placeholder="Escribe o selecciona un auditor..."
        searchable
        allowCustom
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

      <Select
        label="Copropiedad"
        value={data.copropiedad}
        onChange={v => onChange({ ...data, copropiedad: v })}
        options={copropiedadOptions}
        placeholder="Escribe o selecciona una copropiedad..."
        searchable
        allowCustom
        required
      />
    </div>
  );
}
