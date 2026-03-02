import { useState } from 'react';

// SHA-256 of default password "jp2025"
// To use a different password: node scripts/generate-hash.mjs <nueva_contraseña>
// Then set VITE_AUTH_PASSWORD_HASH in .env.local and in Vercel environment variables
const DEFAULT_USERNAME = 'admin';
const DEFAULT_HASH = '92d495a50a6e29d12991f29d0c20ea1e550238247502ed0dbda7f49f938cb28b';

const ALLOWED_USERNAME = (import.meta.env.VITE_AUTH_USERNAME as string) || DEFAULT_USERNAME;
const ALLOWED_HASH = (import.meta.env.VITE_AUTH_PASSWORD_HASH as string) || DEFAULT_HASH;

const SESSION_KEY = 'auditor_jp_auth_session';
const SESSION_HOURS = 8;

interface AuthSession {
  expiresAt: number;
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadSession(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw) as AuthSession;
    if (Date.now() > s.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(loadSession);

  const login = async (username: string, password: string): Promise<boolean> => {
    const hash = await sha256(password);
    if (username.trim() === ALLOWED_USERNAME && hash === ALLOWED_HASH) {
      const session: AuthSession = {
        expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
