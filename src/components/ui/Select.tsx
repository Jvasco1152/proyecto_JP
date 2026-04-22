import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
  allowCustom?: boolean;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  required = false,
  searchable = false,
  allowCustom = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const comboRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selectedLabel = options.find(o => o.value === value)?.label;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && !allowCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable, allowCustom]);

  // --- Modo combobox (allowCustom) ---
  if (allowCustom) {
    return (
      <div ref={containerRef} className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            ref={comboRef}
            type="text"
            value={isOpen ? search : (value || '')}
            placeholder={placeholder}
            onFocus={() => {
              setSearch(value || '');
              setIsOpen(true);
            }}
            onChange={e => {
              setSearch(e.target.value);
              onChange(e.target.value);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsOpen(false);
                setSearch('');
              }, 150);
            }}
            className={`w-full px-3 py-2.5 pr-9 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              value ? 'text-slate-900' : 'text-slate-400'
            }`}
          />
          <ChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {isOpen && filtered.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filtered.map(option => (
              <button
                key={option.value}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearch('');
                  comboRef.current?.blur();
                }}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-primary-50 transition-colors ${
                  value === option.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Modo select clásico ---
  const classicFiltered = searchable && search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-left bg-white border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          value ? 'text-slate-900 border-slate-300' : 'text-slate-400 border-slate-300'
        }`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-slate-100">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
          <div className="overflow-y-auto max-h-48">
            {classicFiltered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">Sin resultados</div>
            ) : (
              classicFiltered.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-primary-50 transition-colors ${
                    value === option.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
