// import { REDIS_PORT, REDIS_HOST } from '@/common/config';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';
import RedisClient from 'ioredis';
import { NextFunction, Request, Response } from 'express';

const client = new RedisClient();

client.on('error', err => {
  console.log('Error ' + err);
});

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('message', channel => {
  console.log(`Received message on channel ${channel}`);
});

export const authLimiter = (req: Request, res: Response, next: NextFunction) =>
  rateLimit({
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
  delayMs: 500
});

// // only apply to POST requests to /reset-password/
// app.post("/reset-password/", resetPasswordSpeedLimiter, function(req, res) {
//   // handle /reset-password/ request here...
// });
