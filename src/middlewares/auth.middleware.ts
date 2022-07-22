import { NextFunction, RequestHandler, Response } from 'express';
import { Unauthorized } from 'http-errors';
import { RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@/database/models/users';
import { extractTokenData } from '@/common/utils/tokens';

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
          next(new Unauthorized('errorMessages.invalidToken'));
        }
      } else {
        next(new Unauthorized(`errorMessages.missingToken`));
      }
    } catch (error) {
      next(new Unauthorized(`errorMessages.invalidToken`));
    }
  };
};

export default authMiddleware;
