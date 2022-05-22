import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { sendSuccessResponse } from '@/core/utils/httpResponse';
import { InternalServerError, Unauthorized } from 'http-errors';
import { omit } from 'lodash';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);
      if (!signUpUserData) throw new InternalServerError('User not created');
      sendSuccessResponse(res, 'Account created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, data } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      sendSuccessResponse(res, data, 200);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies['Refresh'];
      if (!refreshToken) throw new Unauthorized('Refresh token missing');
      const { accessToken, foundUser } = await this.authService.refreshToken(
        refreshToken
      );
      const response = {
        accessToken,
        user: omit(foundUser, ['password', 'meta'])
      };
      sendSuccessResponse(res, response, 200);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
