import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.signUp
    );

    this.router.post(
      `${this.path}login`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.logIn
    );
    //check for refresh token in cookie
    this.router.post(
      `${this.path}refresh`,
      authMiddleware('refresh'),
      this.authController.refreshToken
    );

    this.router.post(
      `${this.path}logout`,
      authMiddleware('refresh'),
      this.authController.logOut
    );
  }
}

export default new AuthRoute();
