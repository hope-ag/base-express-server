import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { UserLoginData, User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { sendSuccessResponse } from '@/common/core/httpResponse';
import { omit } from 'lodash';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserLoginData = req.body;
      await this.authService.signup(userData);
      sendSuccessResponse(req, res, 'created', 201);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserLoginData = req.body;
      const { cookie, data } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      sendSuccessResponse(req, res, data, 200);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies['Refresh'];
      const { accessToken, foundUser } = await this.authService.refreshToken(refreshToken);
      const response = {
        accessToken,
        user: omit(foundUser, ['password', 'meta'])
      };
      sendSuccessResponse(req, res, response, 200);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      await this.authService.logout(userData);
      res.setHeader('Set-Cookie', ['Refresh=; Max-age=0; httpOnly;']);
      const response = {
        message: 'logoutSuccess',
        accessToken: ''
      };
      sendSuccessResponse(req, res, response, 200);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
