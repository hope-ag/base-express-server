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
  ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY,
  JWT_TOKEN_ISSUER,
  REDIS_HOST,
  REDIS_PORT,
  DB_URI,
  ORIGIN
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
