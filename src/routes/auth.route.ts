import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
// import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { registrationSchema, loginSchema } from '@/validators/users.validator';
import passport from 'passport';

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
      validationMiddleware(registrationSchema, 'body'),
      this.authController.signUp
    );

    this.router.post(
      `${this.path}login`,
      validationMiddleware(loginSchema, 'body'),
      this.authController.logIn
    );
    //check for refresh token in cookie
    this.router.post(
      `${this.path}refresh`,
      passport.authenticate('cookie', { session: false }),
      this.authController.refreshToken
    );

    this.router.post(
      `${this.path}logout`,
      passport.authenticate('cookie', { session: false }),
      this.authController.logOut
    );
  }
}

export const authRoute = new AuthRoute();
