import { connect, set } from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from '@/common/core/logger';

export async function initDbConnection() {
  // const mongoServer = await MongoMemoryServer.create();
  // const url = mongoServer.getUri();
  const url = process.env.MONGO_URL;

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
  logger.info('Connected to MongoDB on' + url);

  return {
    // mongoServer,
    connection
  };
}
