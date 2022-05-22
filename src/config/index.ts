import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY,
  JWT_TOKEN_ISSUER,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN
} = process.env;
