import { Pool } from 'pg';

// Pool unique reutilise entre les requetes (evite d'ouvrir une connexion
// par requete HTTP). En dev, on l'attache a `global` pour survivre au
// hot-reload de Next.js.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10
  });

if (process.env.NODE_ENV !== 'production') {
  global.__pgPool = pool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
