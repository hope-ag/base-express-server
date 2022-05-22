import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  _id: string;
  role: string;
}

export interface TokenData {
  token: string;
  expiresIn: string | number;
}

export interface RequestWithUser extends Request {
  user: User;
}
