import { Unauthorized } from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export function authenticateUser(strategy: 'jwt' | 'cookie', errorMessage: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await passport.authenticate(strategy, { session: false }, (err, user) => {
        if (err) {
          return next(new Unauthorized(errorMessage));
        }
        if (!user) {
          return next(new Unauthorized(errorMessage));
        }
        req.user = user;
        next();
      })(req, res, next);
    } catch (error) {
      next(new Unauthorized(errorMessage));
    }
  };
}
