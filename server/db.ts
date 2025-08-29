// server/db.ts
import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

// Cache de conexiones HTTP en serverless
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

// Cliente HTTP (NO websockets)
export const sql = neon(process.env.DATABASE_URL);

// Drizzle usando el cliente HTTP
export const db = drizzle({ client: sql, schema });
