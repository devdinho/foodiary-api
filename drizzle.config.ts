import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

const stage = process.env.SLS_STAGE || process.env.STAGE || 'staging';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${stage}`) });

if (!process.env.DATABASE_URL) {
  throw new Error(`❌ DATABASE_URL não encontrada em .env.${stage}`);
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
