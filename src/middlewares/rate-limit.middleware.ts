import { logger } from '@common/core/logger';
// import { REDIS_PORT, REDIS_HOST } from '@/common/config';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';
import RedisClient from 'ioredis';
import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from '../common/config';

let client!: RedisClient;

if (NODE_ENV === 'production') {
  client = new RedisClient();

  client.on('error', err => {
    logger.error(err);
  });

  client.on('connect', () => {
    logger.info('Redis connected');
  });

  client.on('message', channel => {
    logger.info(`Received message on channel ${channel}`);
  });
}

export const authLimiter = (req: Request, res: Response, next: NextFunction) =>
  process.env.NODE_ENV !== 'production'
    ? next()
    : rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 60,
        message: { message: req.t('errorMessages.tooManyRequests'), success: false },
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
          // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
          sendCommand: (...args: string[]) => client.call(...args),
          prefix: 'rl'
        })
      })(req, res, next);

// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
// app.set('trust proxy', 1); // trust first proxy

export const appRequestSpeedLimiter = slowDown({
  delayAfter: 30,
  maxDelayMs: 20000,
  delayMs: process.env.NODE_ENV === 'production' ? 500 : 0
});

// // only apply to POST requests to /reset-password/
// app.post("/reset-password/", resetPasswordSpeedLimiter, function(req, res) {
//   // handle /reset-password/ request here...
// });
