import { connect, set } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function initDbConnection() {
  const mongoServer = await MongoMemoryServer.create();
  const url = mongoServer.getUri();

  const config = {
    url,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  };
  if (process.env.NODE_ENV !== 'production') {
    set('debug', true);
  }
  const connection = await connect(config.url, config.options);

  return {
    mongoServer,
    connection
  };
}
