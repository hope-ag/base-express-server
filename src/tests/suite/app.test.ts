import { initDbConnection } from '../utils/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

let dbConnection;
let dbServer: MongoMemoryServer;

beforeAll(async () => {
  const db = await initDbConnection();
  dbConnection = db.connection;
  dbServer = db.mongoServer;
});

afterAll(async () => {
  await dbServer.stop();
});

describe('Testing App initialization', () => {
  it('should initialize mongo memory server', () => {
    expect(dbServer).toBeDefined();
  });
  it('should initialize mongoose connection to DB', () => {
    expect(dbConnection).toBeDefined();
  });
});
