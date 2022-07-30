import { AppDomain } from '@/interfaces/misc.interface';
import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { registrationSchema } from '@/validators/users.validator';
import { getPermissions } from '@/middlewares/permissions.middleware';
import { authenticateUser } from '@/middlewares/auth.middleware';

export class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public domain: AppDomain = 'users';
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authenticateUser('jwt', 'errorMessages.invalidToken'),
      getPermissions('users', 'read'),
      this.usersController.getUsers
    );

    this.router.get(
      `${this.path}/:id`,
      authenticateUser('jwt', 'errorMessages.invalidToken'),
      this.usersController.getUserById
    );

    this.router.post(
      `${this.path}`,
      validationMiddleware(registrationSchema, 'body'),
      authenticateUser('jwt', 'errorMessages.invalidToken'),
      this.usersController.createUser
    );

    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(registrationSchema, 'body'),
      authenticateUser('jwt', 'errorMessages.invalidToken'),
      this.usersController.updateUser
    );

    this.router.delete(
      `${this.path}/:id`,
      authenticateUser('jwt', 'errorMessages.invalidToken'),
      this.usersController.deleteUser
    );
  }
}

export const usersRoute = new UsersRoute();
