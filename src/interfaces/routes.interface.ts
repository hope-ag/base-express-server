import { Router } from 'express';
import { AppDomain } from './misc.interface';

export interface Routes {
  path?: string;
  domain: AppDomain;
  router: Router;
}
