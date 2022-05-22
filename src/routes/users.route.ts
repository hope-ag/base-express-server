import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware('access'),
      this.usersController.getUsers
    );

    this.router.get(
      `${this.path}/:id`,
      authMiddleware('access'),
      this.usersController.getUserById
    );

    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateUserDto, 'body'),
      authMiddleware('access'),
      this.usersController.createUser
    );

    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateUserDto, 'body', true),
      authMiddleware('access'),
      this.usersController.updateUser
    );

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware('access'),
      this.usersController.deleteUser
    );
  }
}

export default new UsersRoute();
