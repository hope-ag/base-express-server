import { authenticateUser } from '@/middlewares/auth.middleware';
import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { registrationSchema, loginSchema } from '@/validators/users.validator';
import { authLimiter } from '@/middlewares/rate-limit.middleware';

export class AuthRoute implements Routes {
  public path = '/';
  public domain: 'auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      authLimiter,
      validationMiddleware(registrationSchema, 'body'),
      this.authController.signUp
    );

    this.router.post(
      `${this.path}login`,
      authLimiter,
      validationMiddleware(loginSchema, 'body'),
      this.authController.logIn
    );
    //check for refresh token in cookie
    this.router.post(
      `${this.path}refresh`,
      authenticateUser('cookie', 'errorMessages.invalidRefreshToken'),
      this.authController.refreshToken
    );

    this.router.post(
      `${this.path}logout`,
      authenticateUser('cookie', 'errorMessages.invalidRefreshToken'),
      this.authController.logOut
    );
  }
}

export const authRoute = new AuthRoute();
