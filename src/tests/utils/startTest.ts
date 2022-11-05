import { MongoMemoryServer, MongoMemoryReplSet } from 'mongodb-memory-server';
import { logger } from '@/common/core/logger';
import { spawn } from 'child_process';

async function startTest() {
  const mongoServer = new MongoMemoryServer();
  const replSet = new MongoMemoryReplSet({
    replSet: { storageEngine: 'wiredTiger' }
  });

  replSet.start();

  await replSet.waitUntilRunning();

  const url = replSet.getUri();
  console.log(url);

  const child = spawn(`MONGO_URL=${url} pnpm`, ['test:dev'], {
    stdio: 'inherit',
    shell: true
    // env: {
    //   MONGO_URL: url
    // }
  });

  child.on('close', () => {
    console.log('Closed!!');
    child.kill();
  });

  child.on('error', e => {
    console.log(e);
  });

  child.on('exit', () => {
    logger.info('Shutting down');
    mongoServer.stop();
    process.exit();
  });
}

startTest();
