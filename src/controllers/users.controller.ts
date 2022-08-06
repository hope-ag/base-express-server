import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import UserService from '@services/users.service';
import { sendSuccessResponse } from '@/common/core/httpResponse';

class UsersController {
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User[] = await this.userService.findAllUser();

      sendSuccessResponse(req, res, userData, 200);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: User = await this.userService.findUserById(userId);

      sendSuccessResponse(req, res, userData, 200);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.userService.createUser(userData);
      sendSuccessResponse(req, res, createUserData, 201);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      sendSuccessResponse(req, res, updateUserData, 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deletedData: User = await this.userService.deleteUser(userId);

      sendSuccessResponse(req, res, deletedData, 200);
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
