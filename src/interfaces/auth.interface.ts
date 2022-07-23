import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  sub: string;
}

export interface TokenData {
  token: string;
  expiresIn: string | number;
}

export interface RequestWithUser extends Request {
  user: User;
}
