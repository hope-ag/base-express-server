import { Router } from 'express';
import { AppDomain } from './app.interface';

export interface Routes {
  path?: string;
  domain: AppDomain;
  router: Router;
}
