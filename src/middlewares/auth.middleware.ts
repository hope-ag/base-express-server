import { NextFunction, RequestHandler, Response } from 'express';
import { Unauthorized } from 'http-errors';
import { RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@/models/users';
import { extractTokenData } from '@/core/utils/auth';

/**
 *@param { type } type of token. access or refresh
 */

const authMiddleware = (type: 'access' | 'refresh'): RequestHandler => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      let Authorization: string | null = null;
      if (type === 'access') {
        Authorization = req.header('Authorization').split('Bearer ')[1];
      }
      if (type === 'refresh') {
        Authorization = req.cookies['Refresh'];
      }

      if (Authorization) {
        const verificationResponse = extractTokenData(Authorization, type);
        const userId = verificationResponse._id;
        const foundUser = await userModel.findById(userId);

        if (foundUser) {
          req.user = foundUser;
          next();
        } else {
          next(new Unauthorized(`invalid ${type} token`));
        }
      } else {
        next(new Unauthorized(`${type} token missing`));
      }
    } catch (error) {
      next(new Unauthorized(`${type} token missing`));
    }
  };
};

export default authMiddleware;
