import { config } from 'dotenv';
import path from 'path';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const LOG_DIR = path.resolve(__dirname, '..', '..', '..', 'logs');
export const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
export const LOG_FORMAT = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const JWT_TOKEN_ALGORITHM = 'RS256';

export const {
  NODE_ENV,
  PORT,
  JWT_TOKEN_ISSUER,
  REDIS_HOST,
  REDIS_PORT,
  DB_URI,
  ORIGIN,
  JEST_WORKER_ID
} = process.env;

export const dbConnection = {
  url: DB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
};
