/**
 * Genera el hash SHA-256 de una contraseña para usar en Auditor JP.
 *
 * Uso:
 *   node scripts/generate-hash.mjs <contraseña>
 *
 * Ejemplo:
 *   node scripts/generate-hash.mjs MiNuevaContrasena123
 *
 * Luego copia el hash generado en:
 *   - .env.local → VITE_AUTH_PASSWORD_HASH=<hash>
 *   - Vercel → Settings > Environment Variables > VITE_AUTH_PASSWORD_HASH
 */

import { createHash } from 'crypto';

const password = process.argv[2];

if (!password) {
  console.error('❌  Falta la contraseña.');
  console.error('   Uso: node scripts/generate-hash.mjs <contraseña>');
  process.exit(1);
}

const hash = createHash('sha256').update(password).digest('hex');

console.log('');
console.log('✅  Hash generado:');
console.log('');
console.log(`   VITE_AUTH_PASSWORD_HASH=${hash}`);
console.log('');
console.log('📋  Copia esa línea en .env.local y en las variables de entorno de Vercel.');
console.log('');
