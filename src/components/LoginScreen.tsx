import { useState } from 'react';
import { Eye, EyeOff, LogIn, ClipboardList } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');
    try {
      const ok = await onLogin(username, password);
      if (!ok) {
        setError('Usuario o contraseña incorrectos.');
        setPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4">

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Card header */}
        <div className="bg-primary-800 px-8 py-7 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-4">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Auditor JP</h1>
          <p className="text-primary-200 text-sm mt-1">Inspección de Copropiedades</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <div>
            <p className="text-slate-500 text-xs text-center mb-5">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full py-3 px-4 rounded-xl bg-primary-700 hover:bg-primary-800 disabled:bg-primary-300 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <LogIn className="w-4 h-4" />
            }
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>

      <p className="text-primary-300 text-xs mt-6 text-center">
        Acceso restringido · Solo personal autorizado
      </p>
    </div>
  );
}
