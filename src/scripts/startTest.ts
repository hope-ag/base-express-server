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

  console.log(`\x1b[42m \x1b[37m MONGODB \x1b[0m  server created at\x1b[36m ${url}\x1b[0m`);

  const child = spawn(`DB_URI=${url} pnpm`, ['test:app'], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', () => {
    child.kill();
  });

  child.on('exit', async code => {
    await mongoServer.stop();
    logger.info('Shutting down');
    if (code) {
      process.exit(code);
    } else {
      process.exit();
    }
  });
}

startTest();
