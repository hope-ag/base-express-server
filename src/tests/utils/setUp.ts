import { MongoMemoryServer } from 'mongodb-memory-server';
import { initDbConnection } from '../utils/db';

let dbConnection: any;
let mongoServer: MongoMemoryServer;
beforeEach(async () => {
  const db = await initDbConnection();
  dbConnection = db.connection.connection;
  mongoServer = db.mongoServer;
});

afterEach(async () => {
  await dbConnection.close();
  await mongoServer.stop();
});
