import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const LOG_DIR = '../logs';
export const LOG_FORMAT = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const {
  NODE_ENV,
  PORT,
  ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY,
  JWT_TOKEN_ISSUER,
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
