import app from './app';
import validateEnv from '@common/utils/validateEnv';
import { connect, set } from 'mongoose';
import { dbConnection } from '@common/config';

export function initDbConnection() {
  if (process.env.NODE_ENV !== 'production') {
    set('debug', true);
  }
  return connect(dbConnection.url, dbConnection.options);
}

validateEnv();
try {
  initDbConnection().then(() => {
    console.log('DB connected');
    app.listen();
  });
} catch (error) {
  console.log(error);
}
