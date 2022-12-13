import { initDbConnection } from '@@/src/server';

let dbConnection: any;
beforeEach(async () => {
  const db = await initDbConnection();
  dbConnection = db.connection;
});

afterEach(async () => {
  await dbConnection.close();
});
