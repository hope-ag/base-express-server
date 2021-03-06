import { AppDomain } from '@/interfaces/misc.interface';
import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';
export class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public domain: AppDomain = 'app';
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
  }
}

export const indexRoute = new IndexRoute();
