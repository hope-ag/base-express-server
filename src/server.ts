import app from './app';
import validateEnv from '@common/utils/validateEnv';
import { connect, set } from 'mongoose';
import { dbConnection } from '@common/config';
import { logger } from '@common/core/logger';

export function initDbConnection() {
  if (process.env.NODE_ENV !== 'production') {
    set('debug', true);
  }
  return connect(dbConnection.url, dbConnection.options);
}

validateEnv();
try {
  initDbConnection().then(() => {
    logger.info('Connected to MongoDB');
    app.listen();
  });
} catch (error) {
  logger.error(error);
}
