import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const baseMessage = "DATABASE_URL environment variable is missing.";
  const hint = process.env.VERCEL
    ? "Add DATABASE_URL to your Vercel project Environment Variables."
    : "Did you forget to provision a database or set the variable locally?";
  throw new Error(`${baseMessage} ${hint}`);
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });